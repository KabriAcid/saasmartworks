import { test } from "node:test";
import assert from "node:assert/strict";
import { SignJWT } from "jose";
import { signSession, verifySession } from "./session";

test("session verification rejects tampering, expiry, and missing credential claims", async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-only-session-secret-at-least-32-bytes";
  try {
    const token = await signSession("user-test", "credential-test");
    assert.equal((await verifySession(token))?.sub, "user-test");
    const parts = token.split(".");
    parts[1] = Buffer.from(JSON.stringify({ sub: "another-user" })).toString("base64url");
    assert.equal(await verifySession(parts.join(".")), null);
    const key = new TextEncoder().encode(process.env.SESSION_SECRET);
    const expired = await new SignJWT({ credentialVersion: "test" }).setProtectedHeader({ alg: "HS256" }).setIssuer("saa-smart-works").setAudience("saa-admin").setSubject("user-test").setIssuedAt().setExpirationTime(1).sign(key);
    assert.equal(await verifySession(expired), null);
    const legacy = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setIssuer("saa-smart-works").setAudience("saa-admin").setSubject("user-test").setIssuedAt().setExpirationTime("1h").sign(key);
    assert.equal(await verifySession(legacy), null);
    assert.equal(await verifySession("invalid"), null);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previous;
  }
});
