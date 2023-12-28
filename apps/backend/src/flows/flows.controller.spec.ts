import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { FlowsControllers } from "./flows.controller";
import type { UpdateFlowDto } from "./flows.dto";
import { FlowsService } from "./flows.service";

let flowsController: FlowsControllers;
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
    db.groupBy.mockResolvedValue([{ count: 1, type: "type" }]);
    db.where.mockImplementationOnce(
      jest.fn(function returnThis() {
        return this as typeof db;
      }),
    );
    db.where.mockResolvedValueOnce([{ count: 2 }]);
  });
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowDetail({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
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
      preview_stats: [
        { count: 1, type: "type" },
        { count: 2, type: "uniqueUsers" },
      ],
    });
  });
});

describe("Get flow analytics", () => {
  beforeEach(() => {
    db.leftJoin.mockResolvedValueOnce([{ count: 1 }]);
    db.leftJoin.mockImplementationOnce(
      jest.fn(function returnThis() {
        return this as typeof db;
      }),
    );
    db.orderBy.mockResolvedValue([{ count: 2 }]);
  });
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowAnalytics({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlowAnalytics({ userId: "userId" }, "flowId")).rejects.toThrow(
      "project not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(flowsController.getFlowAnalytics({ userId: "userId" }, "flowId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return flow analytics", async () => {
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
    data: JSON.stringify({ el: "newEl" }),
    human_id: "new human id",
    published: true,
    description: "new description",
  };
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockResolvedValue(null);
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).rejects.toThrow(
      "Not Found",
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
  it("should not create new version without data", async () => {
    await expect(
      flowsController.updateFlow({ userId: "userId" }, "flowId", {
        ...data,
        data: undefined,
      }),
    ).resolves.toEqual({
      id: "flowId",
      preview_stats: [
        { count: 1, type: "type" },
        { count: 2, type: "uniqueUsers" },
      ],
    });
    expect(db.insert).not.toHaveBeenCalled();
  });
  it("should create new version and update flow", async () => {
    await expect(flowsController.updateFlow({ userId: "userId" }, "flowId", data)).resolves.toEqual(
      {
        id: "flowId",
        preview_stats: [
          { count: 1, type: "type" },
          { count: 2, type: "uniqueUsers" },
        ],
      },
    );
    expect(db.insert).toHaveBeenCalled();
    expect(db.update).toHaveBeenCalled();
    expect(db.set).toHaveBeenCalledWith({
      flow_version_id: "newVerId",
      name: "newName",
      updated_at: expect.any(Date),
      description: "new description",
      published_at: expect.any(Date),
      human_id: "new human id",
    });
  });
});

// describe("Create flow", () => {
//   const data = { name: "newName", data: JSON.stringify({ el: "newEl" }) };
//   it("should throw without project", async () => {
//     db.query.projects.findFirst.mockResolvedValue(null);
//     await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
//       "project not found",
//     );
//   });
//   it("should throw without access to organization", async () => {
//     db.query.organizations.findFirst.mockResolvedValue({
//       organizationsToUsers: [],
//     });
//     await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
//       "Forbidden",
//     );
//   });
//   it("should throw without new flow", async () => {
//     db.returning.mockResolvedValue([]);
//     await expect(flowsController.createFlow({ userId: "userId" }, "projId", data)).rejects.toThrow(
//       "failed to create flow",
//     );
//   });
// });

// describe("Delete flow", () => {
//   it("should throw without flow", async () => {
//     db.query.flows.findFirst.mockResolvedValue(null);
//     await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "Not Found",
//     );
//   });
//   it("should throw without project", async () => {
//     db.query.projects.findFirst.mockResolvedValue(null);
//     await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "project not found",
//     );
//   });
//   it("should throw without access to organization", async () => {
//     db.query.organizations.findFirst.mockResolvedValue({
//       organizationsToUsers: [],
//     });
//     await expect(flowsController.deleteFlow({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "Forbidden",
//     );
//   });
//   it("should delete flow", async () => {
//     await expect(
//       flowsController.deleteFlow({ userId: "userId" }, "flowId"),
//     ).resolves.toBeUndefined();
//     expect(db.delete).toHaveBeenCalled();
//   });
// });

// describe("Get flow versions", () => {
//   beforeEach(() => {
//     db.query.flowVersions.findMany.mockResolvedValue([{ id: "flowVerId" }]);
//   });
//   it("should throw without flow", async () => {
//     db.query.flows.findFirst.mockResolvedValue(null);
//     await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "Not Found",
//     );
//   });
//   it("should throw without project", async () => {
//     db.query.projects.findFirst.mockResolvedValue(null);
//     await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "project not found",
//     );
//   });
//   it("should throw without access to organization", async () => {
//     db.query.organizations.findFirst.mockResolvedValue({
//       organizationsToUsers: [],
//     });
//     await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).rejects.toThrow(
//       "Forbidden",
//     );
//   });
//   it("should return flow versions", async () => {
//     await expect(flowsController.getFlowVersions({ userId: "userId" }, "flowId")).resolves.toEqual([
//       { id: "flowVerId" },
//     ]);
//   });
// });
