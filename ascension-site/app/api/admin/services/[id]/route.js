import { createCrudItemRoute } from "@/lib/admin-crud";
import { removeService } from "@/lib/content";

export const { DELETE } = createCrudItemRoute({ remove: removeService });
