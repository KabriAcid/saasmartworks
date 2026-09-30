"use client";
import { AdminFieldIcon } from "@/components/admin/shared/form-fields";
import {
	AdminInput,
	AdminTextarea,
} from "@/components/admin/shared/form-fields";
import { useState } from "react";
import {
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";
type Role = {
	id: string;
	name: string;
	description: string;
	permissions: string[];
};
const permissionOptions = [
	"View dashboard",
	"Manage customers",
	"Manage service operations",
	"Manage finance",
	"Manage website",
	"Manage access",
];
const initialRoles: Role[] = [
	{
		id: "role-1",
		name: "Administrator",
		description: "Full access to all administration areas.",
		permissions: permissionOptions,
	},
	{
		id: "role-2",
		name: "Staff",
		description: "Access to customers and service operations.",
		permissions: [
			"View dashboard",
			"Manage customers",
			"Manage service operations",
		],
	},
];
const inputClass =
	"mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";
export function RolesManager() {
	const [roles, setRoles] = useState(initialRoles);
	const [editor, setEditor] = useState<Role | null>(null);
	const [deleting, setDeleting] = useState<Role | null>(null);
	const [notice, setNotice] = useState("");
	function save(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editor) return;
		setRoles((current) =>
			current.some((item) => item.id === editor.id)
				? current.map((item) => (item.id === editor.id ? editor : item))
				: [...current, editor],
		);
		setNotice(`${editor.name} saved successfully.`);
		setEditor(null);
	}
	return (
		<div className="space-y-6">
			<ModuleHeader
				title="Roles & Permissions"
				description="Define access levels for the people working in the administration portal."
				group="Access & Security"
			/>
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() =>
						setEditor({
							id: crypto.randomUUID(),
							name: "",
							description: "",
							permissions: [],
						})
					}
					className="button"
				>
					<PlusIcon className="h-4 w-4" />
					New role
				</button>
			</div>
			<p role="status" className="text-xs text-slate-500">
				{notice}
			</p>
			<section className="grid gap-4 xl:grid-cols-2">
				{roles.map((role) => (
					<article
						key={role.id}
						className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="mb-0! text-sm! font-semibold text-[#172B3A]">
									{role.name}
								</h3>
								<p className="mt-2 text-sm leading-6 text-slate-600">
									{role.description}
								</p>
							</div>
							<div className="flex shrink-0 gap-1">
								<button
									type="button"
									aria-label={`Edit ${role.name}`}
									onClick={() =>
										setEditor({ ...role, permissions: [...role.permissions] })
									}
									className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
								>
									<PencilSquareIcon className="h-4 w-4" />
								</button>
								<button
									type="button"
									aria-label={`Delete ${role.name}`}
									onClick={() => setDeleting(role)}
									className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
								>
									<TrashIcon className="h-4 w-4" />
								</button>
							</div>
						</div>
						<div className="mt-5 flex flex-wrap gap-2">
							{role.permissions.map((permission) => (
								<span
									key={permission}
									className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600"
								>
									{permission}
								</span>
							))}
						</div>
					</article>
				))}
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
								{roles.some((item) => item.id === editor.id) ? "Edit" : "New"}{" "}
								role
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
								<AdminFieldIcon fieldLabel="Role name" />
								Role name
								<AdminInput
									fieldLabel="Role name"
									required
									value={editor.name}
									onChange={(event) =>
										setEditor({ ...editor, name: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							<label className="block text-xs font-semibold text-slate-700">
								<AdminFieldIcon fieldLabel="Description" />
								Description
								<AdminTextarea
									fieldLabel="Description"
									required
									rows={2}
									value={editor.description}
									onChange={(event) =>
										setEditor({ ...editor, description: event.target.value })
									}
									className={inputClass}
								/>
							</label>
							<fieldset>
								<legend className="text-xs font-semibold text-slate-700">
									Permissions
								</legend>
								<div className="mt-3 grid gap-2 sm:grid-cols-2">
									{permissionOptions.map((permission) => (
										<label
											key={permission}
											className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
										>
											<input
												type="checkbox"
												checked={editor.permissions.includes(permission)}
												onChange={(event) =>
													setEditor({
														...editor,
														permissions: event.target.checked
															? [...editor.permissions, permission]
															: editor.permissions.filter(
																	(item) => item !== permission,
																),
													})
												}
												className="accent-[#FFA64D]"
											/>
											{permission}
										</label>
									))}
								</div>
							</fieldset>
							<div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
								<button
									type="button"
									onClick={() => setEditor(null)}
									className="cursor-pointer rounded-lg px-3 py-2 text-xs text-slate-600"
								>
									Cancel
								</button>
								<button type="submit" className="button">
									Save role
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
							Delete role?
						</h3>
						<p className="mt-3 text-sm text-slate-500">
							Remove {deleting.name} from this session?
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
									setRoles((current) =>
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
