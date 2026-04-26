'use client'

import ConfirmForm from "@/components/shared/confirm-form";
import FormWrapper from "@/components/shared/form-wrapper";
import {Button} from "@/components/ui/button";
import AddLocationForm from "@/features/locations/components/add-location-form";
import {useModal} from "@/store/use-modal-store";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import React from 'react'
import {RouterOutput} from "@/trpc/init"
import {
	Card,
	CardContent, CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {MapPin, Info, Building2, Edit, Trash} from 'lucide-react'
import {Badge} from "@/components/ui/badge"
import {toast} from "sonner";

type Props = {
	location: RouterOutput["locations"]['getAllLocations'][number]
}

const LocationCard = ({location}: Props) => {
	const {isOpen, type, onClose, data, onOpen} = useModal()
	const queryClient = useQueryClient()
	const trpc = useTRPC()
	
	const deleteLocation = useMutation(trpc.locations.deleteLocation.mutationOptions({
		onSuccess: async () => {
			toast.success(`Location ${location.name} deleted successfully!`)
			await queryClient.invalidateQueries({
				queryKey: trpc.locations.getAllLocations.queryKey()
			})
			onClose()
		},
		onError: err => {
			toast.error(err.message)
		}
	}))
	
	
	return (
		<Card className="overflow-hidden transition-all hover:shadow-lg border-muted-foreground/20">
			<FormWrapper
				open={isOpen && type === 'deleteLocation'}
				onOpenChange={onClose}
				description={`Removing this venue will affect scheduled shifts.`}
				title={`Delete location ${location.name}`}>
				<ConfirmForm onConfirm={() => deleteLocation.mutate({locationId: location.id})} onCancel={onClose}/>
			</FormWrapper>
			<FormWrapper
				open={isOpen && type === 'editLocation'}
				onOpenChange={onClose}
				title={`Edit location ${location.name}`}>
				<AddLocationForm onSuccess={onClose} initialValues={location} type={'edit'}/>
			</FormWrapper>
			<CardHeader className="pb-3 bg-muted/30">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Building2 className="size-5 text-primary"/>
						</div>
						<CardTitle className="text-xl font-bold truncate">
							{location.name}
						</CardTitle>
					</div>
					<Badge variant="secondary" className="font-medium">
						Venue
					</Badge>
				</div>
			</CardHeader>
			
			<CardContent className="pt-5 space-y-4">
				<div className="flex items-start gap-3">
					<MapPin className="size-4 text-muted-foreground mt-1 shrink-0"/>
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">Address</p>
						<p className="text-sm text-muted-foreground">
							{location.address}
						</p>
					</div>
				</div>
				
				{location.instructions && (
					<div
						className="flex items-start gap-3 p-3 rounded-md bg-orange-50/50 border border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/30">
						<Info className="size-4 text-orange-600 mt-0.5 shrink-0"/>
						<div className="space-y-1">
							<p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
								Access Instructions
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{location.instructions}
							</p>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className='justify-end gap-2'>
				<Button onClick={() => onOpen('editLocation', {location: location})} variant='outline'>
					<Edit className='size-4'/>
				</Button>
				<Button onClick={() => onOpen('deleteLocation', {location: location})} variant='destructive'>
					<Trash className='size-4'/>
				</Button>
			</CardFooter>
		</Card>
	)
}

export default LocationCard