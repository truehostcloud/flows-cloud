import { fetcher } from "./fetcher";
import type { components } from "./schema";
import type { Endpoint } from "./types";

type Schemas = components["schemas"];

type Api = {
  "/organizations/:organizationId/projects": Endpoint<Schemas["GetProjectsDto"][], [string]>;
  "/projects/:projectId/flows": Endpoint<Schemas["GetFlowsDto"][], [string]>;
  "/flows/:flowId": Endpoint<Schemas["GetFlowDetailDto"], [string]>;
};

export const api: Api = {
  "/organizations/:organizationId/projects": (organizationId) =>
    fetcher(`/organizations/${organizationId}/projects`),
  "/projects/:projectId/flows": (projectId) => fetcher(`/projects/${projectId}/flows`),
  "/flows/:flowId": (flowId) => fetcher(`/flows/${flowId}`),
};
