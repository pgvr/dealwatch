import { Controller, Get, Param, Query, HttpException } from "@nestjs/common";
import { DealsService } from "./deals.service";
import { Deal } from "./interfaces/deal.interface";

@Controller("deals")
export class DealsController {
    constructor(private readonly dealService: DealsService) {}

    @Get()
    async findAll(
        @Query("start") start = 0,
        @Query("limit") limit = 1,
        @Query("category") category: string,
        @Query("query") query: string,
    ): Promise<Deal[]> {
        if (!category) {
            throw new HttpException("Category must be defined", 500);
        }
        if (query) {
            return this.dealService.searchItems(category, Number(start), Number(limit), query);
        } else {
            return this.dealService.findAll(category, Number(start), Number(limit));
        }
    }
}
