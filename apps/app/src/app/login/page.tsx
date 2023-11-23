import { css } from "@flows/styled-system/css";
import { signIn, signUp } from "auth/server";
import { Button, Input } from "ui";

import Messages from "./messages";

export default function Login(): JSX.Element {
  return (
    <form
      action={signIn}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "space16",
        maxWidth: "320px",
        mx: "auto",
        my: "space64",
      })}
    >
      <Input
        inputClassName={css({ width: "100%" })}
        label="Email"
        name="email"
        placeholder="you@example.com"
        required
        wrapperClassName={css({ display: "block", mt: "space4" })}
      />
      <Input
        inputClassName={css({ width: "100%" })}
        label="Password"
        name="password"
        required
        type="password"
        wrapperClassName={css({ display: "block", mt: "space4" })}
      />
      <Messages />
      <div className={css({ display: "flex", gap: "space12" })}>
        <Button type="submit">Sign In</Button>
        <Button formAction={signUp} type="submit" variant="black">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
