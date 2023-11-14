import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { SupabaseService } from "../supabase.service";
import { EventsController } from "./events.controller";
import type { CreateEventDto } from "./events.dto";
import { EventsService } from "./events.service";

let eventsController: EventsController;
const supabase = {
  from: jest.fn(),
  insert: jest.fn(),
};

beforeEach(async () => {
  supabase.from.mockReturnThis();
  supabase.insert.mockReturnThis();

  const moduleRef = await Test.createTestingModule({
    controllers: [EventsController],
    providers: [EventsService],
  })

    .useMocker((token) => {
      if (token === SupabaseService) {
        return { supabase };
      }
    })
    .compile();

  eventsController = moduleRef.get(EventsController);
});

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

describe("Create", () => {
  it("should throw with error", async () => {
    supabase.insert.mockReturnValue({ error: { message: "error" } });
    await expect(eventsController.create(createEventDto)).rejects.toThrow(
      new BadRequestException("error"),
    );
  });
  it("should insert into database", async () => {
    expect(await eventsController.create(createEventDto)).toBeUndefined();
    expect(supabase.from).toHaveBeenCalledWith("user_event");
    expect(supabase.insert).toHaveBeenCalled();
  });
});
