import { Test } from "@nestjs/testing";
import { projects } from "db";

import { DatabaseService } from "../database/database.service";
import { ProjectsController } from "./projects.controller";
import type { UpdateProjectDto } from "./projects.dto";
import { ProjectsService } from "./projects.service";

let projectsController: ProjectsController;
const db = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  returning: jest.fn(),
  query: {
    projects: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
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
  db.query.projects.findFirst.mockResolvedValue({ id: "projId" });

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

describe("Get project detail", () => {
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(
      projectsController.getProjectDetail({ userId: "userId" }, "projId"),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(
      projectsController.getProjectDetail({ userId: "userId" }, "projId"),
    ).rejects.toThrow("Forbidden");
  });
  it("should return project", async () => {
    await expect(
      projectsController.getProjectDetail({ userId: "userId" }, "projId"),
    ).resolves.toEqual({ id: "projId" });
  });
});

describe("Create project", () => {
  beforeEach(() => {
    db.returning.mockResolvedValue([{ id: "projId" }]);
  });
  it("should throw without organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue(null);
    await expect(
      projectsController.createProject({ userId: "userId" }, "orgId", { name: "Proj" }),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(
      projectsController.createProject({ userId: "userId" }, "orgId", { name: "Proj" }),
    ).rejects.toThrow("Forbidden");
  });
  it("should throw without new project", async () => {
    db.returning.mockResolvedValue([]);
    await expect(
      projectsController.createProject({ userId: "userId" }, "orgId", { name: "Proj" }),
    ).rejects.toThrow("Failed to create project");
  });
  it("should create project and return project", async () => {
    await expect(
      projectsController.createProject({ userId: "userId" }, "orgId", { name: "Proj" }),
    ).resolves.toEqual({ id: "projId" });
    expect(db.insert).toHaveBeenCalledWith(projects);
  });
});

describe("Update project", () => {
  const data: UpdateProjectDto = {
    name: "New name",
    description: "desc",
    domains: ["new domain"],
    human_id: "new-human-id",
    human_id_alias: "new-human-id-alias",
  };
  beforeEach(() => {
    db.returning.mockResolvedValue([{ name: "New name" }]);
  });
  it("should throw without project", async () => {
    db.query.projects.findFirst.mockResolvedValue(null);
    await expect(
      projectsController.updateProject({ userId: "userId" }, "projId", data),
    ).rejects.toThrow("Not Found");
  });
  it("should throw without access to organization", async () => {
    db.query.organizations.findFirst.mockResolvedValue({
      organizationsToUsers: [],
    });
    await expect(
      projectsController.updateProject({ userId: "userId" }, "projId", data),
    ).rejects.toThrow("Forbidden");
  });
  it("should throw without updated project", async () => {
    db.returning.mockResolvedValue([]);
    await expect(
      projectsController.updateProject({ userId: "userId" }, "projId", data),
    ).rejects.toThrow("Failed to update project");
  });
  it("should update project and return project", async () => {
    await expect(
      projectsController.updateProject({ userId: "userId" }, "projId", data),
    ).resolves.toEqual({ name: "New name" });
    expect(db.update).toHaveBeenCalledWith(projects);
  });
});
