"use client";

import { AdminInput, AdminSelect } from "@/components/admin/shared/form-fields";
import { useState } from "react";
import {
	MagnifyingGlassIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

export type CustomerRecord = {
	id: string;
	name: string;
	email: string;
	phone: string;
	organization: string;
	status?: "ACTIVE" | "INACTIVE";
	reference?: string;
	notes?: string;
};
const inputClass =
	"mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";
export function CustomerManager({
	kind,
	initialRecords,
}: {
	kind: "contacts" | "clients";
	initialRecords: CustomerRecord[];
}) {
	const [records, setRecords] = useState(initialRecords);
	const [search, setSearch] = useState("");
	const [editor, setEditor] = useState<CustomerRecord | null>(null);
	const [deleting, setDeleting] = useState<CustomerRecord | null>(null);
	const isClients = kind === "clients";
	const title = isClients ? "Clients" : "Contacts";
	const filtered = records.filter((record) =>
		[
			record.name,
			record.email,
			record.phone,
			record.organization,
			record.reference ?? "",
		]
			.join(" ")
			.toLowerCase()
			.includes(search.toLowerCase()),
	);
	function save(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editor) return;
		if (!editor.name.trim() || !editor.email.trim()) return;
		setRecords((current) =>
			current.some((record) => record.id === editor.id)
				? current.map((record) => (record.id === editor.id ? editor : record))
				: [...current, editor],
		);
		setEditor(null);
	}
	return (
		<div className="space-y-6">
			<ModuleHeader
				title={title}
				description={
					isClients
						? "Manage the organizations you work with."
						: "Manage people and organizations that contact SA’A SMART WORKS."
				}
				group="Customers"
			/>
			<div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row">
				<div className="relative min-w-0 flex-1">
					<MagnifyingGlassIcon className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
					<input
						aria-label={`Search ${title}`}
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={`Search ${title.toLowerCase()}…`}
						className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs"
					/>
				</div>
				<button
					type="button"
					onClick={() =>
						setEditor({
							id: crypto.randomUUID(),
							name: "",
							email: "",
							phone: "",
							organization: "",
							status: "ACTIVE",
							reference: "",
							notes: "",
						})
					}
					className="button"
				>
					<PlusIcon className="h-4 w-4" />
					Add {isClients ? "client" : "contact"}
				</button>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{filtered.map((record) => (
					<article
						key={record.id}
						className="admin-shadow-soft rounded-2xl bg-white p-5"
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex min-w-0 items-center gap-3">
								<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#172B3A]/5 text-xs font-bold text-[#172B3A]">
									{record.name
										.split(/\s+/)
										.map((part) => part[0])
										.slice(0, 2)
										.join("") || "—"}
								</span>
								<div className="min-w-0">
									<h3 className="mb-0! break-words text-xs! font-semibold text-[#172B3A] sm:text-sm!">
										{record.name || "Unnamed"}
									</h3>
									<p className="mt-1 break-words text-xs text-slate-500">
										{record.organization || "Independent contact"}
									</p>
								</div>
							</div>
							<span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
								{record.status ?? "ACTIVE"}
							</span>
						</div>
						<dl className="mt-5 space-y-2 text-xs">
							<div className="flex justify-between gap-3">
								<dt className="text-slate-400">Email</dt>
								<dd className="break-all text-right text-slate-600">
									{record.email || "—"}
								</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-slate-400">Phone</dt>
								<dd className="text-right text-slate-600">
									{record.phone || "—"}
								</dd>
							</div>
							{isClients && (
								<div className="flex justify-between gap-3">
									<dt className="text-slate-400">Reference</dt>
									<dd className="text-right text-slate-600">
										{record.reference || "—"}
									</dd>
								</div>
							)}
						</dl>
						<div className="mt-5 flex justify-end gap-1 border-t border-slate-100 pt-4">
							<button
								type="button"
								onClick={() => setEditor({ ...record })}
								className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
							>
								<PencilSquareIcon className="h-4 w-4" />
								Edit
							</button>
							<button
								type="button"
								onClick={() => setDeleting(record)}
								className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
							>
								<TrashIcon className="h-4 w-4" />
								Delete
							</button>
						</div>
					</article>
				))}
			</div>
			{!filtered.length && (
				<div className="admin-shadow-soft rounded-2xl bg-white px-6 py-14 text-center">
					<p className="text-sm text-slate-600">
						No {title.toLowerCase()} found
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Add a record or try a different search.
					</p>
				</div>
			)}
			{editor && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4 backdrop-blur-sm">
					<div
						role="dialog"
						aria-modal="true"
						className="admin-shadow-popover max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 sm:p-6"
					>
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-sm! font-semibold text-[#172B3A]">
									{records.some((record) => record.id === editor.id)
										? "Edit"
										: "Add"}{" "}
									{isClients ? "client" : "contact"}
								</h3>
								<p className="mt-1 text-xs text-slate-500">
									Update the record details.
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
							<label className="block text-xs font-semibold text-slate-700">
								Name *
								<AdminInput fieldLabel="Name"
									required
									value={editor.name}
									onChange={(event) =>
										setEditor({ ...editor, name: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block text-xs font-semibold text-slate-700">
									Email *
									<AdminInput fieldLabel="Email"
										required
										type="email"
										value={editor.email}
										onChange={(event) =>
											setEditor({ ...editor, email: event.target.value })
										}
										className={inputClass}
									/>
								</label>
								<label className="block text-xs font-semibold text-slate-700">
									Phone
									<AdminInput fieldLabel="Phone"
										value={editor.phone}
										onChange={(event) =>
											setEditor({ ...editor, phone: event.target.value })
										}
										className={inputClass}
									/>
								</label>
							</div>
							<label className="block text-xs font-semibold text-slate-700">
								Organization
								<AdminInput fieldLabel="Organization"
									value={editor.organization}
									onChange={(event) =>
										setEditor({ ...editor, organization: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							{isClients && (
								<>
									<label className="block text-xs font-semibold text-slate-700">
										Reference
										<AdminInput fieldLabel="Reference"
											value={editor.reference}
											onChange={(event) =>
												setEditor({ ...editor, reference: event.target.value })
											}
											className={inputClass}
										/>
									</label>
									<label className="block text-xs font-semibold text-slate-700">
										Status
										<AdminSelect fieldLabel="Status"
											value={editor.status}
											onChange={(event) =>
												setEditor({
													...editor,
													status: event.target
														.value as CustomerRecord["status"],
												})
											}
											className={inputClass}
										>
											<option value="ACTIVE">Active</option>
											<option value="INACTIVE">Inactive</option>
										</AdminSelect>
									</label>
								</>
							)}
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
									className="button"
								>
									Save {isClients ? "client" : "contact"}
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
							Delete {isClients ? "client" : "contact"}?
						</h3>
						<p className="mt-3 text-sm leading-6 text-slate-500">
							Remove {deleting.name} from this session?
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setDeleting(null)}
								className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setRecords((current) =>
										current.filter((record) => record.id !== deleting.id),
									);
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
