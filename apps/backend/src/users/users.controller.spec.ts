import { Test } from "@nestjs/testing";
import { organizationsToUsers, userInvite } from "db";

import { DatabaseService } from "../database/database.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

let usersController: UsersController;
const db = {
  query: {
    users: {
      findFirst: jest.fn(),
    },
    userInvite: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

beforeEach(async () => {
  db.query.users.findFirst.mockResolvedValue({
    id: "userId",
    email: "email",
  });
  db.query.userInvite.findMany.mockResolvedValue([
    {
      id: "inviteId",
      expires_at: new Date(),
      organization: {
        name: "orgName",
      },
    },
  ]);
  db.query.userInvite.findFirst.mockResolvedValue({
    id: "inviteId",
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    organization_id: "orgId",
    email: "email",
  });

  const moduleRef = await Test.createTestingModule({
    controllers: [UsersController],
    providers: [UsersService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  usersController = moduleRef.get(UsersController);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Get me", () => {
  it("should throw without user", async () => {
    db.query.users.findFirst.mockResolvedValue(null);
    await expect(usersController.me({ userId: "userId" })).rejects.toThrow("Not Found");
  });
  it("should not return invites without email", async () => {
    db.query.users.findFirst.mockResolvedValue({
      id: "userId",
      email: null,
    });
    await expect(usersController.me({ userId: "userId" })).resolves.toEqual({
      pendingInvites: [],
    });
  });
  it("should return invites", async () => {
    await expect(usersController.me({ userId: "userId" })).resolves.toEqual({
      pendingInvites: [
        {
          id: "inviteId",
          expires_at: expect.any(Date),
          organizationName: "orgName",
        },
      ],
    });
  });
});

describe("Accept invite", () => {
  it("should throw without invite", async () => {
    db.query.userInvite.findFirst.mockResolvedValue(null);
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without user", async () => {
    db.query.users.findFirst.mockResolvedValue(null);
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw with expired invite", async () => {
    db.query.userInvite.findFirst.mockResolvedValue({
      id: "inviteId",
      expires_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    });
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).rejects.toThrow(
      "Invite expired",
    );
  });
  it("should throw with user without email", async () => {
    db.query.users.findFirst.mockResolvedValue({
      id: "userId",
      email: null,
    });
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw with mismatched email", async () => {
    db.query.users.findFirst.mockResolvedValue({
      id: "userId",
      email: "email2",
    });
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should accept invite", async () => {
    await expect(usersController.acceptInvite({ userId: "userId" }, "inviteId")).resolves.toEqual({
      organization_id: "orgId",
    });
    expect(db.insert).toHaveBeenCalledWith(organizationsToUsers);
    expect(db.delete).toHaveBeenCalledWith(userInvite);
  });
});
