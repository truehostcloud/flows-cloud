import type { Metadata } from "next";

import { AuthWrapper } from "../auth-wrapper";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Flows",
};

export default function Login(): JSX.Element {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
