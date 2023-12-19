"use client";

import { PageError } from "components/ui/page-error";

export default function ProjectSettingsError(props): JSX.Element {
  return <PageError {...props} title="Error loading project settings" />;
}
