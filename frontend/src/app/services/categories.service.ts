import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Category } from "../interfaces/category";

@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    categories: Category[] = [];
    private _activeCategory: Category;
    constructor(private http: HttpClient) {}

    async getCategories() {
        const response = await this.http.get<Category[]>(this.buildApiUrl()).toPromise();
        this.categories = response;
        return response;
    }

    private buildApiUrl() {
        return `${environment.apiUrl}/categories`;
    }

    public get activeCategory(): Category {
        return this._activeCategory;
    }

    public set activeCategory(v: Category) {
        this._activeCategory = v;
    }
}
