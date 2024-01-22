import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { getDefaultCssTemplate, getDefaultCssVars } from "../lib/css";

@ApiTags("css")
@Controller("css")
export class CssController {
  @Get("vars")
  getDefaultCssVars(): Promise<string> {
    return getDefaultCssVars();
  }

  @Get("template")
  getDefaultCssTemplate(): Promise<string> {
    return getDefaultCssTemplate();
  }
}
