import type React from "react";

interface TagProps {
	variant?: "default" | "accent" | "dark" | "outline";
	children: React.ReactNode;
	className?: string;
}

export const Tag = ({
	variant = "default",
	children,
	className = "",
}: TagProps) => {
	const baseStyles =
		"px-2 py-0.5 text-[11px] font-mono font-bold rounded-sm uppercase tracking-widest transition-all duration-300 inline-block";

	const variants = {
		default: "bg-lt-border text-lt-ink",
		accent: "bg-lt-accent text-white",
		dark: "bg-lt-ink text-lt-bg",
		outline:
			"border border-lt-ink text-lt-ink hover:bg-lt-ink hover:text-lt-bg",
	};

	return (
		<span className={`${baseStyles} ${variants[variant]} ${className}`}>
			{children}
		</span>
	);
};
