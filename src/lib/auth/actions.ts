"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName } from "./session";
export async function logout() {
  (await cookies()).delete(sessionCookieName);
  redirect("/login");
}
