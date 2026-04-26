'use client'
import FormWrapper from "@/components/shared/form-wrapper";
import {Button} from "@/components/ui/button";
import AddLocationForm from "@/features/locations/components/add-location-form";
import LocationCard from "@/features/locations/components/location-card";
import {useModal} from "@/store/use-modal-store";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {Loader, Plus} from "lucide-react";
import React from 'react'

const LocationsClientPage = () => {
	const trpc = useTRPC()
	const {data: locations, isLoading} = useQuery(trpc.locations.getAllLocations.queryOptions())
	const {isOpen, onOpen, type, onClose} = useModal()
	
	if (isLoading) {
		return (
			<div className='flex flex-1 h-full items-center justify-center'>
				<Loader className='animate-spin text-primary' size={32}/>
			</div>
		)
	}
	
	const hasLocations = locations && locations.length > 0
	
	return (
		<div className='flex-1 w-full h-full p-6'>
			{!hasLocations ? (
				<div className='h-full flex flex-col gap-4 items-center justify-center text-center'>
					<div className="space-y-2">
						<h1 className='font-heading text-3xl font-bold tracking-tight'>
							No locations found
						</h1>
						<p className="text-muted-foreground">
							Please add a location to start scheduling shifts.
						</p>
					</div>
					
					<Button size="lg" className="gap-2" onClick={() => onOpen('addLocation')}>
						<Plus className="size-4"/>
						Add first location
					</Button>
					
					<FormWrapper
						open={isOpen && type === 'addLocation'}
						onOpenChange={onClose}
						description='Fill the following form to add new location'
						title='Add new location'
					>
						<AddLocationForm onSuccess={onClose}/>
					</FormWrapper>
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h1 className='font-heading text-2xl font-bold'>Venues</h1>
						
						<Button variant="outline" size="sm" onClick={() => onOpen('addLocation')}>
							Add Location
						</Button>
						
						<FormWrapper
							open={isOpen && type === 'addLocation'}
							onOpenChange={onClose}
							description='Fill the following form to add new location'
							title='Add new location'
						>
							<AddLocationForm onSuccess={onClose}/>
						</FormWrapper>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{locations.map(location => (
							<LocationCard location={location} key={location.id}/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default LocationsClientPage