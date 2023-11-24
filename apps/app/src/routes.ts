import { createParams } from "lib/create-params";

export const routes = {
  home: "/",
  login: (params?: { message?: string }) => `/login${createParams(params)}`,
  authCallback: "/auth/callback",
  organization: (params: { organizationId: string }) => `/organizations/${params.organizationId}`,
  project: (params: { projectId: string }) => `/projects/${params.projectId}`,
  flow: (params: { flowId: string; message?: string }) => `/flows/${params.flowId}`,
};
