import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Deal } from "../interfaces/deal";

@Injectable({
    providedIn: "root",
})
export class DealsService {
    deals: Deal[];
    constructor(private http: HttpClient) {
        console.log(environment.apiUrl);
    }

    async getDeals(
        category: number,
        start: number,
        limit: number,
        sortField?: SortField,
        sortDirection?: SortDirection,
    ): Promise<Deal[]> {
        const response = await this.http
            .get<Deal[]>(this.buildApiUrl(category, start, limit, sortField, sortDirection))
            .toPromise();
        this.deals = response;
        return response;
    }

    async getDealsWithQuery(
        category: number,
        query: string,
        start = 0,
        limit = 10,
        sortField?: SortField,
        sortDirection?: SortDirection,
    ): Promise<Deal[]> {
        const response = await this.http
            .get<Deal[]>(this.buildApiUrl(category, start, limit, sortField, sortDirection, query))
            .toPromise();
        this.deals = response;
        return response;
    }

    private buildApiUrl(
        category: number,
        start: number,
        limit: number,
        sortField?: SortField,
        sortDirection?: SortDirection,
        query?: string,
    ) {
        return `${environment.apiUrl}/deals?category=${category}&start=${start}&limit=${limit}${
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
