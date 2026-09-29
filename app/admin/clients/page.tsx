import { CustomerManager } from "@/components/admin/customers/customer-manager";

export default function ClientsPage() {
	return <CustomerManager kind="clients" initialRecords={[
		{ id: "client-1", name: "Northgate Academy", email: "office@northgate.example", phone: "+234 801 000 0003", organization: "Northgate Academy", status: "ACTIVE", reference: "CLI-2026-001" },
		{ id: "client-2", name: "Prime Logistics", email: "team@prime.example", phone: "+234 801 000 0004", organization: "Prime Logistics", status: "ACTIVE", reference: "CLI-2026-002" },
		{ id: "client-3", name: "Horizon Group", email: "hello@horizon.example", phone: "", organization: "Horizon Group", status: "INACTIVE", reference: "CLI-2026-003" },
	]} />;
}
