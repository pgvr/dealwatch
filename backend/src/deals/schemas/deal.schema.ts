import * as mongoose from "mongoose";

export const DealSchema = new mongoose.Schema(
    {
        name: String,
        category: Number,
        date: Date,
        percent: Number,
        link: String,
        price_new: Number,
        price_old: Number,
        seller: String,
    },
    { collection: "items" },
);
