import { EmployeeDirectory } from "@/components/admin/employees/employee-directory";
import { employeeSamples } from "@/components/admin/employees/employee-data";

export default function EmployeesPage() {
	return <EmployeeDirectory employees={employeeSamples} />;
}
