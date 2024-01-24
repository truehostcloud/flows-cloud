import { Global, Module } from "@nestjs/common";

import { NewsfeedService } from "./newsfeed.service";

@Global()
@Module({
  providers: [NewsfeedService],
  exports: [NewsfeedService],
})
export class NewsfeedModule {}
