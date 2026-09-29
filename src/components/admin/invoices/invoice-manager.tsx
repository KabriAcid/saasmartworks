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

type InvoiceStatus = "DRAFT" | "ISSUED" | "VOID";
type Invoice = {
	id: string;
	reference: string;
	client: string;
	project: string;
	status: InvoiceStatus;
	totalMinor: number;
	dueAt: string;
};
const statusMap: Record<InvoiceStatus, { label: string; style: string }> = {
	DRAFT: { label: "Draft", style: "bg-slate-100 text-slate-600" },
	ISSUED: { label: "Issued", style: "bg-blue-50 text-blue-700" },
	VOID: { label: "Void", style: "bg-red-50 text-red-700" },
};
const initialInvoices: Invoice[] = [
	{
		id: "invoice-1",
		reference: "INV-2026-012",
		client: "Northgate Academy",
		project: "School Management Portal",
		status: "ISSUED",
		totalMinor: 124000000,
		dueAt: "2026-04-15",
	},
	{
		id: "invoice-2",
		reference: "INV-2026-011",
		client: "Prime Logistics",
		project: "Corporate Website",
		status: "ISSUED",
		totalMinor: 248000000,
		dueAt: "2026-04-08",
	},
	{
		id: "invoice-3",
		reference: "INV-2026-010",
		client: "Horizon Group",
		project: "Staff Training Programme",
		status: "DRAFT",
		totalMinor: 86000000,
		dueAt: "2026-04-30",
	},
];
const inputClass =
	"mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";
const currency = (minor: number) =>
	new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(minor / 100);

export function InvoiceManager() {
	const [invoices, setInvoices] = useState(initialInvoices);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"ALL" | InvoiceStatus>("ALL");
	const [editor, setEditor] = useState<Invoice | null>(null);
	const [deleting, setDeleting] = useState<Invoice | null>(null);
	const [notice, setNotice] = useState("");
	const filtered = invoices.filter(
		(invoice) =>
			(status === "ALL" || invoice.status === status) &&
			`${invoice.reference} ${invoice.client} ${invoice.project}`
				.toLowerCase()
				.includes(search.toLowerCase()),
	);
	function save(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editor) return;
		setInvoices((current) =>
			current.some((item) => item.id === editor.id)
				? current.map((item) => (item.id === editor.id ? editor : item))
				: [...current, editor],
		);
		setNotice(`${editor.reference} saved successfully.`);
		setEditor(null);
	}
	function createInvoice() {
		setEditor({
			id: crypto.randomUUID(),
			reference: `INV-${new Date().getFullYear()}-NEW`,
			client: "",
			project: "",
			status: "DRAFT",
			totalMinor: 0,
			dueAt: "",
		});
	}
	return (
		<div className="space-y-6">
			<ModuleHeader
				title="Invoices"
				description="Prepare, issue, and maintain client invoices across active work."
				group="Finance"
			/>
			<section aria-label="Invoice summary" className="grid grid-cols-3 gap-4">
				{(Object.keys(statusMap) as InvoiceStatus[]).map((key) => (
					<article
						key={key}
						className="admin-shadow-soft rounded-2xl bg-white p-5"
					>
						<span
							className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[key].style}`}
						>
							{statusMap[key].label}
						</span>
						<p className="mt-5 text-2xl font-bold text-[#172B3A]">
							{invoices.filter((item) => item.status === key).length}
						</p>
					</article>
				))}
			</section>
			<div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row">
				<div className="relative min-w-0 flex-1">
					<MagnifyingGlassIcon className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
					<input
						aria-label="Search invoices"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search reference, client, or project"
						className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs"
					/>
				</div>
				<select
					aria-label="Filter invoices by status"
					value={status}
					onChange={(event) =>
						setStatus(event.target.value as "ALL" | InvoiceStatus)
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
					onClick={createInvoice}
					className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FFA64D] px-4 py-2.5 text-xs font-semibold text-[#172B3A]"
				>
					<PlusIcon className="h-4 w-4" />
					New invoice
				</button>
			</div>
			<p role="status" className="text-xs text-slate-500">
				{notice || `Showing ${filtered.length} of ${invoices.length} invoices`}
			</p>
			<section aria-label="Invoice directory" className="space-y-4">
				{filtered.map((invoice) => (
					<article
						key={invoice.id}
						className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6"
					>
						<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
							<div>
								<div className="flex flex-wrap items-center gap-2">
									<h3 className="mb-0! text-xs! font-semibold text-[#172B3A] sm:text-sm!">
										{invoice.reference}
									</h3>
									<span
										className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[invoice.status].style}`}
									>
										{statusMap[invoice.status].label}
									</span>
								</div>
								<p className="mt-2 text-sm text-slate-700">{invoice.client}</p>
								<p className="mt-1 text-xs text-slate-500">
									{invoice.project} · Due {invoice.dueAt || "No due date"}
								</p>
							</div>
							<div className="flex items-center justify-between gap-4 lg:justify-end">
								<p className="text-lg font-bold text-[#172B3A]">
									{currency(invoice.totalMinor)}
								</p>
								<button
									type="button"
									aria-label={`Edit ${invoice.reference}`}
									onClick={() => setEditor({ ...invoice })}
									className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
								>
									<PencilSquareIcon className="h-4 w-4" />
								</button>
								<button
									type="button"
									aria-label={`Delete ${invoice.reference}`}
									onClick={() => setDeleting(invoice)}
									className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
								>
									<TrashIcon className="h-4 w-4" />
								</button>
							</div>
						</div>
					</article>
				))}
				{!filtered.length && (
					<div className="admin-shadow-soft rounded-2xl bg-white px-6 py-14 text-center">
						<p className="text-sm text-slate-600">No invoices found</p>
						<p className="mt-1 text-xs text-slate-500">
							Try another search or create a new invoice.
						</p>
					</div>
				)}
			</section>
			{editor && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4 backdrop-blur-sm">
					<div
						role="dialog"
						aria-modal="true"
						className="admin-shadow-popover w-full max-w-xl rounded-2xl bg-white p-5 sm:p-6"
					>
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-sm! font-semibold text-[#172B3A]">
									{invoices.some((item) => item.id === editor.id)
										? "Edit"
										: "New"}{" "}
									invoice
								</h3>
								<p className="mt-1 text-xs text-slate-500">
									Keep billing details and payment timing current.
								</p>
							</div>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setEditor(null)}
								className="cursor-pointer"
							>
								<XMarkIcon className="h-5 w-5 text-slate-500" />
							</button>
						</div>
						<form onSubmit={save} className="mt-5 space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block text-xs font-semibold text-slate-700">
									Reference
									<input
										required
										value={editor.reference}
										onChange={(event) =>
											setEditor({ ...editor, reference: event.target.value })
										}
										className={inputClass}
									/>
								</label>
								<label className="block text-xs font-semibold text-slate-700">
									Client
									<input
										required
										value={editor.client}
										onChange={(event) =>
											setEditor({ ...editor, client: event.target.value })
										}
										className={inputClass}
									/>
								</label>
								<label className="block text-xs font-semibold text-slate-700">
									Project
									<input
										value={editor.project}
										onChange={(event) =>
											setEditor({ ...editor, project: event.target.value })
										}
										className={inputClass}
									/>
								</label>
								<label className="block text-xs font-semibold text-slate-700">
									Total (minor units)
									<input
										required
										type="number"
										min="0"
										value={editor.totalMinor}
										onChange={(event) =>
											setEditor({
												...editor,
												totalMinor: Number(event.target.value),
											})
										}
										className={inputClass}
									/>
								</label>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block text-xs font-semibold text-slate-700">
									Status
									<select
										value={editor.status}
										onChange={(event) =>
											setEditor({
												...editor,
												status: event.target.value as InvoiceStatus,
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
								<label className="block text-xs font-semibold text-slate-700">
									Due date
									<input
										type="date"
										value={editor.dueAt}
										onChange={(event) =>
											setEditor({ ...editor, dueAt: event.target.value })
										}
										className={inputClass}
									/>
								</label>
							</div>
							<div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
								<button
									type="button"
									onClick={() => setEditor(null)}
									className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="cursor-pointer rounded-lg bg-[#FFA64D] px-4 py-2 text-xs font-semibold text-[#172B3A]"
								>
									Save invoice
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			{deleting && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4 backdrop-blur-sm">
					<div
						role="alertdialog"
						aria-modal="true"
						className="admin-shadow-popover w-full max-w-md rounded-2xl bg-white p-6"
					>
						<h3 className="text-sm! font-semibold text-[#172B3A]">
							Delete invoice?
						</h3>
						<p className="mt-3 text-sm leading-6 text-slate-500">
							Remove {deleting.reference} from this session?
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setDeleting(null)}
								className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-600"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setInvoices((current) =>
										current.filter((item) => item.id !== deleting.id),
									);
									setNotice(`${deleting.reference} deleted successfully.`);
									setDeleting(null);
								}}
								className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
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
