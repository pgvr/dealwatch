import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DealsComponent } from "./deals/deals.component";

const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "deals",
        component: DealsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
