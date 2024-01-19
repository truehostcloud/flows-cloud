"use client";

import { PageError } from "components/ui/page-error";

export default function ProjectTemplateError(props): JSX.Element {
  return <PageError {...props} title="Error loading project template" />;
}
