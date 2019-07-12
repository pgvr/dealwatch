import { Injectable } from "@angular/core";
import { Filter } from "../interfaces/filter";
import { SortField, SortDirection } from "./deals.service";
import { Category } from "../interfaces/category";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class FilterService {
    private _activeFilter: Filter;
    availableFilter: Filter[] = [
        {
            field: SortField.name,
            direction: SortDirection.asc,
        },
        {
            field: SortField.name,
            direction: SortDirection.desc,
        },
        {
            field: SortField.date,
            direction: SortDirection.asc,
        },
        {
            field: SortField.date,
            direction: SortDirection.desc,
        },
        {
            field: SortField.percent,
            direction: SortDirection.asc,
        },
        {
            field: SortField.percent,
            direction: SortDirection.desc,
        },
        {
            field: SortField.price,
            direction: SortDirection.asc,
        },
        {
            field: SortField.price,
            direction: SortDirection.desc,
        },
    ];
    categories: Category[] = [];
    private _activeCategory: Category;
    private _minPercent: number;
    private _priceFrom: number;
    private _priceTo: number;

    constructor(private http: HttpClient) {}

    async getCategories() {
        const response = await this.http.get<Category[]>(this.buildApiUrl()).toPromise();
        this.categories = response;
        return response;
    }

    private buildApiUrl() {
        return `${environment.apiUrl}/categories`;
    }

    public get activeCategory(): Category {
        return this._activeCategory;
    }

    public set activeCategory(v: Category) {
        this._activeCategory = v;
    }

    public get minPercent(): number {
        return this._minPercent;
    }

    public set minPercent(v: number) {
        this._minPercent = v !== 0 ? v : null;
    }

    public get priceFrom(): number {
        return this._priceFrom;
    }

    public set priceFrom(v: number) {
        this._priceFrom = v !== 0 ? v : null;
    }

    public get priceTo(): number {
        return this._priceTo;
    }

    public set priceTo(v: number) {
        this._priceTo = v !== 0 ? v : null;
    }

    public get activeFilter(): Filter {
        return this._activeFilter;
    }

    public set activeFilter(v: Filter) {
        this._activeFilter = v;
    }
}
