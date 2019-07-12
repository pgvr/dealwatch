import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";
import { resolve } from "path";
import { CategoriesModule } from "./categories/categories.module";
import { DealsModule } from "./deals/deals.module";
config({ path: resolve(__dirname, "../../.env") });
const uri = process.env.DATABASE_URI || "";

@Module({
    imports: [
        DealsModule,
        MongooseModule.forRoot(
            // tslint:disable-next-line: max-line-length
            uri,
            {
                useNewUrlParser: true,
            },
        ),
        CategoriesModule,
    ],
})
export class AppModule {}
