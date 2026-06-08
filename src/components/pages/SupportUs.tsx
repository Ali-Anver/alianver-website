import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import DonateButton from "./DonateButton";
import { siteConfig } from "../../config";

const Modal = ({
	showModal,
	setShowModal,
}: {
	showModal: boolean;
	setShowModal: (v: boolean) => void;
}) =>
	showModal ? (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
			<div className="bg-lt-bg p-6 rounded-sm shadow-xl max-w-sm w-full space-y-4">
				<img
					src=""
					alt="Donation QR Code"
					className="w-full h-auto"
				/>
				<p className="font-cn text-[12px] text-lt-ink text-center">
					Scan with WeChat
				</p>
				<Button
					onClick={() => setShowModal(false)}
					variant="outline"
					className="w-full py-2 rounded-sm"
				>
					Close
				</Button>
			</div>
		</div>
	) : null;

export const SupportUs = () => {
	const [showModal, setShowModal] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-6 md:px-16 py-10 md:py-12 overflow-hidden border-b border-lt-border/20">
			{/* Background Watermark */}
			<div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
				<svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
					<path d="M2,21V19H20V21H2M20,7H17V3H20V7M17,17H6V9H17V17Z" />
				</svg>
			</div>

			<div className="relative z-10 flex flex-col gap-6">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="w-[3px] h-[10px] bg-rl-gold" />
						<span className="text-[11px] font-mono tracking-[0.2em] font-semibold text-lt-ink uppercase">
							Donation_Channel
						</span>
					</div>
				</div>

				<p className="font-cn text-[14px] text-lt-ink leading-relaxed">
					If you enjoy this content, consider buying me a coffee.
				</p>

				<div className="flex gap-4">
					<DonateButton setShowModal={setShowModal} label="Donate" />
					<Button
						as="a"
						href={siteConfig.url}
						target="_blank"
						rel="noopener noreferrer"
						variant="outline"
						className="flex-1 text-center py-3 rounded-sm"
					>
						Aifadian
					</Button>
				</div>
			</div>

			{mounted &&
				createPortal(
					<Modal showModal={showModal} setShowModal={setShowModal} />,
					document.body,
				)}
		</div>
	);
};
