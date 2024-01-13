import { Global, Module } from "@nestjs/common";

import { DbPermissionService } from "./db-permission.service";

@Global()
@Module({
  providers: [DbPermissionService],
  exports: [DbPermissionService],
})
export class DbPermissionModule {}
