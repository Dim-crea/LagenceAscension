import { createCrudRoutes } from "@/lib/admin-crud";
import { getProjects, upsertProject } from "@/lib/content";

export const { GET, POST } = createCrudRoutes({
  getAll: getProjects,
  upsert: upsertProject,
});
