"use client";

import React, {useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import {RouterOutput} from "@/trpc/init";
import {format} from "date-fns";

import {createEventSchema, CreateEventSchemaType} from "@/features/events/schemas";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {ScrollArea} from "@/components/ui/scroll-area";

import {MapPin, Type, AlignLeft, Loader2, CalendarIcon, Clock} from 'lucide-react';
import {toast} from "sonner";

type EventTrpc = RouterOutput["events"]["getAllEvents"][number];
type LocationTrpc = RouterOutput["locations"]["getAllLocations"][number];

type EventFormProps = {
	onSuccess: () => void;
	initialValues?: EventTrpc;
	locations: LocationTrpc[];
	type?: 'add' | 'edit';
};

const EventForm = ({onSuccess, initialValues, locations, type = 'add'}: EventFormProps) => {
	const isEdit = type === 'edit' && !!initialValues;
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	
	const form = useForm({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			title: initialValues?.title || '',
			description: initialValues?.description || '',
			locationId: initialValues?.locationId || '',
			day: initialValues?.date ? new Date(initialValues.date) : undefined,
			startTime: initialValues?.startTime ? new Date(initialValues.startTime) : undefined,
			endTime: initialValues?.endTime ? new Date(initialValues.endTime) : undefined,
		},
	});
	
	
	const handleTimeUpdate = (fieldName: "startTime" | "endTime", unit: "hour" | "minute", value: number) => {
		const currentVal = form.getValues(fieldName);
		const dayVal = form.getValues("day");
		
		const baseDate = currentVal instanceof Date
			? currentVal
			: (dayVal instanceof Date ? dayVal : new Date());
		
		const newDate = new Date(baseDate);
		
		if (unit === "hour") newDate.setHours(value);
		else newDate.setMinutes(value);
		
		newDate.setSeconds(0, 0);
		form.setValue(fieldName, newDate, {shouldValidate: true});
	};
	
	
	const addMutation = useMutation(trpc.events.createEvent.mutationOptions({
		onSuccess: async (event) => {
			toast.success(`Event "${event.title}" created!`);
			await queryClient.invalidateQueries({queryKey: trpc.events.getAllEvents.queryKey()});
			onSuccess();
		},
		onError: (error) => toast.error(error.message),
	}));
	
	const updateMutation = useMutation(trpc.events.updateEvent.mutationOptions({
		onSuccess: async (event) => {
			toast.success(`Event "${event.title}" updated!`);
			await queryClient.invalidateQueries({queryKey: trpc.events.getAllEvents.queryKey()});
			onSuccess();
		},
		onError: (error) => toast.error(error.message),
	}));
	
	const isLoading = addMutation.isPending || updateMutation.isPending;
	
	const handleSubmit = (values: CreateEventSchemaType) => {
		if (isEdit) {
			updateMutation.mutate({...values, eventId: initialValues.id});
		} else {
			addMutation.mutate(values);
		}
	};
	
	
	const TimePickerContent = ({fieldName}: { fieldName: "startTime" | "endTime" }) => {
		const val = form.watch(fieldName) as Date | undefined;
		return (
			<div className="flex h-[250px] divide-x">
				<ScrollArea className="w-16">
					<div className="flex flex-col p-1">
						{Array.from({length: 24}, (_, i) => i).map((h) => (
							<Button key={h} size="sm" variant={val?.getHours() === h ? "default" : "ghost"}
									className="h-8 w-full" onClick={() => handleTimeUpdate(fieldName, "hour", h)}>
								{h.toString().padStart(2, '0')}
							</Button>
						))}
					</div>
				</ScrollArea>
				<ScrollArea className="w-16">
					<div className="flex flex-col p-1">
						{[0, 15, 30, 45].map((m) => (
							<Button key={m} size="sm" variant={val?.getMinutes() === m ? "default" : "ghost"}
									className="h-8 w-full" onClick={() => handleTimeUpdate(fieldName, "minute", m)}>
								{m.toString().padStart(2, '0')}
							</Button>
						))}
					</div>
				</ScrollArea>
			</div>
		);
	};
	
	return (
		<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 @container">
			<div className="grid grid-cols-12 gap-4">
				
				{/* Title */}
				<Controller control={form.control} name="title" render={({field, fieldState}) => (
					<Field className="col-span-12 flex flex-col gap-2 items-start">
						<FieldLabel>Event Title</FieldLabel>
						<div className="relative w-full">
							<Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
							<Input {...field} className="pl-9 h-11" placeholder="Wedding: David & Oksana"/>
						</div>
						{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
					</Field>
				)}/>
				
				{/* Venue */}
				<Controller control={form.control} name="locationId" render={({field, fieldState}) => (
					<Field className="col-span-12 flex flex-col gap-2 items-start">
						<FieldLabel>Venue</FieldLabel>
						<Select value={field.value} onValueChange={field.onChange} disabled={locations.length === 0}>
							<SelectTrigger className="h-11 relative pl-9 text-left w-full">
								<MapPin
									className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
								<SelectValue
									placeholder={locations.length > 0 ? "Select location" : "No locations found"}/>
							</SelectTrigger>
							<SelectContent>
								{locations.map((loc) => <SelectItem key={loc.id}
																	value={loc.id}>{loc.name}</SelectItem>)}
							</SelectContent>
						</Select>
						{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
					</Field>
				)}/>
				
				{/* Day */}
				<Controller control={form.control} name="day" render={({field, fieldState}) => (
					<Field className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start">
						<FieldLabel>Date</FieldLabel>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full justify-start h-11 font-normal">
									<CalendarIcon className="mr-2 h-4 w-4"/>
									{field.value ? format(field.value, "PPP") : <span>Pick date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value}
																			 onSelect={field.onChange}/></PopoverContent>
						</Popover>
					</Field>
				)}/>
				
				{/* Times */}
				<div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-2">
					<Controller control={form.control} name="startTime" render={({field, fieldState}) => (
						<Field className="flex flex-col gap-2 items-start">
							<FieldLabel>Start</FieldLabel>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-full h-11 font-normal">
										<Clock className="mr-2 h-4 w-4"/>
										{field.value ? format(field.value, "HH:mm") : "--:--"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0"><TimePickerContent
									fieldName="startTime"/></PopoverContent>
							</Popover>
							{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
						</Field>
					)}/>
					<Controller control={form.control} name="endTime" render={({field, fieldState}) => (
						<Field className="flex flex-col gap-2 items-start">
							<FieldLabel>End</FieldLabel>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-full h-11 font-normal">
										<Clock className="mr-2 h-4 w-4"/>
										{field.value ? format(field.value, "HH:mm") : "--:--"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0"><TimePickerContent
									fieldName="endTime"/></PopoverContent>
							</Popover>
							{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
						</Field>
					)}/>
				</div>
				
				{/* Description */}
				<Controller control={form.control} name="description" render={({field, fieldState}) => (
					<Field className="col-span-12 flex flex-col gap-2 items-start">
						<FieldLabel>Description</FieldLabel>
						<div className="relative w-full">
							<AlignLeft className="absolute left-3 top-3 size-4 text-muted-foreground"/>
							<Textarea {...field} className="pl-9 min-h-[100px] resize-none" placeholder="Details..."/>
						</div>
					</Field>
				)}/>
				
				{/* Submit */}
				<div className="col-span-12 pt-4">
					<Button disabled={isLoading || locations.length === 0} type="submit"
							className="w-full h-11 font-semibold">
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
						{isEdit ? "Update Event" : "Create Event"}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default EventForm;