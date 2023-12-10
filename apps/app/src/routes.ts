import { createParams } from "lib/create-params";

export const routes = {
  login: (params?: { message?: string }) => `/login${createParams(params)}`,
  authCallback: "/auth/callback",

  home: "/",
  organization: (params: { organizationId: string }) => `/org/${params.organizationId}`,
  organizationSettings: (params: { organizationId: string }) =>
    `/org/${params.organizationId}/settings`,

  project: (params: { projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}`,
  projectSettings: (params: { projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/settings`,

  flow: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}`,
  flowSteps: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}/steps`,
  flowVersions: (params: {
    flowId: string;
    projectId: string;
    organizationId: string;
    versionId?: string;
  }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}/versions${
      params.versionId ? `/${params.versionId}` : ""
    }`,
  flowSettings: (params: { flowId: string; projectId: string; organizationId: string }) =>
    `/org/${params.organizationId}/project/${params.projectId}/flow/${params.flowId}/settings`,
};
