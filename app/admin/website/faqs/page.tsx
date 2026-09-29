import { CollectionManager } from "@/components/admin/website/collection-manager";
import { faqFields } from "@/components/admin/website/website-content";

export default function Page() {
 const entries = faqFields.filter(field => field.key.startsWith("question-")).map(field => ({
  id: field.key,
  title: field.value,
  description: faqFields.find(answer => answer.key === field.key.replace("question-", "answer-"))?.value ?? "",
 }));
 return <CollectionManager title="FAQs" singular="FAQ" faq initialEntries={entries} />;
}
