import type { Employee } from "@/types/modules";

// UI fixtures only. No records are written to the database.
export const employeeSamples: Employee[] = [
	{ id: "demo-employee-1", businessUnitId: "demo", userId: null, employeeNumber: "EMP-001", name: "Amina Bello", email: "amina@example.com", jobTitle: "Operations Coordinator", status: "ACTIVE", isDemo: true, createdAt: 1788220800000, updatedAt: 1788220800000 },
	{ id: "demo-employee-2", businessUnitId: "demo", userId: null, employeeNumber: "EMP-002", name: "Ibrahim Musa", email: "ibrahim@example.com", jobTitle: "Digital Services Specialist", status: "ACTIVE", isDemo: true, createdAt: 1788220800000, updatedAt: 1788220800000 },
	{ id: "demo-employee-3", businessUnitId: "demo", userId: null, employeeNumber: "EMP-003", name: "Zainab Ali", email: "zainab@example.com", jobTitle: "Training Coordinator", status: "ACTIVE", isDemo: true, createdAt: 1788220800000, updatedAt: 1788220800000 },
	{ id: "demo-employee-4", businessUnitId: "demo", userId: null, employeeNumber: "EMP-004", name: "Yusuf Ahmed", email: "yusuf@example.com", jobTitle: "Print Production Assistant", status: "INACTIVE", isDemo: true, createdAt: 1788220800000, updatedAt: 1788220800000 },
];
