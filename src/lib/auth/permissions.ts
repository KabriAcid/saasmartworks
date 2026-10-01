// Explicit route permissions; unknown routes fail closed.
export function routePermission(path: string): string | null {
  const part = path.split("/")[2];
  if (!part) return "dashboard.view";
  if (part === "website") return "services.manage";
  if (["quotations", "invoices", "payments", "expenses"].includes(part)) return "finance.view";
  if (part === "settings") return "settings.manage";
  if (part === "audit-logs") return "audit_logs.view";
  if (["employees", "departments", "branches", "inquiries", "contacts", "clients", "projects", "training", "printing", "services", "vendors", "procurement", "tasks", "documents", "reports", "users", "roles", "notifications"].includes(part)) return `${part}.view`;
  return null;
}
