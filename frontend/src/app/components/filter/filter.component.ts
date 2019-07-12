import { Component, OnInit } from "@angular/core";
import { CategoriesService } from "src/app/services/categories.service";

@Component({
    selector: "app-filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
    constructor(public categoriesService: CategoriesService) {}

    ngOnInit() {
        if (this.categoriesService.categories.length === 0) {
            this.categoriesService.getCategories();
        }
    }
}
