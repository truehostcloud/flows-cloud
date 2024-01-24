import { Module } from "@nestjs/common";

import { CssController } from "./css.controller";

@Module({
  controllers: [CssController],
})
export class CssModule {}
