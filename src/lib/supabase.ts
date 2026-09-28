import { createClient } from "@supabase/supabase-js";
import { supabaseEnvironment } from "@/config/env";

const supabaseEnv = supabaseEnvironment();

export const supabase =
	supabaseEnv.url && supabaseEnv.anonKey
		? createClient(supabaseEnv.url, supabaseEnv.anonKey)
		: null;

export const supabaseAdmin =
	supabaseEnv.url && supabaseEnv.serviceRoleKey
		? createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
				auth: { persistSession: false, autoRefreshToken: false },
			})
		: null;

export function assertSupabaseConfigured() {
	if (!supabase) {
		throw new Error(
			"Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY).",
		);
	}
	return supabase;
}
