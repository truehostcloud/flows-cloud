import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { EventsController } from "./events.controller";
import type { CreateEventDto } from "./events.dto";
import { EventsService } from "./events.service";

let eventsController: EventsController;
const db = {
  query: {
    projects: {
      findFirst: jest.fn(),
    },
    flows: {
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnThis(),
  values: jest.fn(),
};

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

beforeEach(async () => {
  db.query.projects.findFirst.mockReturnValue(project);
  db.query.flows.findFirst.mockReturnValue(flow);
  db.values.mockReturnValue(null);

  const moduleRef = await Test.createTestingModule({
    controllers: [EventsController],
    providers: [EventsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  eventsController = moduleRef.get(EventsController);
});

describe("Create", () => {
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockReturnValue(null);
    await expect(eventsController.create(createEventDto)).rejects.toThrow("project not found");
  });
  it("should throw without flow", async () => {
    db.query.flows.findFirst.mockReturnValue(null);
    await expect(eventsController.create(createEventDto)).rejects.toThrow("flow not found");
  });
  it("should throw with error", async () => {
    db.values.mockRejectedValue(new Error());
    await expect(eventsController.create(createEventDto)).rejects.toThrow("error saving event");
  });

  it("should insert into database", async () => {
    expect(await eventsController.create(createEventDto)).toBeUndefined();
    expect(db.insert).toHaveBeenCalled();
    expect(db.values).toHaveBeenCalled();
  });
});
