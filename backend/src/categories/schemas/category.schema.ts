import * as mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema(
    {
        _id: Number,
        name: String,
    },
    { collection: "categories" },
);
