import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export function DashboardHeader({
    userName,
}: {
    userName: string;
}) {
    const firstName = userName.trim().split(/\s+/)[0] || "Admin";

    const today = new Intl.DateTimeFormat("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 17
              ? "Good afternoon"
              : "Good evening";

    return (
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-sm font-medium text-[#FFA64D]">
                    {greeting}, {firstName}
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#172B3A] sm:text-2xl">
                    Here&apos;s what&apos;s happening today.
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    A quick overview of your business activity and
                    operations.
                </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-500 admin-shadow-soft">
                <CalendarDaysIcon className="h-4 w-4 text-[#FFA64D]" />

                <span>{today}</span>
            </div>
        </section>
    );
}