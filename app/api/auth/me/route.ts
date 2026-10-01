import { NextRequest } from "next/server";
import { authHandler } from "@/lib/auth/http";
export const runtime = "nodejs";
export function GET(request: NextRequest) { return authHandler(request, "me"); }
