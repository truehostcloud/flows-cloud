"use client";

export default function FlowsError({ error }: { error: Error }): JSX.Element {
  return <>Flows error: {error.message}</>;
}
