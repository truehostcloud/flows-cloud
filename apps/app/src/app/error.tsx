"use client";

import { PageError } from "components/ui/page-error";

export default function Error(props): JSX.Element {
  return <PageError {...props} title="Something went wrong" />;
}
