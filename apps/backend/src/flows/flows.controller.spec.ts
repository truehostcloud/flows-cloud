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
  groupBy: jest.fn(),
};

beforeEach(async () => {
  db.query.projects.findFirst.mockResolvedValue({ id: "projId" });
  db.query.flows.findMany.mockResolvedValue([{ id: "flowId" }]);
  db.query.flows.findFirst.mockResolvedValue({ id: "flowId" });
  db.query.organizations.findFirst.mockResolvedValue({
    usersToOrganizations: [{ user_id: "userId" }],
  });
  db.groupBy.mockResolvedValue([{ count: 1 }]);

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
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlows({ userId: "userId" }, "projId")).rejects.toThrow(
      "organization not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      usersToOrganizations: [{ user_id: "notUserId" }],
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
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "organization not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      usersToOrganizations: [{ user_id: "notUserId" }],
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
