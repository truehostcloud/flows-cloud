import { createParams } from "lib/create-params";

export const routes = {
  home: "/",
  login: (params?: { message?: string }) => `/login${createParams(params)}`,
  authCallback: "/auth/callback",
  organization: (params: { organizationId: string }) => `/org/${params.organizationId}`,
  project: (params: { projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}`,
  projectSettings: (params: { projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/settings`,
  flow: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}`,
  flowSteps: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}/steps`,
  flowSettings: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}/settings`,
  dashboard: "/dashboard",
};
