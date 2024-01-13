import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { minutes, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import cors from "cors";

import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { DbPermissionModule } from "./db-permission/db-permission.module";
import { EmailModule } from "./email/email.module";
import { FlowsModule } from "./flows/flows.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { ProjectsModule } from "./projects/projects.module";
import { SdkModule } from "./sdk/sdk.module";
import { UsersModule } from "./users/users.module";

const publicRoutes: string[] = ["/sdk/flows", "/sdk/events", "/sdk/flows/:flowId"];

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: minutes(1),
        limit: 250,
      },
    ]),
    DatabaseModule,
    DbPermissionModule,
    EmailModule,
    SdkModule,
    FlowsModule,
    ProjectsModule,
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        cors({
          origin: ["https://app.flows.sh", "https://app.stage.flows.sh", "http://localhost:6001"],
        }),
      )
      .exclude(...publicRoutes)
      .forRoutes("(.*)");

    consumer.apply(cors()).forRoutes(...publicRoutes);
  }
}
