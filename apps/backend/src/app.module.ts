import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import cors from "cors";

import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { EventsModule } from "./events/events.module";

const publicRoutes: string[] = ["/events"];

@Module({
  imports: [ConfigModule.forRoot(), EventsModule, DatabaseModule],
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
