"use client";

import { PageError } from "components/ui/page-error";

export default function OrganizationError(props): JSX.Element {
  return <PageError {...props} title="Error loading organization" />;
}
