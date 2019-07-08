import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.loader.processors import MapCompose, TakeFirst, Identity
import sys
import pymongo
from pymongo import ReplaceOne
import json
import logging

import credentials
import datetime

category = sys.argv[1]
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
    _id = scrapy.Field()
    category = scrapy.Field()
    date = scrapy.Field()
    percent = scrapy.Field()
    name = scrapy.Field()
    link = scrapy.Field()
    priceNew = scrapy.Field()
    priceOld = scrapy.Field()
    seller = scrapy.Field()
    dataFrom = scrapy.Field()
    createdAt = scrapy.Field()


class DealItemLoader(scrapy.loader.ItemLoader):
    default_output_processor = TakeFirst()

    _id_in = Identity()
    category_in = MapCompose(lambda v: int(v))
    date_in = MapCompose(lambda v: datetime.datetime.strptime(v, "%d.%m.%Y, %H:%M"))
    percent_in = MapCompose(lambda v: float(v[:-1].replace(",", ".")))
    priceNew_in = MapCompose(lambda v: float(v[2:].replace(",", ".")))
    priceOld_in = MapCompose(lambda v: float(v[2:].replace(",", ".")))
    seller_in = MapCompose(lambda v: v[6:])
    link_in = MapCompose(lambda v: "https://www.geizhals.de/" + v)
    dataFrom_in = Identity()


class JsonPipeline(object):
    def __init__(self):
        self.file = open("items.json", "w")

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + ",\n"
        self.file.write(line)
        return item


class MongoPipeline(object):
    collection_name = "items"

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI"),
            mongo_db=crawler.settings.get("MONGO_DATABASE"),
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

        self.items = self.db.items
        self.items.create_index("createdAt", expireAfterSeconds=60 * 60 * 24)
        self.items.create_index([("name", pymongo.TEXT)])

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[self.collection_name].replace_one(
            {"_id": item["_id"]}, dict(item), upsert=True
        )
        return item


class DealSpider(scrapy.Spider):

    name = "Deal_Spider"
    start_urls = [
        "https://geizhals.de/?bpnew=" + str(hours) + "&thres=20&kats=" + str(category)
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
            "priceNew": response.xpath(
                '//*[@id="gh_content_wrapper"]/p/b/span/text()'
            ).getall(),
            "priceOld": response.xpath(
                '//*[@id="gh_content_wrapper"]/p/span/text()'
            ).getall(),
            "seller": response.xpath('//*[@id="gh_content_wrapper"]/p/text()').getall()[
                4::6
            ],
            "dataFrom": response.xpath(
                '//*[contains(concat( " ", @class, " " ), concat( " ", "prews", " " ))]/text()'
            ).getall(),
        }

        for i in range(0, len(output["date"]) - 1):
            loader = DealItemLoader(item=DealItem())
            loader.add_value("_id", output["link"][i])
            loader.add_value("category", category)
            loader.add_value("date", output["date"][i])
            loader.add_value("percent", output["percent"][i])
            loader.add_value("name", output["name"][i])
            loader.add_value("link", output["link"][i])
            loader.add_value("priceNew", output["priceNew"][i])
            loader.add_value("priceOld", output["priceOld"][i])
            loader.add_value("seller", output["seller"][i])
            # loader.add_value("dataFrom", output["dataFrom"][0])
            loader.add_value("createdAt", datetime.datetime.utcnow())
            yield loader.load_item()


settings = scrapy.settings.Settings(
    {
        "ITEM_PIPELINES": {  # "__main__.JsonPipeline": 300,
            "__main__.MongoPipeline": 100
        },
        "LOG_LEVEL": "DEBUG",
        "MONGO_URI": credentials.db["uri"],
        "MONGO_DATABASE": "geizhalsdb",
    }
)

process = CrawlerProcess(settings)
process.crawl(DealSpider)
process.start()
