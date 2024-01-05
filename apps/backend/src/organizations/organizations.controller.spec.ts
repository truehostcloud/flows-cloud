import { Test } from "@nestjs/testing";
import { organizations, organizationsToUsers, userInvite } from "db";

import { DatabaseService } from "../database/database.service";
import { EmailService } from "../email/email.service";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

let organizationsController: OrganizationsController;
const db = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  query: {
    organizations: {
      findFirst: jest.fn(),
    },
    userInvite: {
      findFirst: jest.fn(),
    },
    organizationsToUsers: {
      findMany: jest.fn(),
    },
  },
};
const emailService = {
  sendInvite: jest.fn(),
};

beforeEach(async () => {
  db.orderBy.mockResolvedValue([{ organization: { id: "org1" } }]);
  db.query.organizations.findFirst.mockResolvedValue({
    id: "org1",
    name: "org",
    organizationsToUsers: [{ user_id: "userId", user: {} }],
  });

  const moduleRef = await Test.createTestingModule({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
      if (token === EmailService) {
        return emailService;
      }
    })
    .compile();

  organizationsController = moduleRef.get(OrganizationsController);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Get organizations", () => {
  it("should return organizations", async () => {
    await expect(organizationsController.getOrganizations({ userId: "userId" })).resolves.toEqual([
      { id: "org1" },
    ]);
  });
});

describe("Get organization detail", () => {
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(
      organizationsController.getOrganizationDetail({ userId: "userId" }, "org1"),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access", async () => {
    db.query.organizations.findFirst.mockResolvedValue({ organizationsToUsers: [] });
    await expect(
      organizationsController.getOrganizationDetail({ userId: "userId" }, "org1"),
    ).rejects.toThrow("Forbidden");
  });
  it("should return organization", async () => {
    await expect(
      organizationsController.getOrganizationDetail({ userId: "userId" }, "org1"),
    ).resolves.toEqual({ id: "org1", name: "org" });
  });
});

describe("Create organization", () => {
  beforeEach(() => {
    db.returning.mockResolvedValue([{ id: "org1" }]);
  });
  it("should throw without organization", async () => {
    db.returning.mockResolvedValue([]);
    await expect(
      organizationsController.createOrganization({ userId: "userId" }, { name: "org1" }),
    ).rejects.toThrow("Failed to create organization");
  });
  it("should create organization and user connection and return organization", async () => {
    await expect(
      organizationsController.createOrganization({ userId: "userId" }, { name: "org1" }),
    ).resolves.toEqual({ id: "org1" });
    expect(db.insert).toHaveBeenCalledWith(organizations);
    expect(db.insert).toHaveBeenCalledWith(organizationsToUsers);
  });
});

describe("Delete organization", () => {
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(
      organizationsController.deleteOrganization({ userId: "userId" }, "org1"),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access", async () => {
    db.query.organizations.findFirst.mockResolvedValue({ organizationsToUsers: [] });
    await expect(
      organizationsController.deleteOrganization({ userId: "userId" }, "org1"),
    ).rejects.toThrow("Forbidden");
  });
  it("should delete organization", async () => {
    await expect(
      organizationsController.deleteOrganization({ userId: "userId" }, "org1"),
    ).resolves.toBeUndefined();
    expect(db.delete).toHaveBeenCalledWith(organizations);
  });
});

describe("Invite user", () => {
  beforeEach(() => {
    db.query.userInvite.findFirst.mockResolvedValue(null);
    db.returning.mockResolvedValue([{ id: "inviteId" }]);
  });
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access", async () => {
    db.query.organizations.findFirst.mockResolvedValue({ organizationsToUsers: [] });
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).rejects.toThrow("Forbidden");
  });
  it("should throw with user already in organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [{ user_id: "userId", user: {} }, { user: { email: "email" } }],
    });
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).rejects.toThrow("Conflict");
  });
  it("should throw with user already invited", async () => {
    db.query.userInvite.findFirst.mockResolvedValue({ id: "inviteId" });
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).rejects.toThrow("Conflict");
  });
  it("should throw without new invite", async () => {
    db.returning.mockResolvedValue([]);
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).rejects.toThrow("Failed to create invite");
  });
  it("should create invite and send email", async () => {
    await expect(
      organizationsController.inviteUser({ userId: "userId" }, "org1", { email: "email" }),
    ).resolves.toBeUndefined();
    expect(db.insert).toHaveBeenCalledWith(userInvite);
    expect(emailService.sendInvite).toHaveBeenCalledWith({
      email: "email",
      organizationName: "org",
    });
  });
});

describe("Remove user", () => {
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(
      organizationsController.removeUser({ userId: "userId" }, "org1", "anotherUserId"),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access", async () => {
    db.query.organizations.findFirst.mockResolvedValue({ organizationsToUsers: [] });
    await expect(
      organizationsController.removeUser({ userId: "userId" }, "org1", "anotherUserId"),
    ).rejects.toThrow("Forbidden");
  });
  it("should throw if user trying to remove themselves", async () => {
    await expect(
      organizationsController.removeUser({ userId: "userId" }, "org1", "userId"),
    ).rejects.toThrow("Cannot remove yourself from organization");
  });
  it("should delete user from organization", async () => {
    await expect(
      organizationsController.removeUser({ userId: "userId" }, "org1", "anotherUserId"),
    ).resolves.toBeUndefined();
    expect(db.delete).toHaveBeenCalledWith(organizationsToUsers);
  });
});

describe("Get organization members", () => {
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(organizationsController.getUsers({ userId: "userId" }, "org1")).rejects.toThrow(
      "Not Found",
    );
  });
  it("should throw without access", async () => {
    db.query.organizations.findFirst.mockResolvedValue({ organizationsToUsers: [] });
    await expect(organizationsController.getUsers({ userId: "userId" }, "org1")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return members", async () => {
    db.query.organizationsToUsers.findMany.mockResolvedValue([
      { user: { id: "userId", email: "email" } },
    ]);
    await expect(organizationsController.getUsers({ userId: "userId" }, "org1")).resolves.toEqual([
      { id: "userId", email: "email" },
    ]);
  });
});
