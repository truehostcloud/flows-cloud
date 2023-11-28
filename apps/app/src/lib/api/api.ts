import { fetcher } from "./fetcher";
import type { components } from "./schema";
import type { Endpoint } from "./types";

type Schemas = components["schemas"];

export type OrganizationPreview = Schemas["GetOrganizationsDto"];
export type OrganizationDetail = Schemas["GetOrganizationDetailDto"];
export type CreateOrganization = Schemas["CreateOrganizationDto"];
export type ProjectPreview = Schemas["GetProjectsDto"];
export type ProjectDetail = Schemas["GetProjectDetailDto"];
export type UpdateProject = Schemas["UpdateProjectDto"];
export type CreateProject = Schemas["CreateProjectDto"];
export type FlowPreview = Schemas["GetFlowsDto"];
export type FlowDetail = Schemas["GetFlowDetailDto"];
export type UpdateFlow = Schemas["UpdateFlowDto"];
export type CreateFlow = Schemas["CreateFlowDto"];

type Api = {
  "/organizations": Endpoint<OrganizationPreview[]>;
  "POST /organizations": Endpoint<OrganizationDetail, [CreateOrganization]>;
  "/organizations/:organizationId": Endpoint<OrganizationDetail, [string]>;
  "DELETE /organizations/:organizationId": Endpoint<void, [string]>;
  "/organizations/:organizationId/projects": Endpoint<ProjectPreview[], [string]>;
  "/projects/:projectId": Endpoint<ProjectDetail, [string]>;
  "PUT /projects/:projectId": Endpoint<ProjectDetail, [string, UpdateProject]>;
  "DELETE /projects/:projectId": Endpoint<void, [string]>;
  "/projects/:projectId/flows": Endpoint<FlowPreview[], [string]>;
  "POST /organizations/:organizationId/projects": Endpoint<ProjectDetail, [string, CreateProject]>;
  "/flows/:flowId": Endpoint<FlowDetail, [string]>;
  "PUT /flows/:flowId": Endpoint<FlowDetail, [string, UpdateFlow]>;
  "POST /projects/:projectId/flows": Endpoint<FlowPreview, [string, CreateFlow]>;
  "DELETE /flows/:flowId": Endpoint<void, [string]>;
};

export const api: Api = {
  "/organizations": () => fetcher("/organizations"),
  "POST /organizations": (body) => fetcher("/organizations", { method: "POST", body }),
  "/organizations/:organizationId": (organizationId) => fetcher(`/organizations/${organizationId}`),
  "DELETE /organizations/:organizationId": (organizationId) =>
    fetcher(`/organizations/${organizationId}`, { method: "DELETE" }),
  "/organizations/:organizationId/projects": (organizationId) =>
    fetcher(`/organizations/${organizationId}/projects`),
  "/projects/:projectId": (projectId) => fetcher(`/projects/${projectId}`),
  "PUT /projects/:projectId": (projectId, body) =>
    fetcher(`/projects/${projectId}`, { method: "PUT", body }),
  "DELETE /projects/:projectId": (projectId) =>
    fetcher(`/projects/${projectId}`, { method: "DELETE" }),
  "POST /organizations/:organizationId/projects": (organizationId, body) =>
    fetcher(`/organizations/${organizationId}/projects`, { method: "POST", body }),
  "/projects/:projectId/flows": (projectId) => fetcher(`/projects/${projectId}/flows`),
  "/flows/:flowId": (flowId) => fetcher(`/flows/${flowId}`),
  "PUT /flows/:flowId": (flowId, body) => fetcher(`/flows/${flowId}`, { method: "PUT", body }),
  "POST /projects/:projectId/flows": (projectId, body) =>
    fetcher(`/projects/${projectId}/flows`, { method: "POST", body }),
  "DELETE /flows/:flowId": (flowId) => fetcher(`/flows/${flowId}`, { method: "DELETE" }),
};
