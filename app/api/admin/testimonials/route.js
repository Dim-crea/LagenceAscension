import { createCrudRoutes } from "@/lib/admin-crud";
import { getTestimonials, upsertTestimonial } from "@/lib/content";

export const { GET, POST } = createCrudRoutes({
  getAll: getTestimonials,
  upsert: upsertTestimonial,
});
