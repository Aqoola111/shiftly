'use client'

import {createLocationSchema, createLocationSchemaType} from "@/features/locations/schemas";
import {useTRPC} from "@/trpc/client";
import {RouterOutput} from "@/trpc/init";
import {LocationTrpc} from "@/trpc/routers/Infrastructure/locations";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import React, {useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Building2, MapPin, Info, Loader2} from 'lucide-react'
import {toast} from "sonner";

type AddLocationFormProps = {
	onSuccess: () => void
	initialValues?: LocationTrpc
	type?: 'add' | 'edit'
}


const AddLocationForm = ({onSuccess, initialValues, type = 'add'}: AddLocationFormProps) => {
	const isEdit = type === 'edit' && !!initialValues;
	
	const form = useForm<createLocationSchemaType>({
		resolver: zodResolver(createLocationSchema),
		defaultValues: initialValues ? {
			name: initialValues.name,
			address: initialValues.address,
			instructions: initialValues.instructions || '',
		} : {
			name: '',
			address: '',
			instructions: '',
		},
	})
	
	useEffect(() => {
		if (initialValues) {
			form.reset({
				name: initialValues.name,
				address: initialValues.address,
				instructions: initialValues.instructions || '',
			});
		}
	}, [initialValues, form]);
	
	const queryClient = useQueryClient()
	const trpc = useTRPC()
	
	const addMutation = useMutation(trpc.locations.addLocation.mutationOptions({
		onSuccess: async (location) => {
			if (!location) throw new Error('Failed to create location')
			toast.success(`Location ${location.name} created successfully!`)
			await queryClient.invalidateQueries({
				queryKey: trpc.locations.getAllLocations.queryKey()
			})
			onSuccess()
		},
		onError: (error) => {
			toast.error(error.message)
		},
	}))
	
	const updateMutation = useMutation(trpc.locations.updateLocation.mutationOptions({
		onSuccess: async (location) => {
			if (!location) throw new Error('Failed to update location')
			toast.success(`Location ${location.name} updated successfully!`)
			await queryClient.invalidateQueries({
				queryKey: trpc.locations.getAllLocations.queryKey()
			})
			onSuccess()
		},
		onError: (error) => {
			toast.error(error.message)
		},
	}))
	
	
	const isLoading = addMutation.isPending || updateMutation.isPending;
	
	const handleSubmit = (values: createLocationSchemaType) => {
		if (isEdit) {
			updateMutation.mutate({
				...values,
				locationId: initialValues.id
			})
		} else {
			addMutation.mutate(values)
		}
	}
	
	return (
		<form id="add-location-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
			<FieldGroup className="gap-4">
				<Controller
					name="name"
					control={form.control}
					render={({field, fieldState}) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Venue Name</FieldLabel>
							<div className="relative">
								<Building2
									className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
								<Input {...field} className="pl-9 h-11" placeholder="Grand Ballroom"/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
						</Field>
					)}
				/>
				
				<Controller
					name="address"
					control={form.control}
					render={({field, fieldState}) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Address</FieldLabel>
							<div className="relative">
								<MapPin
									className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
								<Input {...field} className="pl-9 h-11" placeholder="123 Luxury St, Bat Yam"/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
						</Field>
					)}
				/>
				
				<Controller
					name="instructions"
					control={form.control}
					render={({field, fieldState}) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Access Instructions</FieldLabel>
							<div className="relative">
								<Info className="absolute left-3 top-3 size-4 text-muted-foreground"/>
								<Textarea {...field} className="pl-9 min-h-[100px] resize-none"
										  placeholder="Gate codes..."/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
						</Field>
					)}
				/>
			</FieldGroup>
			
			<Button
				disabled={isLoading}
				type="submit"
				className="w-full h-11 font-semibold shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
			>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
				{isEdit ? "Update Venue" : "Create Venue"}
			</Button>
		</form>
	)
}

export default AddLocationForm