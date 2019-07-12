import { Component } from "@angular/core";
import { DealsService } from "./services/deals.service";
import { CategoriesService } from "./services/categories.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    title = "dealwatch";
}
