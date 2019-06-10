import scrapy
from scrapy.crawler import CrawlerProcess
import json
import sys

index = sys.argv[1]

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

# Usage: "python3 GetDeals.py [1-14]" where 1-14 is the category without the braces


class Spider(scrapy.Spider):

    name = "Deal_Spider"
    start_urls = [
        'https://geizhals.de/?bpnew=2&thres=20&kats=' + str(index)
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
        category = categories[str(index)]
        file_object = open(category + '.json', 'w')
        # Remove unnecessary bracket at the beginning
        sellerIndex = 0
        for value in output['seller']:
            output['seller'][sellerIndex] = value[6:]
            sellerIndex = sellerIndex + 1
        json.dump(output, file_object)


process = CrawlerProcess()
process.crawl(Spider)
process.start()
