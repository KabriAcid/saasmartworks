import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, verifySession } from "@/lib/auth/session";
import { isMockAuthEnabled } from "@/lib/auth/mock";

export async function proxy(request: NextRequest) {
	if (isMockAuthEnabled()) return NextResponse.next();
	const token = request.cookies.get(sessionCookieName)?.value;
	if (token && (await verifySession(token))) return NextResponse.next();

	return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
	matcher: ["/admin/:path*"],
};
