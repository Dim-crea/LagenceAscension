import { createCrudItemRoute } from "@/lib/admin-crud";
import { removeTestimonial } from "@/lib/content";

export const { DELETE } = createCrudItemRoute({ remove: removeTestimonial });
