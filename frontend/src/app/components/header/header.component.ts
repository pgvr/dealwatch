import { Component, OnInit, HostListener } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { FilterService } from 'src/app/services/filter.service';
import { DealsService } from 'src/app/services/deals.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  searchModel = '';

  constructor(private filterService: FilterService, private dealsService: DealsService) {}

  ngOnInit() {}

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  search() {
    console.log(`searching for ${this.searchModel}`);
    this.getDealsWithParameters();
  }

  getDealsWithParameters() {
    const categoryIndex = this.filterService.activeCategory._id;
    const startIndex = this.dealsService.page * this.dealsService.dealsPerPage;
    const limit = (this.dealsService.page + 1) * this.dealsService.dealsPerPage - 1;
    const minPercent = this.filterService.minPercent;
    const priceFrom = this.filterService.priceFrom;
    const priceTo = this.filterService.priceTo;
    if (this.filterService.activeFilter) {
        const sortField = this.filterService.activeFilter.field;
        const sortDirection = this.filterService.activeFilter.direction;
        this.dealsService.getDealsWithQuery(
            categoryIndex,
            this.searchModel,
            startIndex,
            limit,
            minPercent,
            priceFrom,
            priceTo,
            sortField,
            sortDirection,
        );
    } else {
        this.dealsService.getDealsWithQuery(categoryIndex, this.searchModel, startIndex, limit, minPercent, priceFrom, priceTo);
    }
}
}
