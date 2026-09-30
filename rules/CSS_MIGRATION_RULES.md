## Do
- Preserve the current visual presentation while cleaning up the guest pages incrementally.
- Use standard Tailwind utilities and shared design tokens; add a named reusable token or component class when a value is genuinely part of the design system.
- Give inputs a shared class and buttons consistent shared classes, including primary and secondary/outline variants.
- Remove styling-only IDs and their corresponding CSS selectors when migrating those styles.
- Keep IDs required for labels, accessibility relationships, or functional targeting.
- Remove CSS selectors once their styling has moved and they have no remaining use.
- Check the latest contents of files you’ve edited, preserve your changes, and commit/push my task changes.

## Don’t
- Add arbitrary-value Tailwind classes such as `text-[...]`, `bg-[#...]`, or other one-off bracket values.
- invent random font sizes, colors, shadows, or duplicate styles.
- Run unnecessary commands such as `npx` checks; you’ll handle typecheck and lint.
- Remove shared CSS tokens, reusable component styles, or complex effects that still belong in the design system.

I’ll keep the work focused on the guest pages, starting with the login form and shared form controls. No files have been changed for this request.