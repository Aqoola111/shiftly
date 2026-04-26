'use client'
import FormWrapper from "@/components/shared/form-wrapper";
import {Button} from "@/components/ui/button";
import EventCard from "@/features/events/components/event-card";
import EventForm from "@/features/events/components/event-form";
import {useModal} from "@/store/use-modal-store";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {CalendarDays, Loader, Plus} from "lucide-react";
import React from 'react'

const EventsClientPage = () => {
	const trpc = useTRPC()
	const {data: events, isLoading} = useQuery(trpc.events.getAllEvents.queryOptions())
	const {data: locations, isLoading: locationsLoading} = useQuery(trpc.locations.getAllLocations.queryOptions())
	
	const {isOpen, onOpen, type, onClose} = useModal()
	
	if (isLoading) {
		return (
			<div className='flex flex-1 h-full items-center justify-center'>
				<Loader className='animate-spin text-primary' size={32}/>
			</div>
		)
	}
	
	const hasEvents = events && events.length > 0
	
	return (
		<div className='flex-1 w-full h-full p-6'>
			{!hasEvents ? (
				<div className='h-full flex flex-col gap-4 items-center justify-center text-center'>
					<div className="bg-primary/10 p-4 rounded-full">
						<CalendarDays className="size-12 text-primary"/>
					</div>
					<div className="space-y-2">
						<h1 className='font-heading text-3xl font-bold tracking-tight'>
							No events scheduled
						</h1>
						<p className="text-muted-foreground">
							Start by adding your first event to manage staff and shifts.
						</p>
					</div>
					
					<Button size="lg" className="gap-2" onClick={() => onOpen('addEvent')}>
						<Plus className="size-4"/>
						Create first event
					</Button>
					
					<FormWrapper
						open={isOpen && (type === 'addEvent' || type === 'editEvent')}
						onOpenChange={onClose}
						description='Provide event details to get started'
						title={type === 'addEvent' ? 'Create Event' : 'Edit Event'}
					>
						<EventForm
							onSuccess={onClose}
							locations={locations || []} // Прокидываем локации для Select
						/>
					</FormWrapper>
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h1 className='font-heading text-2xl font-bold font-headline uppercase italic tracking-tighter'>
							Events Calendar
						</h1>
						
						<Button variant="default" size="sm" className="gap-2" onClick={() => onOpen('addEvent')}>
							<Plus className="size-4"/>
							Add Event
						</Button>
						
						<FormWrapper
							open={isOpen && (type === 'addEvent' || type === 'editEvent')}
							onOpenChange={onClose}
							description='Provide event details'
							title={type === 'addEvent' ? 'Create Event' : 'Edit Event'}
						>
							<EventForm
								onSuccess={onClose}
								locations={locations || []}
							/>
						</FormWrapper>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{events.map(event => (
							<EventCard event={event} key={event.id}/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
export default EventsClientPage
