import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import cors from "cors";

import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { FlowsModule } from "./flows/flows.module";
import { SdkModule } from "./sdk/sdk.module";

const publicRoutes: string[] = ["/events", "/flows"];

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, SdkModule, FlowsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        cors({
          origin: [
            "https://app.flows.sh",
            "https://app.stage.flows.sh",
            "http://localhost:3000",
            "http://localhost:3001",
          ],
        }),
      )
      .exclude(...publicRoutes)
      .forRoutes("(.*)");

    consumer.apply(cors()).forRoutes(...publicRoutes);
  }
}
