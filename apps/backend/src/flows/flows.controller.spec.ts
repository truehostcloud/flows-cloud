import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { FlowsController } from "./flows.controller";
import { FlowsService } from "./flows.service";

const flows = [{ id: "f1h", steps: [], element: "e1" }];

let flowsController: FlowsController;
const db = {
  query: {
    projects: {
      findFirst: jest.fn(),
    },
    flows: {
      findMany: jest.fn(),
    },
  },
};

beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [FlowsController],
    providers: [FlowsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  flowsController = moduleRef.get(FlowsController);
});

describe("Get Flows", () => {
  it("should throw without projectId", async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- part of the test
      // @ts-expect-error
      flowsController.getFlows(null),
    ).rejects.toThrow("projectId is required");
  });
  it("should throw without requestDomain", async () => {
    await expect(flowsController.getFlows("a", null)).rejects.toThrow("host is required");
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockReturnValue(null);
    await expect(flowsController.getFlows("a", "b")).rejects.toThrow("project not found");
  });
  it("should throw with incorrect domain", async () => {
    db.query.projects.findFirst.mockReturnValue({ id: "a", domains: ["b"] });
    await expect(flowsController.getFlows("a", "c")).rejects.toThrow("domain not allowed");
  });
  it("should return flows", async () => {
    db.query.flows.findMany.mockReturnValue([
      { id: "f1", human_id: "f1h", name: "F1", version: { data: { steps: [], element: "e1" } } },
    ]);
    const result = await flowsController.getFlows("a", "b");
    expect(result).toEqual(flows);
  });
});
