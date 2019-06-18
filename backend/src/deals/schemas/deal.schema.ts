import * as mongoose from "mongoose";

export const DealSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        date: String,
        percent: String,
        link: String,
        priceNew: String,
        priceOld: String,
        seller: String,
    },
    { collection: "items" },
);
