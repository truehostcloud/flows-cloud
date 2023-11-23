import { fetcher } from "./fetcher";
import type { components } from "./schema";
import type { Endpoint } from "./types";

type Schemas = components["schemas"];

type Api = {
  "/projects/:projectId/flows": Endpoint<Schemas["GetFlowsDto"][], [string]>;
  "/organizations/:organizationId/projects": Endpoint<Schemas["GetProjectsDto"][], [string]>;
};

export const api: Api = {
  "/projects/:projectId/flows": (projectId) => fetcher(`/projects/${projectId}/flows`),
  "/organizations/:organizationId/projects": (organizationId) =>
    fetcher(`/organizations/${organizationId}/projects`),
};
