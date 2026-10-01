import { test } from "node:test";
import assert from "node:assert/strict";
import { routePermission, permissionCatalogue, landingPath } from "./permissions";
test("catalogue is unique and retains seeded inquiry permission", () => {
  assert.equal(new Set(permissionCatalogue.map(item => item.id)).size, permissionCatalogue.length);
  assert.equal(routePermission("/admin"), "PERM-DASHBOARD-VIEW");
  assert.equal(routePermission("/admin/inquiries/123"), "PERM-INQUIRIES-MANAGE");
  assert.equal(routePermission("/admin/unknown"), null);
  assert.equal(routePermission("/public/inquiries"), null);
});
test("inquiry-only access does not grant dashboard or finance", () => {
  const permissions = ["PERM-INQUIRIES-MANAGE"];
  assert.equal(landingPath(permissions), "/admin/inquiries");
  assert.equal(permissions.includes(routePermission("/admin")!), false);
  assert.equal(permissions.includes(routePermission("/admin/payments")!), false);
  assert.equal(landingPath([]), null);
});
