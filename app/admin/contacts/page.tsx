import { CustomerManager } from "@/components/admin/customers/customer-manager";

export default function ContactsPage() {
	return <CustomerManager kind="contacts" initialRecords={[
		{ id: "contact-1", name: "Amina Yusuf", email: "amina@example.com", phone: "+234 801 000 0001", organization: "Northstar Initiative" },
		{ id: "contact-2", name: "Ibrahim Musa", email: "ibrahim@example.com", phone: "+234 801 000 0002", organization: "Civic Bridge Network" },
		{ id: "contact-3", name: "Zainab Ali", email: "zainab@example.com", phone: "", organization: "" },
	]} />;
}
