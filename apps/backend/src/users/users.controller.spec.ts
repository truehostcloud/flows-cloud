import { Test } from "@nestjs/testing";
import { organizationsToUsers, userInvite } from "db";

import { DatabaseService } from "../database/database.service";
import { DbPermissionService } from "../db-permission/db-permission.service";
import { EmailService } from "../email/email.service";
import { verifyCaptcha } from "../lib/captcha";
import { getMockDbPermissionService, type MockDbPermissionService } from "../mocks";
import type { MockOrganizationsService } from "../mocks/organizations-service";
import { getMockOrganizationsService } from "../mocks/organizations-service";
import { NewsfeedService } from "../newsfeed/newsfeed.service";
import { OrganizationsService } from "../organizations/organizations.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

jest.mock("../lib/captcha", () => ({
  verifyCaptcha: jest.fn(),
}));

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
const emailService = {
  createContact: jest.fn(),
};
const newsfeedService = {
  postMessage: jest.fn(),
};

let dbPermissionService: MockDbPermissionService;
let organizationsService: MockOrganizationsService;

beforeEach(async () => {
  dbPermissionService = getMockDbPermissionService();
  organizationsService = getMockOrganizationsService();
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
      if (token === EmailService) {
        return emailService;
      }
      if (token === NewsfeedService) {
        return newsfeedService;
      }
      if (token === DbPermissionService) {
        return dbPermissionService;
      }
      if (token === OrganizationsService) {
        return organizationsService;
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

describe("Join waitlist", () => {
  beforeEach(() => {
    (verifyCaptcha as jest.Mock).mockResolvedValue({ success: true });
    emailService.createContact.mockResolvedValue({ success: true });
  });
  it("should throw with invalid captcha", async () => {
    (verifyCaptcha as jest.Mock).mockResolvedValue({ success: false });
    await expect(
      usersController.joinWaitlist({ captchaToken: "cap", email: "mail@examplec.com" }),
    ).rejects.toThrow("Invalid captcha");
  });
  it("should throw with createContact success", async () => {
    emailService.createContact.mockResolvedValue({ success: false, message: "message" });
    await expect(
      usersController.joinWaitlist({ captchaToken: "cap", email: "mail@examplec.com" }),
    ).rejects.toThrow("message");
    expect(emailService.createContact).toHaveBeenCalledWith({ email: "mail@examplec.com" });
  });
  it("should call postMessage", async () => {
    await expect(
      usersController.joinWaitlist({ captchaToken: "cap", email: "mail@examplec.com" }),
    ).resolves.toBeUndefined();
    expect(newsfeedService.postMessage).toHaveBeenCalled();
  });
});
