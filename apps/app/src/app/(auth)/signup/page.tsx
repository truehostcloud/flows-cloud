import type { Metadata } from "next";

import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Login | Flows",
};

//TODO: bring back the terms of service and privacy policy links when they are available

export default function SignUp(): JSX.Element {
  return (
    <>
      <SignUpForm />
      {/* <Text
        align="center"
        className={css({
          mt: "space24",
        })}
        color="muted"
        variant="bodyXs"
      >
        By creating an account, you agree to the{" "}
        <Link
          className={css({
            textDecoration: "underline",
            color: "text",
          })}
          href="TODO"
          target="_blank"
        >
          Terms of service
        </Link>{" "}
        and{" "}
        <Link
          className={css({
            textDecoration: "underline",
            color: "text",
          })}
          href="TODO"
          target="_blank"
        >
          Privacy policy
        </Link>
      </Text> */}
    </>
  );
}
