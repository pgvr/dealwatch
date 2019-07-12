import { Component, OnInit } from "@angular/core";
import { CategoriesService } from "src/app/services/categories.service";
import { Category } from "src/app/interfaces/category";
import { FilterService } from "src/app/services/filter.service";
import { Filter } from "src/app/interfaces/filter";

@Component({
    selector: "app-filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
    constructor(public categoriesService: CategoriesService, public filterService: FilterService) {}

    ngOnInit() {
        if (this.categoriesService.categories.length === 0) {
            this.categoriesService.getCategories();
        }
    }

    setActiveCategory(category: Category): void {
        if (category !== this.categoriesService.activeCategory) {
            this.categoriesService.activeCategory = category;
            // get new deals
        }
    }

    setActiveFilter(filter: Filter): void {
        if (filter !== this.filterService.activeFilter) {
            this.filterService.activeFilter = filter;
            // get new deals
        }
    }
}
