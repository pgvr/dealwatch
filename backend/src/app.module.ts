import { Module } from "@nestjs/common";
import { DealsModule } from "./deals/deals.module";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";
import { resolve } from "path";
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
    ],
})
export class AppModule {}
