import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DealsController } from "./deals.controller";
import { DealsService } from "./deals.service";
import { DealSchema } from "./schemas/deal.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: "Deal", schema: DealSchema }])],
    controllers: [DealsController],
    providers: [DealsService],
    exports: [DealsService],
})
export class DealsModule {}
