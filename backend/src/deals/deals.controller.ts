import { Controller, Get, Param, Query, HttpException } from "@nestjs/common";
import { DealsService, SortField, SortDirection } from "./deals.service";
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
        @Query("sort_field") sortField: SortField,
        @Query("sort_direction") sortDirection: SortDirection,
    ): Promise<Deal[]> {
        // Category is always needed
        if (!category) {
            throw new HttpException("Category must be defined", 500);
        }
        if (query) {
            return this.dealService.searchItems(
                Number(category),
                Number(start),
                Number(limit),
                query,
                sortField,
                sortDirection,
            );
        } else {
            return this.dealService.findAll(Number(category), Number(start), Number(limit), sortField, sortDirection);
        }
    }
}
