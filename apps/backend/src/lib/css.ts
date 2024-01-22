import fs from "node:fs/promises";

export const getDefaultCssVars = (): Promise<string> =>
  fs.readFile(`node_modules/@flows/js/css/vars.css`, {
    encoding: "utf-8",
  });

export const getDefaultCssTemplate = (): Promise<string> =>
  fs.readFile(`node_modules/@flows/js/css/template.css`, {
    encoding: "utf-8",
  });
