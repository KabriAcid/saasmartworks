import {
	BriefcaseIcon,
	ChartBarSquareIcon,
	ChatBubbleLeftRightIcon,
	HomeIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

const navigation = [
	{ label: "Dashboard", href: "/admin", icon: HomeIcon, active: true },
	{ label: "Clients", href: "/admin/clients", icon: UsersIcon, active: false },
	{
		label: "Projects",
		href: "/admin/projects",
		icon: BriefcaseIcon,
		active: false,
	},
	{
		label: "Reports",
		href: "/admin/reports",
		icon: ChartBarSquareIcon,
		active: false,
	},
	{
		label: "Messages",
		href: "/admin/messages",
		icon: ChatBubbleLeftRightIcon,
		active: false,
	},
	{
		label: "Security",
		href: "/admin/security",
		icon: ShieldCheckIcon,
		active: false,
	},
];

function SidebarItem({
	icon: Icon,
	label,
	active,
}: {
	icon: typeof HomeIcon;
	label: string;
	active: boolean;
}) {
	return (
		<button
			type="button"
			className={[
				"flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
				active
					? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
					: "text-slate-300 hover:bg-white/5 hover:text-white",
			].join(" ")}
		>
			<Icon className="h-5 w-5 shrink-0" />
			<span>{label}</span>
		</button>
	);
}

export function AdminSidebar() {
	return (
		<aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
			<div className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
				<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-black text-[var(--color-ink)] shadow-[0_12px_24px_rgba(255,166,77,0.3)]">
					SA
				</div>
				<div>
					<p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400 uppercase">
						Workspace
					</p>
					<p className="mt-1 text-lg font-semibold text-white">SA’A Admin</p>
				</div>
			</div>

			<nav className="space-y-2 px-4 py-5">
				{navigation.map(({ label, icon: Icon, active }) => (
					<div key={label}>
						<SidebarItem icon={Icon} label={label} active={active} />
					</div>
				))}
			</nav>
		</aside>
	);
}
