import { z } from "zod";
export const credentialsSchema = z.object({ email: z.string().trim().toLowerCase().max(254).pipe(z.email()), password: z.string().min(1).max(1024) }).strict();
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(1024), newPassword: z.string().min(12).refine(value => new TextEncoder().encode(value).length <= 72, "Use at most 72 UTF-8 bytes.") }).strict().refine(value => value.currentPassword !== value.newPassword, "Choose a different password.");
export const sessionResponseSchema = z.object({ data: z.object({ user: z.object({ id: z.string(), name: z.string(), email: z.string(), mustChangePassword: z.boolean() }), businessUnitId: z.string(), roles: z.array(z.string()), permissions: z.array(z.string()) }) });
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
