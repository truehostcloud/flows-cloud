import { Test } from "@nestjs/testing";
import { events, flows } from "db";

import { DatabaseService } from "../database/database.service";
import { SdkController } from "./sdk.controller";
import type { CreateEventDto } from "./sdk.dto";
import { SdkService } from "./sdk.service";

let sdkController: SdkController;
const db = {
  query: {
    projects: {
      findFirst: jest.fn(),
    },
    flows: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(),
};

beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [SdkController],
    providers: [SdkService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  sdkController = moduleRef.get(SdkController);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Get flows", () => {
  const mockFlows = [{ id: "f1h", steps: [], element: "e1" }];

  it("should throw without projectId", async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- part of the test
      // @ts-expect-error
      sdkController.getFlows(null),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without requestDomain", async () => {
    await expect(sdkController.getFlows("a", "")).rejects.toThrow("Origin is required");
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockReturnValue(null);
    await expect(sdkController.getFlows("a", "b")).rejects.toThrow("Not Found");
  });
  it("should return flows", async () => {
    db.query.projects.findFirst.mockReturnValue({ id: "p1" });
    db.query.flows.findMany.mockReturnValue([
      { id: "f1", human_id: "f1h", name: "F1", version: { data: { steps: [], element: "e1" } } },
    ]);
    const result = await sdkController.getFlows("a", "b");
    expect(result).toEqual(mockFlows);
  });
});

describe("Create event", () => {
  const createEventDto: CreateEventDto = {
    type: "a",
    eventTime: new Date(),
    flowId: "b",
    stepIndex: "c",
    userHash: "d",
    flowHash: "e",
    stepHash: "f",
    projectId: "g",
  };
  const project = {
    id: "pid",
  };
  const flow = {
    id: "fid",
  };
  beforeEach(() => {
    db.query.projects.findFirst.mockReturnValue(project);
    db.query.flows.findFirst.mockReturnValue(flow);
    db.returning.mockReturnValue([{ id: "newFlowId" }]);
  });

  it("should throw without requestDomain", async () => {
    await expect(sdkController.createEvent("", createEventDto)).rejects.toThrow(
      "Origin is required",
    );
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockReturnValue(null);
    await expect(sdkController.createEvent("origin", createEventDto)).rejects.toThrow(
      "project not found",
    );
  });
  it("should create local flow if it doesn't exists", async () => {
    db.query.flows.findFirst.mockReturnValue(null);
    await expect(sdkController.createEvent("origin", createEventDto)).resolves.toBeUndefined();
    expect(db.insert).toHaveBeenCalledWith(flows);
  });
  it("should throw with error", async () => {
    db.values.mockRejectedValueOnce(new Error());
    await expect(sdkController.createEvent("origin", createEventDto)).rejects.toThrow(
      "error saving event",
    );
  });
  it("should insert into database", async () => {
    await expect(sdkController.createEvent("origin", createEventDto)).resolves.toBeUndefined();
    expect(db.insert).toHaveBeenCalledWith(events);
    expect(db.values).toHaveBeenCalled();
  });
});
