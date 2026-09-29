import { ContentEditor } from "@/components/admin/website/content-editor";
import { aboutFields } from "@/components/admin/website/website-content";

export default function Page() {
 return <ContentEditor title="About Page" description="Shape the story visitors read about your organization." href="/about" fields={aboutFields} />;
}
