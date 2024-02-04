export const getDefaultCssVars = (version = "latest"): Promise<string> =>
  fetch(`https://cdn.jsdelivr.net/npm/@flows/js@${version}/css.min/vars.css`).then((res) =>
    res.text(),
  );

export const getDefaultCssTemplate = (version = "latest"): Promise<string> =>
  fetch(`https://cdn.jsdelivr.net/npm/@flows/js@${version}/css.min/template.css`).then((res) =>
    res.text(),
  );
