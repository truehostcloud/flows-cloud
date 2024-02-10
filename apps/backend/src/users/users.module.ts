import { Module } from "@nestjs/common";

import { OrganizationsService } from "../organizations/organizations.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, OrganizationsService],
})
export class UsersModule {}
