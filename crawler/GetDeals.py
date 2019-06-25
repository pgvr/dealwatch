import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.loader.processors import Join, MapCompose, TakeFirst, Identity
import sys
import pymongo
from pymongo import ReplaceOne
import json
import time

import credentials
import datetime

dbUri = credentials.db["uri"]
client = pymongo.MongoClient(dbUri)
geizhalsdb = client.geizhalsdb
items = geizhalsdb.items
items.ensure_index("createdAt", expireAfterSeconds=60 * 60 * 24)
items.create_index([("name", pymongo.TEXT)])
index = sys.argv[1]
hours = sys.argv[2]

categories = {
    "1": "Hardware",
    "2": "Software",
    "3": "Games",
    "4": "Videos/Fotos/TV",
    "5": "Telefon&Co",
    "6": "Audio/HiFi",
    "7": "Filme",
    "8": "Haushalt",
    "9": "Sport&Freizeit",
    "10": "Drogerie",
    "11": "Auto&Motorrad",
    "12": "Spielzeug&Modellbau",
    "13": "Baumarkt&Garten",
    "14": "Büro&Schule",
}

# Usage: "python3 GetDeals.py [1-14] [2/12/24]" where 1-14 is the category without the braces and 2/12/24 the time frame in hours


class DealItem(scrapy.Item):
    date = scrapy.Field()
    percent = scrapy.Field()
    name = scrapy.Field()
    link = scrapy.Field()
    price_new = scrapy.Field()
    price_old = scrapy.Field()
    seller = scrapy.Field()
    data_from = scrapy.Field()


class DealItemLoader(scrapy.loader.ItemLoader):
    default_input_processor = MapCompose(str.strip)
    default_output_processor = TakeFirst()

    data_from_in = Identity()
    percent_in = MapCompose(lambda v: v[:-1])
    price_new_in = MapCompose(lambda v: v[2:])
    price_old_in = MapCompose(lambda v: v[2:])
    seller_in = MapCompose(lambda v: v[6:])
    link_in = MapCompose(lambda v: "https://www.geizhals.de/" + v)


class JsonWriterPipeline(object):
    def __init__(self):
        self.file = open("items.json", "w")

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item


class Spider(scrapy.Spider):

    name = "Deal_Spider"
    start_urls = [
        "https://geizhals.de/?bpnew=" + str(hours) + "&thres=20&kats=" + str(index)
    ]

    def parse(self, response):
        output = {
            "date": response.xpath(
                '//*[@id = "gh_content_wrapper"]/p/time/text()'
            ).getall(),
            "percent": response.xpath(
                '//*[@id="gh_content_wrapper"]/p/b/text()'
            ).getall(),
            "name": response.xpath("//p//a/text()").getall(),
            "link": response.xpath("//p//a/@href").getall(),
            "price_new": response.xpath(
                '//*[@id="gh_content_wrapper"]/p/b/span/text()'
            ).getall(),
            "price_old": response.xpath(
                '//*[@id="gh_content_wrapper"]/p/span/text()'
            ).getall(),
            "seller": response.xpath('//*[@id="gh_content_wrapper"]/p/text()').getall()[
                4::6
            ],
            "data_from": response.xpath(
                '//*[contains(concat( " ", @class, " " ), concat( " ", "prews", " " ))]/text()'
            ).getall(),
        }

        for i in range(0, len(output["date"]) - 1):
            loader = DealItemLoader(item=DealItem())
            loader.add_value("date", output["date"][i])
            loader.add_value("percent", output["percent"][i])
            loader.add_value("name", output["name"][i])
            loader.add_value("link", output["link"][i])
            loader.add_value("price_new", output["price_new"][i])
            loader.add_value("price_old", output["price_old"][i])
            loader.add_value("seller", output["seller"][i])
            loader.add_value("data_from", output["data_from"][0])
            yield loader.load_item()

        # # Remove unnecessary characters
        # output["percent"][:] = (value[:-1] for value in output["percent"])
        # output["price_new"][:] = (value[2:] for value in output["price_new"])
        # output["price_old"][:] = (value[2:] for value in output["price_old"])
        # output["seller"][:] = (value[6:] for value in output["seller"])

        # # Add domain to product links
        # for i in range(0, len(output["link"])):
        #     output["link"][i] = "https://www.geizhals.de/" + output["link"][i]

        bulk_ops = []
        # for i in range(1, len(output["date"])):
        #     # generate "unique" id to avoid inserting the same deal multiple times
        #     # _id must be unique in mongo
        #     # createdAt is also an index with a TTL of 24 hours from the utc_timestamp
        #     utc_timestamp = datetime.datetime.utcnow()
        #     itemDateString = output["date"][i - 1]
        #     dateobj = datetime.datetime.strptime(itemDateString, "%d.%m.%Y, %H:%M")
        #     obj = {
        #         "_id": str(output["link"][i - 1]),
        #         "category": int(index),
        #         "date": dateobj,
        #         "percent": float(output["percent"][i - 1].replace(",", ".")),
        #         "name": output["name"][i - 1],
        #         "link": output["link"][i - 1],
        #         "priceNew": float(output["price_new"][i - 1].replace(",", ".")),
        #         "priceOld": float(output["price_old"][i - 1].replace(",", ".")),
        #         "seller": output["seller"][i - 1],
        #         "createdAt": utc_timestamp,
        #     }
        #     request = ReplaceOne({"_id": obj["_id"]}, obj, upsert=True)
        #     bulk_ops.append(request)
        # items.bulk_write(bulk_ops)


# process = CrawlerProcess({"ITEM_PIPELINES", {"__main__.JsonWriterPipeline": 100}})

settings = scrapy.settings.Settings(
    {
        # piplines start with the project/module name so replace with __main__
        "ITEM_PIPELINES": {"__main__.JsonWriterPipeline": 100}
    }
)
process = CrawlerProcess(settings)

process.crawl(Spider)

a = time.time()
process.start()
b = time.time()
print("!!!!!! ", b - a)
