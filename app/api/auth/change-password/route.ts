import { NextRequest } from "next/server";
import { authHandler } from "@/lib/auth/http";
export const runtime = "nodejs";
export function POST(request: NextRequest) { return authHandler(request, "change-password"); }
