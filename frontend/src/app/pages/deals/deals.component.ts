import { Component, OnInit } from "@angular/core";
import { DealsService } from "src/app/services/deals.service";

@Component({
    selector: "app-deals",
    templateUrl: "./deals.component.html",
    styleUrls: ["./deals.component.scss"],
})
export class DealsComponent implements OnInit {
    constructor(public dealsService: DealsService) {}

    ngOnInit() {
        // Only fetch deals on init if they are empty
        if (this.dealsService.deals.length === 0) {
            this.dealsService.getDeals(1, 0, 100);
        }
    }
}
