import { Document } from "mongoose";

export interface Deal extends Document {
    readonly name: string;
    readonly category: number;
    readonly date: Date;
    readonly percent: number;
    readonly link: string;
    readonly priceNew: number;
    readonly priceOld: number;
    readonly seller: string;
}
