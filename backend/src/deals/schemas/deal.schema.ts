import * as mongoose from "mongoose";

export const DealSchema = new mongoose.Schema(
    {
        name: String,
        category: Number,
        date: Date,
        percent: Number,
        link: String,
        priceNew: Number,
        priceOld: Number,
        seller: String,
    },
    { collection: "items" },
);
