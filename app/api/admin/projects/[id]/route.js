import { createCrudItemRoute } from "@/lib/admin-crud";
import { removeProject } from "@/lib/content";

export const { DELETE } = createCrudItemRoute({ remove: removeProject });
