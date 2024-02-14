const verifyVersion = (version: string): string => {
  if (version === "latest") return version;
  const isSemVer = /^\d+\.\d+\.\d+$/.test(version);
  if (isSemVer) return version;
  return "latest";
};

export const getDefaultCssVars = (version = "latest"): Promise<string> =>
  fetch(`https://cdn.jsdelivr.net/npm/@flows/js@${verifyVersion(version)}/css.min/vars.css`).then(
    (res) => res.text(),
  );

export const getDefaultCssTemplate = (version = "latest"): Promise<string> =>
  fetch(
    `https://cdn.jsdelivr.net/npm/@flows/js@${verifyVersion(version)}/css.min/template.css`,
  ).then((res) => res.text());
