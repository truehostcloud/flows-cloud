import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { FlowsControllers } from "./flows.controller";
import { FlowsService } from "./flows.service";

let flowsController: FlowsControllers;
const db = {
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
  },
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

beforeEach(async () => {
  db.query.projects.findFirst.mockResolvedValue({ id: "projId" });
  db.query.flows.findMany.mockResolvedValue([{ id: "flowId" }]);
  db.query.flows.findFirst.mockResolvedValue({ id: "flowId" });
  db.query.organizations.findFirst.mockResolvedValue({
    organizationsToUsers: [{ user_id: "userId" }],
  });

  const moduleRef = await Test.createTestingModule({
    controllers: [FlowsControllers],
    providers: [FlowsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
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
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlows({ userId: "userId" }, "projId")).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.getFlows({ userId: "userId" }, "projId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return flows", async () => {
    await expect(flowsController.getFlows({ userId: "userId" }, "projId")).resolves.toEqual([
      { id: "flowId" },
    ]);
  });
});

describe("Get flow detail", () => {
  beforeEach(() => {
    db.groupBy.mockResolvedValue([{ count: 1 }]);
  });
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "flow not found",
    );
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return flow", async () => {
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).resolves.toEqual({
      id: "flowId",
      daily_stats: [{ count: 1 }],
    });
  });
});

describe("Update flow", () => {
  beforeEach(() => {
    db.returning.mockResolvedValue([{ id: "newVerId" }]);
    db.where.mockResolvedValue(undefined);
  });
  const data = { name: "newName", data: JSON.stringify({ el: "newEl" }) };
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "flow not found",
    );
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should throw without new version", async () => {
    db.returning.mockResolvedValue([]);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "failed to create new version",
    );
  });
  it("should create new version and update flow", async () => {
    await expect(
      flowsController.updateFlow({ userId: "userId" }, "flowId", data),
    ).resolves.toBeUndefined();
    expect(db.insert).toHaveBeenCalled();
    expect(db.update).toHaveBeenCalled();
    expect(db.set).toHaveBeenCalledWith({
      flow_version_id: "newVerId",
      name: "newName",
      updated_at: expect.any(Date),
    });
  });
});

describe("Create flow", () => {
  const data = { name: "newName", data: JSON.stringify({ el: "newEl" }) };
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should throw without new flow", async () => {
    db.returning.mockResolvedValue([]);
    await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
      "failed to create flow",
    );
  });
});

describe("Delete flow", () => {
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
      "flow not found",
    );
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should delete flow", async () => {
    await expect(
      flowsController.deleteFlow({ userId: "userId" }, "flowId"),
    ).resolves.toBeUndefined();
    expect(db.delete).toHaveBeenCalled();
  });
});
