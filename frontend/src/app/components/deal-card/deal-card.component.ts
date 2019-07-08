import { Component, OnInit, Input } from "@angular/core";
import { Deal } from "src/app/interfaces/deal";

@Component({
    selector: "app-deal-card",
    templateUrl: "./deal-card.component.html",
    styleUrls: ["./deal-card.component.scss"],
})
export class DealCardComponent implements OnInit {
    @Input() deal: Deal;
    constructor() {}

    ngOnInit() {}
}
