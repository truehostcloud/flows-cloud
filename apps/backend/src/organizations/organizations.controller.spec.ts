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
};

beforeEach(async () => {
  db.where.mockResolvedValue([{ organization: { id: "org1" } }]);

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
