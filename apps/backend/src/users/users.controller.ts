import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { type Auth, Authorization } from "../auth";
import type { AcceptInviteResponseDto, GetMeDto } from "./users.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  me(@Authorization() auth: Auth): Promise<GetMeDto> {
    return this.usersService.me({ auth });
  }

  @Post("invites/:inviteId/accept")
  acceptInvite(
    @Authorization() auth: Auth,
    @Param("inviteId") inviteId: string,
  ): Promise<AcceptInviteResponseDto> {
    return this.usersService.acceptInvite({ auth, inviteId });
  }
}
