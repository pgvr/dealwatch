import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Deal } from "./interfaces/deal.interface";

@Injectable()
export class DealsService {
    constructor(@InjectModel("Deal") private readonly dealModel: Model<Deal>) {}

    /**
     * Get items by category
     * @param category
     * @param start amount of items to skip
     * @param limit amount of items to return
     * @param sortField
     * @param sortDirection
     */
    async findAll(
        category: number,
        start: number,
        limit: number,
        sortField: SortField,
        sortDirection: SortDirection,
    ): Promise<Deal[]> {
        const deals = await this.dealModel
            .find({ category })
            .skip(start)
            .limit(limit)
            .sort(this.getSortingObject(sortField, sortDirection))
            .exec();
        return deals;
    }

    /**
     * Uses the text index to search items by category
     * @param category
     * @param start amount of items to skip
     * @param limit amount of items to return
     * @param query search string
     * @param sortField
     * @param sortDirection
     */
    async searchItems(
        category: number,
        start: number,
        limit: number,
        query: string,
        sortField: SortField,
        sortDirection: SortDirection,
    ): Promise<Deal[]> {
        const deals = await this.dealModel
            .find({ $text: { $search: query }, category })
            .skip(start)
            .limit(limit)
            .sort(this.getSortingObject(sortField, sortDirection))
            .exec();
        return deals;
    }

    /**
     * Construct the object which is passed into the sort function
     * This is needed to easily make the default available
     * @param sortField
     * @param sortDirection
     */
    getSortingObject(sortField: SortField, sortDirection: SortDirection) {
        switch (sortField) {
            case SortField.date:
                return { date: this.getSortingDirectionNumber(sortDirection) };
            case SortField.name:
                return { name: this.getSortingDirectionNumber(sortDirection) };
            case SortField.percent:
                return { percent: this.getSortingDirectionNumber(sortDirection) };
            case SortField.price:
                return { priceNew: this.getSortingDirectionNumber(sortDirection) };
            default:
                return {};
        }
    }

    /**
     * Mongo needs a "1" for ascending sorting and "-1" for descending
     * Since this can be mixed up easily this is abstracted to the enum
     * @param sortDirection
     */
    getSortingDirectionNumber(sortDirection: SortDirection): number {
        return sortDirection === SortDirection.asc ? 1 : -1;
    }
}

export enum SortField {
    price = "price",
    percent = "percent",
    name = "name",
    date = "date",
}

export enum SortDirection {
    asc = "asc",
    desc = "desc",
}
