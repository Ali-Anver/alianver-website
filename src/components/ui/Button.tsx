import type { MouseEventHandler, ReactNode } from "react";

type ButtonAs = "button" | "a";
type ButtonVariant =
	| "base"
	| "outline"
	| "solid"
	| "accent"
	| "ghost"
	| "toggle"
	| "chip"
	| "icon"
	| "unstyled";

interface ButtonProps {
	as?: ButtonAs;
	variant?: ButtonVariant;
	active?: boolean;
	className?: string;
	children: ReactNode;
	id?: string;
	type?: "button" | "submit" | "reset";
	href?: string;
	target?: string;
	rel?: string;
	title?: string;
	disabled?: boolean;
	ariaLabel?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	dataShare?: string;
}

const baseClasses =
	"inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lt-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
	base: "",
	outline:
		"border border-lt-ink font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lt-ink hover:bg-lt-ink hover:text-lt-bg transition-colors duration-150",
	solid:
		"border border-lt-ink font-mono text-[11px] font-bold uppercase tracking-[0.2em] bg-lt-ink text-lt-bg hover:bg-lt-accent hover:border-lt-accent transition-colors duration-150",
	accent:
		"border border-lt-accent font-mono text-[11px] font-bold uppercase tracking-[0.2em] bg-lt-accent text-white hover:bg-lt-ink hover:border-lt-ink transition-colors duration-150",
	ghost:
		"font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lt-ink hover:bg-lt-ink/5 transition-colors duration-150",
	toggle:
		"px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest border border-transparent transition-colors duration-150 data-[active=true]:bg-lt-ink data-[active=true]:text-lt-bg data-[active=true]:shadow-inner data-[active=false]:text-lt-ghost data-[active=false]:hover:text-lt-ink",
	chip: "px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest border border-lt-ink/20 transition-colors duration-150 data-[active=true]:bg-lt-accent data-[active=true]:text-white data-[active=true]:border-lt-accent data-[active=true]:shadow-md data-[active=false]:bg-white/50 data-[active=false]:text-lt-muted data-[active=false]:hover:bg-lt-ink data-[active=false]:hover:text-lt-bg data-[active=false]:hover:border-lt-ink",
	icon: "text-lt-ink hover:text-lt-accent transition-colors duration-150",
	unstyled: "",
};

export default function Button({
	as = "button",
	variant = "base",
	active,
	className = "",
	class: _class = "",
	children,
	id,
	type = "button",
	href,
	target,
	rel,
	title,
	disabled = false,
	ariaLabel,
	onClick,
	dataShare,
}: ButtonProps & { class?: string }) {
	const resolvedClassName = className || _class || "";
	const classes = [baseClasses, variantClasses[variant], resolvedClassName]
		.filter(Boolean)
		.join(" ");

	const dataAttrs: Record<string, string> = {
		"data-active": active ? "true" : "false",
	};
	if (dataShare) {
		dataAttrs["data-share"] = dataShare;
	}

	if (as === "a") {
		return (
			<a
				id={id}
				href={href}
				target={target}
				rel={rel}
				title={title}
				aria-label={ariaLabel}
				aria-disabled={disabled || undefined}
				onClick={onClick}
				className={classes}
				{...dataAttrs}
			>
				{children}
			</a>
		);
	}

	return (
		<button
			id={id}
			type={type}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
			onClick={onClick}
			className={classes}
			{...dataAttrs}
		>
			{children}
		</button>
	);
}
