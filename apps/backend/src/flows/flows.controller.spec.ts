import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { flows, flowVersions } from "db";
import { union } from "drizzle-orm/pg-core";

import { DatabaseService } from "../database/database.service";
import { DbPermissionService } from "../db-permission/db-permission.service";
import { FlowsControllers } from "./flows.controller";
import type { UpdateFlowDto } from "./flows.dto";
import { FlowsService } from "./flows.service";

let flowsController: FlowsControllers;

jest.mock("drizzle-orm/pg-core", (): unknown => ({
  ...jest.requireActual("drizzle-orm/pg-core"),
  union: jest.fn(),
}));

const getDbPermission = () => ({
  doesUserHaveAccessToProject: jest.fn(),
  doesUserHaveAccessToFlow: jest.fn(),
});

let dbPermissionService = getDbPermission();

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

  dbPermissionService = getDbPermission();
  dbPermissionService.doesUserHaveAccessToProject.mockResolvedValue(true);
  dbPermissionService.doesUserHaveAccessToFlow.mockResolvedValue(true);

  const moduleRef = await Test.createTestingModule({
    controllers: [FlowsControllers],
    providers: [FlowsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
      if (token === DbPermissionService) {
        return dbPermissionService;
      }
    })
    .compile();

  flowsController = moduleRef.get(FlowsControllers);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Get flows", () => {
  it("should throw without project", async () => {
    dbPermissionService.doesUserHaveAccessToProject.mockImplementationOnce(() => {
      throw new NotFoundException();
    });

    await expect(flowsController.getFlows({ userId: "userId" }, "projectId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should return flows", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockResolvedValue(true);
    db.where.mockResolvedValueOnce([
      {
        flowId: "flowId",
        projectId: "projectId",
        organizationId: "orgId",
        organizationToUser: {
          organization_id: "orgId",
          user_id: "userId",
        },
      },
    ]);
    await expect(flowsController.getFlows({ userId: "userId" }, "projectId")).resolves.toEqual([
      { id: "flowId" },
    ]);
  });
});

describe("Get flow detail", () => {
  beforeEach(() => {
    (union as jest.MockedFunction<typeof union>).mockResolvedValue([
      { count: 1, type: "type" },
      { count: 2, type: "uniqueUsers" },
    ]);
    db.where.mockResolvedValueOnce([
      {
        flow: {
          id: "flowId",
        },
        project: {},
        organization: {},
        organization_to_user: {
          organization_id: "orgId",
          user_id: "userId",
        },
        draftFlowVersion: {
          data: {
            steps: [],
            userProperties: [],
          },
        },
        publishedFlowVersion: null,
      },
    ]);
  });
  it("should throw without flow", async () => {
    db.where.mockReset();
    db.where.mockResolvedValue([]);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });

  it("should throw without access to organization", async () => {
    db.where.mockReset();

    db.where.mockResolvedValueOnce([
      {
        flow: {
          id: "flowId",
        },
        project: {
          id: "projectId",
        },
        organization: {},
        organization_to_user: null,
        draftFlowVersion: {
          data: {
            steps: [],
            userProperties: [],
          },
        },
        publishedFlowVersion: null,
      },
    ]);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return flow", async () => {
    const data = await flowsController.getFlowDetail({ userId: "userId" }, "flowId");

    expect(data).toEqual({
      id: "flowId",
      draftVersion: { steps: [], userProperties: [] },
      preview_stats: [
        { count: 1, type: "type" },
        { count: 2, type: "uniqueUsers" },
      ],
    });
  });
});

describe("Get flow analytics", () => {
  beforeEach(() => {
    db.orderBy.mockResolvedValue([{ count: 2 }]);
  });
  it("should throw without flow", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });

    await expect(flowsController.getFlowAnalytics({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should return flow analytics", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockResolvedValue(true);
    db.leftJoin.mockResolvedValueOnce([{ count: 1 }]);

    await expect(flowsController.getFlowAnalytics({ userId: "userId" }, "flowId")).resolves.toEqual(
      {
        daily_stats: [{ count: 1 }, { count: 2, type: "uniqueUsers" }],
      },
    );
  });
});

describe("Update flow", () => {
  beforeEach(() => {
    db.returning.mockResolvedValue([{ id: "newVerId" }]);
    db.groupBy.mockResolvedValue([{ count: 1, type: "type" }]);
    db.where.mockResolvedValueOnce(undefined);
    db.where.mockImplementationOnce(
      jest.fn(function returnThis() {
        return this as typeof db;
      }),
    );
    db.where.mockResolvedValueOnce([{ count: 2 }]);
  });
  const data: UpdateFlowDto = {
    name: "newName",
    element: "newEl",
    human_id: "new human id",
    enabled: true,
    description: "new description",
  };
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without project", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without new version", async () => {
    db.returning.mockResolvedValue([]);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "Failed to update data",
    );
  });
  it("should not create new version without data", async () => {
    await expect(
      flowsController.updateFlow({ userId: "userId" }, "flowId", {
        name: "newName",
      }),
    ).resolves.toBeUndefined();
    expect(db.insert).not.toHaveBeenCalled();
  });
  it("should create new version and update flow", async () => {
    await expect(
      flowsController.updateFlow({ userId: "userId" }, "flowId", data),
    ).resolves.toBeUndefined();
    expect(db.insert).toHaveBeenCalledWith(flowVersions);
    expect(db.update).toHaveBeenCalledWith(flows);
    expect(db.set).toHaveBeenCalledWith({
      draft_version_id: "newVerId",
      name: "newName",
      updated_at: expect.any(Date),
      description: "new description",
      enabled_at: expect.any(Date),
      human_id: "new human id",
    });
  });
});

describe("Create flow", () => {
  const data = { name: "newName", data: JSON.stringify({ el: "newEl" }) };
  it("should throw without project", async () => {
    dbPermissionService.doesUserHaveAccessToProject.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(
      flowsController.createFlow({ userId: "userId" }, "projectId", data),
    ).rejects.toThrow("Not Found");
  });

  it("should throw without new flow", async () => {
    db.returning.mockResolvedValue([]);
    await expect(
      flowsController.createFlow({ userId: "userId" }, "projectId", data),
    ).rejects.toThrow("failed to create flow");
  });
});

describe("Delete flow", () => {
  it("should throw without flow", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without project", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });

  it("should delete flow", async () => {
    await expect(
      flowsController.deleteFlow({ userId: "userId" }, "flowId"),
    ).resolves.toBeUndefined();
    expect(db.delete).toHaveBeenCalled();
  });
});

describe("Get flow versions", () => {
  beforeEach(() => {
    db.query.flowVersions.findMany.mockResolvedValue([{ id: "flowVerId" }]);
  });
  it("should throw without flow", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without project", async () => {
    dbPermissionService.doesUserHaveAccessToFlow.mockImplementationOnce(() => {
      throw new NotFoundException();
    });
    await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should return flow versions", async () => {
    await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).resolves.toEqual([
      { id: "flowVerId" },
    ]);
  });
});
