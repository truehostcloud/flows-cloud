import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { verifyJwt } from "../lib/jwt";
import { FlowsControllers } from "./flows.controller";
import { FlowsService } from "./flows.service";

jest.mock("../lib/jwt");

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
    },
  },
};

beforeEach(async () => {
  (verifyJwt as jest.Mock).mockReturnValue({ userId: "userId" });
  db.query.projects.findFirst.mockResolvedValue({ id: "projId" });
  db.query.flows.findMany.mockResolvedValue([{ id: "flowId" }]);
  db.query.organizations.findFirst.mockResolvedValue({
    usersToOrganizations: [{ user_id: "userId" }],
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
  it("should throw without authorization", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(null);
    await expect(flowsController.getFlows("auth", "projId")).rejects.toThrow("Unauthorized");
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlows("auth", "projId")).rejects.toThrow("project not found");
  });
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(flowsController.getFlows("auth", "projId")).rejects.toThrow(
      "organization not found",
    );
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      usersToOrganizations: [{ user_id: "notUserId" }],
    });
    await expect(flowsController.getFlows("auth", "projId")).rejects.toThrow("Forbidden");
  });
  it("should return flows", async () => {
    const result = await flowsController.getFlows("auth", "projId");
    expect(result).toEqual([{ id: "flowId" }]);
  });
});
