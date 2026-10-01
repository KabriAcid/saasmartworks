// Existing seeded permission IDs are retained verbatim.
const modules = ["EMPLOYEES", "DEPARTMENTS", "BRANCHES", "CONTACTS", "CLIENTS", "PROJECTS", "TRAINING", "PRINTING", "SERVICES", "WEBSITE", "QUOTATIONS", "INVOICES", "PAYMENTS", "EXPENSES", "VENDORS", "PROCUREMENT", "TASKS", "DOCUMENTS", "USERS", "ROLES", "SETTINGS"] as const;
export const permissionCatalogue = [
  { id: "PERM-DASHBOARD-VIEW", description: "View the administration dashboard." },
  { id: "PERM-INQUIRIES-MANAGE", description: "View and manage client inquiries." },
  { id: "PERM-REPORTS-VIEW", description: "View reports and exports." },
  { id: "PERM-AUDIT-LOGS-VIEW", description: "View audit logs." },
  { id: "PERM-NOTIFICATIONS-VIEW", description: "View and acknowledge own notifications." },
  ...modules.flatMap(module => [
    { id: `PERM-${module}-VIEW`, description: `View ${module.toLowerCase()} records.` },
    { id: `PERM-${module}-MANAGE`, description: `Manage ${module.toLowerCase()} records.` },
  ]),
];

export function routePermission(path: string): string | null {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] !== "admin") return null;
  if (parts.length === 1) return "PERM-DASHBOARD-VIEW";
  const module = parts[1].toUpperCase();
  if (module === "INQUIRIES") return "PERM-INQUIRIES-MANAGE";
  const permission = `PERM-${module}-VIEW`;
  return permissionCatalogue.some(item => item.id === permission) ? permission : null;
}

export function landingPath(permissions: string[]) {
  if (permissions.includes("PERM-DASHBOARD-VIEW")) return "/admin";
  if (permissions.includes("PERM-INQUIRIES-MANAGE")) return "/admin/inquiries";
  return null;
}
