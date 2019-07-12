import { Injectable } from "@angular/core";
import { Filter } from "../interfaces/filter";
import { SortField, SortDirection } from "./deals.service";

@Injectable({
    providedIn: "root",
})
export class FilterService {
    private _activeFilter: Filter;
    availableFilter: Filter[] = [
        {
            field: SortField.date,
            direction: SortDirection.asc,
        },
    ];

    constructor() {}

    public get activeFilter(): Filter {
        return this._activeFilter;
    }

    public set activeFilter(v: Filter) {
        this._activeFilter = v;
    }
}
