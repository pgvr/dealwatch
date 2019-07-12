import { SortField, SortDirection } from "../services/deals.service";

export interface Filter {
    readonly field: SortField;
    readonly direction: SortDirection;
}
