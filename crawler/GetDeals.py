import scrapy
from scrapy.crawler import CrawlerProcess
import sys
import pymongo
from pymongo import ReplaceOne
import credentials
import datetime

dbUri = credentials.db['uri']
client = pymongo.MongoClient(dbUri)
geizhalsdb = client.geizhalsdb
items = geizhalsdb.items
items.ensure_index('createdAt', expireAfterSeconds=60*60*24)
index = sys.argv[1]
hours = sys.argv[2]

categories = {
    '1': 'Hardware',
    '2': 'Software',
    '3': 'Games',
    '4': 'Videos/Fotos/TV',
    '5': 'Telefon&Co',
    '6': 'Audio/HiFi',
    '7': 'Filme',
    '8': 'Haushalt',
    '9': 'Sport&Freizeit',
    '10': 'Drogerie',
    '11': 'Auto&Motorrad',
    '12': 'Spielzeug&Modellbau',
    '13': 'Baumarkt&Garten',
    '14': 'Büro&Schule'
}

# Usage: "python3 GetDeals.py [1-14] [2/12/24]" where 1-14 is the category without the braces and 2/12/24 the time frame in hours


class Spider(scrapy.Spider):

    name = "Deal_Spider"
    start_urls = [
        'https://geizhals.de/?bpnew=' +
        str(hours) + '&thres=20&kats=' + str(index)
    ]
    def parse(self, response):

        output = {
            'date': response.css('time ::text').extract(),
            'percent': response.css('.pr_dn ::text').extract(),
            # Adjecent sibling selector
            'name': response.css('.pr_dn + a ::text').extract(),
            'link': response.css('.pr_dn + a ::attr(href)').extract(),
            'price_new': response.css('time + b + a + b ::text').extract(),
            'price_old': response.css('b + .gh_price ::text').extract(),
            'seller': response.xpath('//b/following-sibling::*[@class="gh_price"]/following-sibling::text()[starts-with(., ")")]').extract(),
            'data_from': response.css('.gh_stat_nav time ::text').extract(),
        }
        sellerIndex = 0
        for value in output['seller']:
            output['seller'][sellerIndex] = value[6:]
            sellerIndex = sellerIndex + 1

        bulk_ops = []
        for i in range(1, len(output['date'])):
            # generate "unique" id to avoid inserting the same deal multiple times
            # _id must be unique in mongo
            # createdAt is also an index with a TTL of 24 hours from the utc_timestamp
            utc_timestamp = datetime.datetime.utcnow()
            obj = {
                '_id': str(output['link'][i-1]),
                'category': str(index),
                'date': output['date'][i-1],
                'percent': output['percent'][i-1],
                'name': output['name'][i-1],
                'link': output['link'][i-1],
                'price_new': output['price_new'][i-1],
                'price_old': output['price_old'][i-1],
                'seller': output['seller'][i-1],
                'createdAt': utc_timestamp
            }
            request = ReplaceOne({'_id': obj['_id']}, obj, upsert=True)
            bulk_ops.append(request)
        items.bulk_write(bulk_ops)


process = CrawlerProcess()
process.crawl(Spider)
process.start()
