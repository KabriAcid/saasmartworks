import { ContentEditor } from "@/components/admin/website/content-editor";
import { contactFields } from "@/components/admin/website/website-content";

export default function Page() {
 return <ContentEditor title="Contact Information" description="Keep your public contact details clear and accessible." href="/contact" fields={contactFields} />;
}
