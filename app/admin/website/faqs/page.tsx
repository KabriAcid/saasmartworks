import { ContentEditor } from "@/components/admin/website/content-editor";
import { faqFields } from "@/components/admin/website/website-content";

export default function Page() {
 return <ContentEditor title="FAQs" description="Review the answers that help visitors take their next step." href="/#faq-heading" fields={faqFields} />;
}
