import type { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";

interface DonateButtonProps {
	setShowModal: Dispatch<SetStateAction<boolean>>;
	label?: string;
}

export default function DonateButton({
	setShowModal,
	label = "",
}: DonateButtonProps) {
	return (
		<Button
			variant="outline"
			className="w-full flex-1 py-3 rounded-sm"
			onClick={() => setShowModal(true)}
		>
			{label}
		</Button>
	);
}
