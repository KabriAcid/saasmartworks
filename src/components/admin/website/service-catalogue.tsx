import { serviceCategories } from "@/lib/services-data";
import { CollectionManager } from "./collection-manager";

export function ServiceCatalogue({
 categoriesOnly = false,
}: {
 categoriesOnly?: boolean;
}) {
 return (
  <CollectionManager
   title={categoriesOnly ? "Service Categories" : "Services"}
   singular={categoriesOnly ? "category" : "service"}
   withBullets={!categoriesOnly}
   initialEntries={serviceCategories.map(category => ({
    id: category.id,
    title: category.title,
    description: category.description,
    bullets: category.capabilities,
   }))}
  />
 );
}
