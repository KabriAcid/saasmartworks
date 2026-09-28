import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, verifySession } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
	const token = request.cookies.get(sessionCookieName)?.value;
	if (token && (await verifySession(token))) return NextResponse.next();

	return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
	matcher: ["/admin/:path*"],
};
