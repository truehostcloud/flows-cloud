import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { DbPermissionService } from "./db-permission.service";

let dbPermissionService: DbPermissionService;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
const getDB = () => ({
  query: {
    projects: {
      findFirst: jest.fn(),
    },
    organizations: {
      findFirst: jest.fn(),
    },
    flows: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    flowVersions: {
      findMany: jest.fn(),
    },
  },
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  fullJoin: jest.fn().mockReturnThis(),
  with: jest.fn().mockReturnThis(),
  $with: jest.fn().mockReturnThis(),
  selectDistinct: jest.fn().mockReturnThis(),
  as: jest.fn().mockReturnThis(),
});
let db = getDB();

beforeEach(async () => {
  db = getDB();
  db.query.projects.findFirst.mockResolvedValue({ id: "projectId" });
  db.query.flows.findMany.mockResolvedValue([{ id: "flowId" }]);
  db.query.flows.findFirst.mockResolvedValue({
    id: "flowId",
    draftVersion: { data: { steps: [], userProperties: [] } },
  });
  db.query.organizations.findFirst.mockResolvedValue({
    organizationsToUsers: [{ organization_id: "orgId", user_id: "userId" }],
  });

  const moduleRef = await Test.createTestingModule({
    providers: [DbPermissionService],
    exports: [DbPermissionService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  dbPermissionService = moduleRef.get(DbPermissionService);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("doesUserHaveAccessToFlow", () => {
  it("should throw without flow", async () => {
    db.where.mockReset();
    db.where.mockResolvedValue([]);
    await expect(
      dbPermissionService.doesUserHaveAccessToFlow({
        auth: { userId: "userId" },
        flowId: "flowId",
      }),
    ).rejects.toThrow("Not Found");
  });

  it("should throw without project", async () => {
    db.where.mockReset();
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
  it("should throw without access to organization", async () => {
    db.where.mockReset();
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
    ).rejects.toThrow("Forbidden");
  });
});

describe("doesUserHaveAccessToProject", () => {
  it("should throw without project", async () => {
    db.where.mockReset();
    db.where.mockResolvedValue([]);
    await expect(
      dbPermissionService.doesUserHaveAccessToProject({
        auth: { userId: "userId" },
        projectId: "projectId",
      }),
    ).rejects.toThrow("Not Found");
  });

  it("should throw without project", async () => {
    db.where.mockReset();
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
        projectId: null,
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
    db.where.mockReset();
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
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
});
