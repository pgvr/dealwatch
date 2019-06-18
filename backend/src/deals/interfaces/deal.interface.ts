import { Document } from "mongoose";

export interface Deal extends Document {
    readonly name: string;
    readonly category: string;
    readonly date: string;
    readonly percent: string;
    readonly link: string;
    readonly priceNew: string;
    readonly priceOld: string;
    readonly seller: string;
}
