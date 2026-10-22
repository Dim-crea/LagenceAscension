import { createCrudRoutes } from "@/lib/admin-crud";
import { getFaq, upsertFaqItem } from "@/lib/content";

export const { GET, POST } = createCrudRoutes({
  getAll: getFaq,
  upsert: upsertFaqItem,
});
