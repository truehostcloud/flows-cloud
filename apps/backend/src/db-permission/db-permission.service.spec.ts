import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import type { MockDB } from "../mocks";
import { getMockDB } from "../mocks";
import { DbPermissionService } from "./db-permission.service";

let dbPermissionService: DbPermissionService;

let db: MockDB;

beforeEach(async () => {
  db = getMockDB();

  const moduleRef = await Test.createTestingModule({
    providers: [DbPermissionService],
    exports: [DbPermissionService],
  })
    .useMocker((token) => {
      if (token === DatabaseService) return { db };
    })
    .compile();
  dbPermissionService = moduleRef.get(DbPermissionService);
});

describe("doesUserHaveAccessToFlow", () => {
  beforeEach(() => {
    db.where.mockResolvedValue([
      {
        flowId: "flowId",
        projectId: "projectId",
        organizationId: "orgId",
        organizationToUser: { organization_id: "orgId", user_id: "userId" },
      },
    ]);
  });
  it("should throw without results", async () => {
    db.where.mockResolvedValue([]);
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without project", async () => {
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
        projectId: null,
        organizationId: null,
        organizationToUser: null,
      },
    ]);
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without organization", async () => {
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
        projectId: "projectId",
        organizationId: null,
        organizationToUser: null,
      },
    ]);
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access to organization", async () => {
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
        projectId: "projectId",
        organizationId: "orgId",
        organizationToUser: null,
      },
    ]);
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).rejects.toThrow("Forbidden");
  });
  it("should return true with access", async () => {
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).resolves.toBeTruthy();
  });
});

describe("doesUserHaveAccessToProject", () => {
  beforeEach(() => {
    db.where.mockResolvedValue([
      {
        projectId: "projectId",
        organizationId: "orgId",
        organizationToUser: { organization_id: "orgId", user_id: "userId" },
      },
    ]);
  });

  it("should throw without results", async () => {
    db.where.mockResolvedValue([]);
    await expect(
      dbPermissionService.doesUserHaveAccessToProject({
        auth: { userId: "userId" },
        projectId: "projectId",
      }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without organizationId", async () => {
    db.where.mockResolvedValueOnce([
      {
        projectId: "projectId",
        organizationId: null,
        organizationToUser: null,
      },
    ]);
    await expect(
      dbPermissionService.doesUserHaveAccessToProject({
        auth: { userId: "userId" },
        projectId: "projectId",
      }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access to organization", async () => {
    db.where.mockResolvedValueOnce([
      {
        projectId: "projectId",
        organizationId: "orgId",
        organizationToUser: null,
      },
    ]);
    await expect(
      dbPermissionService.doesUserHaveAccessToProject({
        auth: { userId: "userId" },
        projectId: "projectId",
      }),
    ).rejects.toThrow("Forbidden");
  });
  it("should return true with access", async () => {
    await expect(
      dbPermissionService.doesUserHaveAccessToProject({
        auth: { userId: "userId" },
        projectId: "projectId",
      }),
    ).resolves.toBeTruthy();
  });
});
