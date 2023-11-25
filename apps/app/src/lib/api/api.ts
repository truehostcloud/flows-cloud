import { fetcher } from "./fetcher";
import type { components } from "./schema";
import type { Endpoint } from "./types";

type Schemas = components["schemas"];

export type OrganizationPreview = Schemas["GetOrganizationsDto"];
export type OrganizationDetail = Schemas["GetOrganizationDetailDto"];
export type ProjectPreview = Schemas["GetProjectsDto"];
export type ProjectDetail = Schemas["GetProjectDetailDto"];
export type FlowPreview = Schemas["GetFlowsDto"];
export type FlowDetail = Schemas["GetFlowDetailDto"];
export type UpdateFlow = Schemas["UpdateFlowDto"];
export type CreateFlow = Schemas["UpdateFlowDto"];

type Api = {
  "/organizations": Endpoint<OrganizationPreview[]>;
  "/organizations/:organizationId": Endpoint<OrganizationDetail, [string]>;
  "/organizations/:organizationId/projects": Endpoint<ProjectPreview[], [string]>;
  "/projects/:projectId": Endpoint<ProjectDetail, [string]>;
  "/projects/:projectId/flows": Endpoint<FlowPreview[], [string]>;
  "/flows/:flowId": Endpoint<FlowDetail, [string]>;
  "PATCH /flows/:flowId": Endpoint<FlowDetail, [string, UpdateFlow]>;
  "POST /projects/:projectId/flows": Endpoint<FlowPreview, [string, CreateFlow]>;
  "DELETE /flows/:flowId": Endpoint<void, [string]>;
};

export const api: Api = {
  "/organizations": () => fetcher("/organizations"),
  "/organizations/:organizationId": (organizationId) => fetcher(`/organizations/${organizationId}`),
  "/organizations/:organizationId/projects": (organizationId) =>
    fetcher(`/organizations/${organizationId}/projects`),
  "/projects/:projectId": (projectId) => fetcher(`/projects/${projectId}`),
  "/projects/:projectId/flows": (projectId) => fetcher(`/projects/${projectId}/flows`),
  "/flows/:flowId": (flowId) => fetcher(`/flows/${flowId}`),
  "PATCH /flows/:flowId": (flowId, body) => fetcher(`/flows/${flowId}`, { method: "PATCH", body }),
  "POST /projects/:projectId/flows": (projectId, body) =>
    fetcher(`/projects/${projectId}/flows`, { method: "POST", body }),
  "DELETE /flows/:flowId": (flowId) => fetcher(`/flows/${flowId}`, { method: "DELETE" }),
};
