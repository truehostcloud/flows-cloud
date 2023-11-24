import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

let projectsController: ProjectsController;
const db = {
  query: {
    projects: {
      findMany: jest.fn(),
    },
    organizations: {
      findFirst: jest.fn(),
    },
  },
};

beforeEach(async () => {
  db.query.organizations.findFirst.mockResolvedValue({
    organizationsToUsers: [{ user_id: "userId" }],
  });
  db.query.projects.findMany.mockResolvedValue([{ id: "projId" }]);

  const moduleRef = await Test.createTestingModule({
    controllers: [ProjectsController],
    providers: [ProjectsService],
  })
    .useMocker((token) => {
      if (token === DatabaseService) {
        return { db };
      }
    })
    .compile();

  projectsController = moduleRef.get(ProjectsController);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Get projects", () => {
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(projectsController.getProjects({ userId: "userId" }, "orgId")).rejects.toThrow(
      "Forbidden",
    );
  });
  it("should return projects", async () => {
    await expect(projectsController.getProjects({ userId: "userId" }, "orgId")).resolves.toEqual([
      { id: "projId" },
    ]);
  });
});
