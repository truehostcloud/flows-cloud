export const verifyCaptcha = <T = { success: boolean } | undefined>(
  captchaToken: string,
): Promise<T> =>
  fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.BACKEND_CAPTCHA_SECRET}&response=${captchaToken}`,
  ).then((r) => r.json() as Promise<T>);
