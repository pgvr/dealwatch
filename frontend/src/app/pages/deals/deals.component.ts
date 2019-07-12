import { Component, OnInit } from "@angular/core";
import { DealsService } from "src/app/services/deals.service";
import { FilterService } from "src/app/services/filter.service";

@Component({
    selector: "app-deals",
    templateUrl: "./deals.component.html",
    styleUrls: ["./deals.component.scss"],
})
export class DealsComponent implements OnInit {
    constructor(public dealsService: DealsService, public filterService: FilterService) {}

    async ngOnInit() {
        if (!this.filterService.activeCategory) {
            await this.filterService.getCategories();
            this.filterService.activeCategory = this.filterService.categories[0];
        }
        // Only fetch deals on init if they are empty
        if (!this.dealsService.deals) {
            const categoryIndex = this.filterService.activeCategory._id;
            const startIndex = this.dealsService.page * this.dealsService.dealsPerPage;
            const limit = (this.dealsService.page + 1) * this.dealsService.dealsPerPage - 1;
            this.dealsService.getDeals(categoryIndex, startIndex, limit, null, null, null);
        }
    }
}
