import { Injectable } from "@nestjs/common";
import { Category } from "./interfaces/category.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CategoriesService {
    constructor(@InjectModel("Category") private readonly categoryModel: Model<Category>) {}
    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryModel.find({}).exec();
        return categories;
    }
}
