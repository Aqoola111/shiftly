'use client'

import {Button} from "@/components/ui/button"
import {AlertTriangle} from "lucide-react"

type Props = {
	onConfirm: () => void
	onCancel: () => void
	description?: string
};

const ConfirmForm = ({onConfirm, onCancel, description}: Props) => {
	return (
		<div className="flex flex-col gap-6 py-4">
			<div
				className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
				<AlertTriangle className="size-6 shrink-0"/>
				<p className="text-sm font-medium">
					{description || "This action cannot be undone. Are you sure you want to proceed?"}
				</p>
			</div>
			
			<div className="flex items-center gap-3 w-full">
				<Button
					variant="outline"
					onClick={onCancel}
					className="flex-1 h-11 font-bold uppercase tracking-wider text-xs"
				>
					No, Cancel
				</Button>
				<Button
					variant="destructive"
					onClick={onConfirm}
					className="flex-1 h-11 font-bold uppercase tracking-wider text-xs shadow-md shadow-destructive/20"
				>
					Yes, Confirm
				</Button>
			</div>
		</div>
	);
};

export default ConfirmForm;