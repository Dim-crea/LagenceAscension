import { createCrudRoutes } from "@/lib/admin-crud";
import { getServices, upsertService } from "@/lib/content";

export const { GET, POST } = createCrudRoutes({
  getAll: getServices,
  upsert: upsertService,
});
