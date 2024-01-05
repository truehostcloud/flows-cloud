"use client";

import { PageError } from "components/ui/page-error";

export default function DashboardError(props): JSX.Element {
  return <PageError {...props} title="Error loading dashboard" />;
}
