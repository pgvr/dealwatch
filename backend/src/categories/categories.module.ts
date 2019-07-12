import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesController } from "./categories.controller";
import { CategorySchema } from "./schemas/category.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
