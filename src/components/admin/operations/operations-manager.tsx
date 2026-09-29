"use client";
import { useState } from "react";
import {
	MagnifyingGlassIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

type Kind = "vendors" | "procurement" | "tasks" | "documents";
type RecordStatus = "ACTIVE" | "PENDING" | "COMPLETED" | "ARCHIVED";
type Row = {
	id: string;
	title: string;
	secondary: string;
	owner: string;
	details: string;
	status: RecordStatus;
};
const statusMap: Record<RecordStatus, { label: string; style: string }> = {
	ACTIVE: { label: "Active", style: "bg-emerald-50 text-emerald-700" },
	PENDING: { label: "Pending", style: "bg-amber-50 text-amber-700" },
	COMPLETED: { label: "Completed", style: "bg-blue-50 text-blue-700" },
	ARCHIVED: { label: "Archived", style: "bg-slate-100 text-slate-600" },
};
const config: Record<
	Kind,
	{
		title: string;
		description: string;
		noun: string;
		secondary: string;
		owner: string;
	}
> = {
	vendors: {
		title: "Vendors",
		description:
			"Maintain the suppliers and partners supporting business operations.",
		noun: "vendor",
		secondary: "Contact or service",
		owner: "Account owner",
	},
	procurement: {
		title: "Procurement",
		description:
			"Track purchase requests and the operational work needed to fulfil them.",
		noun: "request",
		secondary: "Vendor",
		owner: "Requested by",
	},
	tasks: {
		title: "Tasks",
		description:
			"Coordinate internal follow-ups and keep operational work moving.",
		noun: "task",
		secondary: "Area or project",
		owner: "Assignee",
	},
	documents: {
		title: "Documents",
		description: "Keep important business files organised and easy to find.",
		noun: "document",
		secondary: "Document type",
		owner: "Uploaded by",
	},
};
const samples: Record<Kind, Row[]> = {
	vendors: [
		{
			id: "vendor-1",
			title: "Brightline Print Supplies",
			secondary: "Print materials",
			owner: "Amina Bello",
			details: "orders@brightline.example · +234 800 000 0001",
			status: "ACTIVE",
		},
		{
			id: "vendor-2",
			title: "Northstar Facilities",
			secondary: "Facilities support",
			owner: "Ibrahim Musa",
			details: "support@northstar.example",
			status: "ACTIVE",
		},
	],
	procurement: [
		{
			id: "proc-1",
			title: "Production paper stock",
			secondary: "Brightline Print Supplies",
			owner: "Yusuf Ahmed",
			details: "Required for April print jobs · ₦320,000",
			status: "PENDING",
		},
		{
			id: "proc-2",
			title: "Workshop venue booking",
			secondary: "Northstar Facilities",
			owner: "Fatima Bello",
			details: "Leadership workshop · 20 April 2026",
			status: "COMPLETED",
		},
	],
	tasks: [
		{
			id: "task-1",
			title: "Review client onboarding pack",
			secondary: "Northgate Academy",
			owner: "Amina Bello",
			details: "Confirm documents and next steps",
			status: "ACTIVE",
		},
		{
			id: "task-2",
			title: "Prepare training materials",
			secondary: "Staff Training Programme",
			owner: "Fatima Bello",
			details: "Slides, handouts, and attendance sheet",
			status: "PENDING",
		},
	],
	documents: [
		{
			id: "doc-1",
			title: "Northgate onboarding pack.pdf",
			secondary: "Client document",
			owner: "Amina Bello",
			details: "PDF · Updated 28 March 2026",
			status: "ACTIVE",
		},
		{
			id: "doc-2",
			title: "Training delivery checklist.docx",
			secondary: "Operations document",
			owner: "Fatima Bello",
			details: "DOCX · Updated 26 March 2026",
			status: "ACTIVE",
		},
	],
};
const inputClass =
	"mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";
export function OperationsManager({ kind }: { kind: Kind }) {
	const meta = config[kind];
	const [rows, setRows] = useState(samples[kind]);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"ALL" | RecordStatus>("ALL");
	const [editor, setEditor] = useState<Row | null>(null);
	const [deleting, setDeleting] = useState<Row | null>(null);
	const [notice, setNotice] = useState("");
	const visible = rows.filter(
		(row) =>
			(status === "ALL" || row.status === status) &&
			`${row.title} ${row.secondary} ${row.owner} ${row.details}`
				.toLowerCase()
				.includes(search.toLowerCase()),
	);
	function save(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editor) return;
		setRows((current) =>
			current.some((item) => item.id === editor.id)
				? current.map((item) => (item.id === editor.id ? editor : item))
				: [...current, editor],
		);
		setNotice(`${editor.title} saved successfully.`);
		setEditor(null);
	}
	return (
		<div className="space-y-6">
			<ModuleHeader
				title={meta.title}
				description={meta.description}
				group="Operations"
			/>
			<section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
				{(Object.keys(statusMap) as RecordStatus[]).map((key) => (
					<article
						key={key}
						className="admin-shadow-soft rounded-2xl bg-white p-5"
					>
						<span
							className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[key].style}`}
						>
							{statusMap[key].label}
						</span>
						<p className="mt-5 text-2xl font-bold text-[#172B3A]">
							{rows.filter((row) => row.status === key).length}
						</p>
					</article>
				))}
			</section>
			<div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row">
				<div className="relative min-w-0 flex-1">
					<MagnifyingGlassIcon className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
					<input
						aria-label={`Search ${meta.title}`}
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={`Search ${meta.title.toLowerCase()}`}
						className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs"
					/>
				</div>
				<select
					aria-label={`Filter ${meta.title} by status`}
					value={status}
					onChange={(event) =>
						setStatus(event.target.value as "ALL" | RecordStatus)
					}
					className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"
				>
					<option value="ALL">All statuses</option>
					{Object.entries(statusMap).map(([key, value]) => (
						<option key={key} value={key}>
							{value.label}
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={() =>
						setEditor({
							id: crypto.randomUUID(),
							title: "",
							secondary: "",
							owner: "",
							details: "",
							status: "PENDING",
						})
					}
					className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FFA64D] px-4 py-2.5 text-xs font-semibold text-[#172B3A]"
				>
					<PlusIcon className="h-4 w-4" />
					New {meta.noun}
				</button>
			</div>
			<p role="status" className="text-xs text-slate-500">
				{notice ||
					`Showing ${visible.length} of ${rows.length} ${meta.title.toLowerCase()}`}
			</p>
			<section className="admin-shadow-soft divide-y divide-slate-100 rounded-2xl bg-white">
				{visible.map((row) => (
					<article
						key={row.id}
						className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
					>
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<h3 className="mb-0! text-sm! font-semibold text-[#172B3A]">
									{row.title}
								</h3>
								<span
									className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[row.status].style}`}
								>
									{statusMap[row.status].label}
								</span>
							</div>
							<p className="mt-2 text-xs font-medium text-[#FFA64D]">
								{row.secondary}
							</p>
							<p className="mt-1 text-sm leading-6 text-slate-600">
								{row.details}
							</p>
							<p className="mt-1 text-xs text-slate-500">
								{meta.owner}: {row.owner || "Unassigned"}
							</p>
						</div>
						<div className="flex items-center gap-1">
							<button
								type="button"
								aria-label={`Edit ${row.title}`}
								onClick={() => setEditor({ ...row })}
								className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
							>
								<PencilSquareIcon className="h-4 w-4" />
							</button>
							<button
								type="button"
								aria-label={`Delete ${row.title}`}
								onClick={() => setDeleting(row)}
								className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
							>
								<TrashIcon className="h-4 w-4" />
							</button>
						</div>
					</article>
				))}
				{!visible.length && (
					<p className="px-6 py-14 text-center text-sm text-slate-500">
						No {meta.title.toLowerCase()} found.
					</p>
				)}
			</section>
			{editor && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4">
					<div
						role="dialog"
						aria-modal="true"
						className="admin-shadow-popover w-full max-w-lg rounded-2xl bg-white p-6"
					>
						<div className="flex justify-between">
							<h3 className="text-sm! font-semibold text-[#172B3A]">
								{rows.some((item) => item.id === editor.id) ? "Edit" : "New"}{" "}
								{meta.noun}
							</h3>
							<button
								type="button"
								onClick={() => setEditor(null)}
								className="cursor-pointer"
							>
								<XMarkIcon className="h-5 w-5 text-slate-500" />
							</button>
						</div>
						<form onSubmit={save} className="mt-5 space-y-4">
							<label className="block text-xs font-semibold text-slate-700">
								Name or title
								<input
									required
									value={editor.title}
									onChange={(event) =>
										setEditor({ ...editor, title: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block text-xs font-semibold text-slate-700">
									{meta.secondary}
									<input
										required
										value={editor.secondary}
										onChange={(event) =>
											setEditor({ ...editor, secondary: event.target.value })
										}
										className={inputClass}
									/>
								</label>
								<label className="block text-xs font-semibold text-slate-700">
									{meta.owner}
									<input
										value={editor.owner}
										onChange={(event) =>
											setEditor({ ...editor, owner: event.target.value })
										}
										className={inputClass}
									/>
								</label>
							</div>
							<label className="block text-xs font-semibold text-slate-700">
								Details
								<textarea
									required
									rows={3}
									value={editor.details}
									onChange={(event) =>
										setEditor({ ...editor, details: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							<label className="block text-xs font-semibold text-slate-700">
								Status
								<select
									value={editor.status}
									onChange={(event) =>
										setEditor({
											...editor,
											status: event.target.value as RecordStatus,
										})
									}
									className={inputClass}
								>
									{Object.entries(statusMap).map(([key, value]) => (
										<option key={key} value={key}>
											{value.label}
										</option>
									))}
								</select>
							</label>
							<div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
								<button
									type="button"
									onClick={() => setEditor(null)}
									className="cursor-pointer rounded-lg px-3 py-2 text-xs text-slate-600"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="cursor-pointer rounded-lg bg-[#FFA64D] px-4 py-2 text-xs font-semibold text-[#172B3A]"
								>
									Save {meta.noun}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			{deleting && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4">
					<div
						role="alertdialog"
						className="admin-shadow-popover w-full max-w-md rounded-2xl bg-white p-6"
					>
						<h3 className="text-sm! font-semibold text-[#172B3A]">
							Delete {meta.noun}?
						</h3>
						<p className="mt-3 text-sm text-slate-500">
							Remove {deleting.title} from this session?
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setDeleting(null)}
								className="cursor-pointer rounded-lg px-3 py-2 text-xs text-slate-600"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setRows((current) =>
										current.filter((item) => item.id !== deleting.id),
									);
									setDeleting(null);
								}}
								className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs text-white"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
