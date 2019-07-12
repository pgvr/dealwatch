import { Component, OnInit } from "@angular/core";
import { CategoriesService } from "src/app/services/categories.service";
import { Category } from "src/app/interfaces/category";
import { FilterService } from "src/app/services/filter.service";
import { Filter } from "src/app/interfaces/filter";
import { DealsService } from "src/app/services/deals.service";

@Component({
    selector: "app-filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
    constructor(
        public categoriesService: CategoriesService,
        public filterService: FilterService,
        public dealsService: DealsService,
    ) {}

    ngOnInit() {
        if (this.categoriesService.categories.length === 0) {
            this.categoriesService.getCategories();
        }
    }

    setActiveCategory(category: Category): void {
        if (category !== this.categoriesService.activeCategory) {
            this.categoriesService.activeCategory = category;
            // get new deals
            const categoryIndex = this.categoriesService.activeCategory._id;
            const startIndex = this.dealsService.page * this.dealsService.dealsPerPage;
            const limit = (this.dealsService.page + 1) * this.dealsService.dealsPerPage - 1;
            this.dealsService.getDeals(categoryIndex, startIndex, limit);
        }
    }

    setActiveFilter(filter: Filter): void {
        if (filter !== this.filterService.activeFilter) {
            this.filterService.activeFilter = filter;
            // get new deals
            const categoryIndex = this.categoriesService.activeCategory._id;
            const startIndex = this.dealsService.page * this.dealsService.dealsPerPage;
            const limit = (this.dealsService.page + 1) * this.dealsService.dealsPerPage - 1;
            const sortField = this.filterService.activeFilter.field;
            const sortDirection = this.filterService.activeFilter.direction;
            this.dealsService.getDeals(categoryIndex, startIndex, limit, sortField, sortDirection);
        }
    }
}
