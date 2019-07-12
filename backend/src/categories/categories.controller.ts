import { Controller, Get } from "@nestjs/common";
import { Category } from "./interfaces/category.interface";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}
    @Get()
    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryService.getCategories();
        return categories;
    }
}
