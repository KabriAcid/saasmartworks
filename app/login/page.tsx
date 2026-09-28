import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to the SA'A SMART WORKS platform.",
};

export default function LoginPage() {
	return <LoginForm />;
}
