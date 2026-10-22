import { createCrudItemRoute } from "@/lib/admin-crud";
import { removeFaqItem } from "@/lib/content";

export const { DELETE } = createCrudItemRoute({ remove: removeFaqItem });
