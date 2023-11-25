import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

let organizationsController: OrganizationsController;
const db = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  query: {
    organizations: {
      findFirst: jest.fn(),
    },
  },
};

beforeEach(async () => {
  db.where.mockResolvedValue([{ organization: { id: "org1" } }]);
  db.query.organizations.findFirst.mockResolvedValue({
    id: "org1",
    organizationsToUsers: [{ user_id: "userId" }],
  });

  const moduleRef = await Test.createTestingModule({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
  })

    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
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
    ).resolves.toEqual({ id: "org1" });
  });
});
