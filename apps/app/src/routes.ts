import { createParams } from "lib/create-params";

export const routes = {
  home: "/",
  login: (params?: { message?: string }) => `/login${createParams(params)}`,
  authCallback: "/auth/callback",
  organization: (params: { organizationId: string }) => `/org/${params.organizationId}`,
  project: (params: { projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}`,
  flow: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}`,
  dashboard: "/dashboard",
};
