"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import {
	ArrowRightIcon,
	MagnifyingGlassIcon,
	UsersIcon,
	UserMinusIcon,
	UserGroupIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Employee } from "@/types/modules";

const statusStyles = {
	ACTIVE: "bg-emerald-50 text-emerald-700",
	INACTIVE: "bg-slate-100 text-slate-600",
};
const statusLabels = { ACTIVE: "Active", INACTIVE: "Inactive" };

export function EmployeeDirectory({ employees }: { employees: Employee[] }) {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("ALL");
	const query = search.trim().toLowerCase();
	const filtered = employees.filter(
		(employee) =>
			(status === "ALL" || employee.status === status) &&
			[
				employee.name,
				employee.email,
				employee.employeeNumber,
				employee.jobTitle,
			].some((value) => value.toLowerCase().includes(query)),
	);
	const summaries = [
		{ label: "Total employees", value: employees.length, icon: UsersIcon },
		{
			label: "Active employees",
			value: employees.filter((employee) => employee.status === "ACTIVE")
				.length,
			icon: UserGroupIcon,
		},
		{
			label: "Inactive employees",
			value: employees.filter((employee) => employee.status === "INACTIVE")
				.length,
			icon: UserMinusIcon,
		},
	];

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-medium text-[#FFA64D]">
						People &amp; Organization
					</p>
					<h2 className="mt-1 break-words text-lg! leading-snug! font-bold tracking-tight text-[#172B3A] sm:text-xl! mb-0! leading-snug!">
						Employees
					</h2>
					<p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
						Your team, their roles, and contact details in one place.
					</p>
				</div>
				<span className="w-fit rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">
					Employee directory
				</span>
			</header>

			<section
				aria-label="Employee summary"
				className="grid grid-cols-1 gap-4 sm:grid-cols-3"
			>
				{summaries.map(({ label, value, icon: Icon }) => (
					<article
						key={label}
						className="admin-shadow-soft rounded-2xl bg-white p-5"
					>
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA64D]/10">
							<Icon aria-hidden="true" className="h-5 w-5 text-[#FFA64D]" />
						</div>
						<p className="mt-5 text-2xl font-bold tracking-tight text-[#172B3A]">
							{value}
						</p>
						<p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
					</article>
				))}
			</section>

			<section
				aria-labelledby="directory-heading"
				className="admin-shadow-soft overflow-hidden rounded-2xl bg-white"
			>
				<div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
					<div>
						<h2
							id="directory-heading"
							className="text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!"
						>
							Employee directory
						</h2>
						<p className="mt-1 text-xs text-slate-500">
							Browse profiles or find someone on your team.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<div className="relative min-w-0 flex-1">
							<MagnifyingGlassIcon
								aria-hidden="true"
								className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400"
							/>
							<input
								aria-label="Search employees"
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search name, email, role, or employee number"
								className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs text-slate-700 placeholder:text-slate-500"
							/>
						</div>
						<select
							aria-label="Filter by employee status"
							value={status}
							onChange={(event) => setStatus(event.target.value)}
							className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600"
						>
							<option value="ALL">All statuses</option>
							<option value="ACTIVE">Active</option>
							<option value="INACTIVE">Inactive</option>
						</select>
					</div>
				</div>
				<div
					className="hidden grid-cols-[2fr_1.4fr_0.7fr_0.6fr] gap-4 border-y border-slate-100 bg-slate-50/70 px-6 py-2.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase md:grid"
					aria-hidden="true"
				>
					<span>Employee</span>
					<span>Job title</span>
					<span>Status</span>
					<span className="text-right">Profile</span>
				</div>
				<ul className="divide-y divide-slate-100">
					{filtered.map((employee) => (
						<li
							key={employee.id}
							className="px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
						>
							<div className="grid gap-3 md:grid-cols-[2fr_1.4fr_0.7fr_0.6fr] md:items-center md:gap-4">
								<div className="flex min-w-0 items-center gap-3">
									<div
										aria-hidden="true"
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172B3A]/5 text-xs font-semibold text-[#172B3A]"
									>
										{employee.name
											.split(/\s+/)
											.map((part) => part[0])
											.slice(0, 2)
											.join("")}
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-slate-800">
											{employee.name}
										</p>
										<p className="mt-1 break-all text-xs text-slate-500">
											{employee.employeeNumber} · {employee.email}
										</p>
									</div>
								</div>
								<p className="text-xs text-slate-500">{employee.jobTitle}</p>
								<div>
									<span
										className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${statusStyles[employee.status]}`}
									>
										{statusLabels[employee.status]}
									</span>
								</div>
								<Dialog.Root>
									<Dialog.Trigger
										className="flex w-fit items-center gap-1.5 rounded-lg py-1 text-xs font-semibold text-[#172B3A] hover:opacity-60 md:justify-self-end"
										aria-label={`View ${employee.name}'s profile`}
									>
										View
										<ArrowRightIcon
											aria-hidden="true"
											className="h-3.5 w-3.5"
										/>
									</Dialog.Trigger>
									<Dialog.Portal>
										<Dialog.Overlay className="fixed inset-0 z-40 bg-[#172B3A]/40 backdrop-blur-sm" />
										<Dialog.Content className="admin-shadow-popover fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-5 sm:p-6">
											<Dialog.Title className="pr-8 text-lg font-bold text-[#172B3A]">
												{employee.name}
											</Dialog.Title>
											<Dialog.Description className="mt-1 text-sm text-slate-500">
												Employee profile
											</Dialog.Description>
											<Dialog.Close
												aria-label="Close profile"
												className="absolute top-5 right-5 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
											>
												<XMarkIcon className="h-5 w-5" />
											</Dialog.Close>
											<dl className="mt-6 divide-y divide-slate-100">
												{[
													["Employee number", employee.employeeNumber],
													["Job title", employee.jobTitle],
													["Email", employee.email],
													["Status", statusLabels[employee.status]],
													[
														"User account",
														employee.userId ? "Linked" : "Not linked",
													],
												].map(([label, value]) => (
													<div
														key={label}
														className="grid gap-1 py-3 sm:grid-cols-2 sm:gap-4"
													>
														<dt className="text-xs text-slate-500">{label}</dt>
														<dd className="break-words text-sm font-medium text-slate-700">
															{value || "—"}
														</dd>
													</div>
												))}
											</dl>
										</Dialog.Content>
									</Dialog.Portal>
								</Dialog.Root>
							</div>
						</li>
					))}
				</ul>
				{filtered.length === 0 && (
					<div className="px-6 py-12 text-center">
						<UsersIcon
							aria-hidden="true"
							className="mx-auto h-8 w-8 text-slate-400"
						/>
						<p className="mt-3 text-sm font-medium text-slate-600">
							{employees.length ? "No matching employees" : "No employees yet"}
						</p>
						<p className="mt-1 text-xs text-slate-500">
							{employees.length
								? "Try another search or reset the status filter."
								: "Employee records will appear here when available."}
						</p>
						{employees.length > 0 && (
							<button
								type="button"
								onClick={() => {
									setSearch("");
									setStatus("ALL");
								}}
								className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-[#172B3A]"
							>
								Clear filters
							</button>
						)}
					</div>
				)}
				<div
					className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6"
					role="status"
				>
					Showing {filtered.length} of {employees.length} employees
				</div>
			</section>
		</div>
	);
}
