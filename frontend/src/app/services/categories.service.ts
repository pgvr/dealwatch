import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Category } from "../interfaces/category";

@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    categories: Category[] = [];
    constructor(private http: HttpClient) {}

    async getCategories() {
        const response = await this.http.get<Category[]>(this.buildApiUrl()).toPromise();
        this.categories = response;
        return response;
    }

    private buildApiUrl() {
        return `${environment.apiUrl}/categories`;
    }
}
