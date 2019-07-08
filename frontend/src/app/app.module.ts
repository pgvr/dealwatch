/* Modules */
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./pages/app-routing.module";

/* Components */
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { DealCardComponent } from "./components/deal-card/deal-card.component";
import { DealsComponent } from './pages/deals/deals.component';

@NgModule({
    declarations: [AppComponent, HeaderComponent, HomeComponent, DealCardComponent, DealsComponent],
    imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
