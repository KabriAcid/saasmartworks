import { InquiryDirectory } from "@/components/admin/inquiries/inquiry-directory";
import { inquiryRows, inquiryContacts } from "@/components/admin/inquiries/inquiry-data";
export default function InquiriesPage() { return <InquiryDirectory inquiries={inquiryRows} contacts={inquiryContacts} />; }

