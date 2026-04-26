'use client'

import * as React from "react"
import {useIsMobile} from "@/hooks/use-mobile"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"

type Props = {
	title: string
	description?: string
	children?: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

const FormWrapper = ({title, description, children, open, onOpenChange}: Props) => {
	const isMobile = useIsMobile()
	
	if (!isMobile) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[450px]">
					<DialogHeader>
						<DialogTitle
							className="font-headline uppercase italic font-black text-primary text-2xl tracking-tight">
							{title}
						</DialogTitle>
						<DialogDescription>
							{description}
						</DialogDescription>
					</DialogHeader>
					{children}
				</DialogContent>
			</Dialog>
		)
	}
	
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle
						className="font-headline uppercase italic font-black text-primary text-2xl tracking-tight">
						{title}
					</DrawerTitle>
					<DrawerDescription>
						{description}
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 pb-4">
					{children}
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline" className="w-full h-11 font-bold uppercase tracking-widest text-xs">
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default FormWrapper