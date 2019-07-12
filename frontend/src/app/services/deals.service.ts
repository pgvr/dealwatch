import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Deal } from "../interfaces/deal";

@Injectable({
    providedIn: "root",
})
export class DealsService {
    deals: Deal[] = [];
    dealsPerPage = 100;
    page = 0;
    loading = false;
    constructor(private http: HttpClient) {
        console.log(environment.apiUrl);
    }

    async getDeals(
        category: number,
        start: number,
        limit: number,
        minPercent: number,
        priceFrom: number,
        priceTo: number,
        sortField?: SortField,
        sortDirection?: SortDirection,
    ): Promise<Deal[]> {
        this.loading = true;
        const response = await this.http
            .get<Deal[]>(
                this.buildApiUrl(category, start, limit, minPercent, priceFrom, priceTo, sortField, sortDirection),
            )
            .toPromise();
        this.deals = response;
        this.loading = false;
        return response;
    }

    async getDealsWithQuery(
        category: number,
        query: string,
        start = 0,
        limit = 10,
        minPercent: number,
        priceFrom: number,
        priceTo: number,
        sortField?: SortField,
        sortDirection?: SortDirection,
    ): Promise<Deal[]> {
        this.loading = true;
        const response = await this.http
            .get<Deal[]>(
                this.buildApiUrl(
                    category,
                    start,
                    limit,
                    minPercent,
                    priceFrom,
                    priceTo,
                    sortField,
                    sortDirection,
                    query,
                ),
            )
            .toPromise();
        this.deals = response;
        this.loading = false;
        return response;
    }

    private buildApiUrl(
        category: number,
        start: number,
        limit: number,
        percentMin: number,
        priceFrom: number,
        priceTo: number,
        sortField?: SortField,
        sortDirection?: SortDirection,
        query?: string,
    ) {
        return `${environment.apiUrl}/deals?category=${category}&start=${start}&limit=${limit}${
            percentMin ? `&percentMin=${percentMin}` : ""
        }${priceFrom ? `&priceFrom=${priceFrom}` : ""}${priceTo ? `&priceTo=${priceTo}` : ""}${
            sortField ? `&sortField=${sortField}` : ""
        }${sortDirection ? `&sortDirection=${sortDirection}` : ""}${query ? `&query=${query}` : ""}`;
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
