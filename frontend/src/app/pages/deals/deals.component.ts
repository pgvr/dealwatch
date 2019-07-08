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
        this.dealsService.getDeals(1, 0, 10);
    }
}
