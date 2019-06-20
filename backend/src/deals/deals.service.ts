import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Deal } from "./interfaces/deal.interface";

@Injectable()
export class DealsService {
    constructor(@InjectModel("Deal") private readonly dealModel: Model<Deal>) {}

    async findAll(category: string, start: number, limit: number): Promise<Deal[]> {
        const deals = await this.dealModel
            .find({ category })
            .skip(start)
            .limit(limit)
            .exec();
        return deals;
    }

    async searchItems(category: string, start: number, limit: number, query: string): Promise<Deal[]> {
        const deals = await this.dealModel
            .find({ $text: { $search: query }, category })
            .skip(start)
            .limit(limit)
            .exec();
        return deals;
    }
}
