'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {organizationSchema, organizationSchemaType} from "@/features/boarding/schemas";
import {useDebounce} from "@/hooks/use-debounce";
import {authClient} from "@/lib/auth-client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Building2, Globe, ArrowRight} from "lucide-react";
import {toast} from "sonner";

const CreateOrganizationForm = () => {
	const [loading, setLoading] = useState(false);
	const [slugAvailable, setSlugAvailable] = useState(false);
	
	const form = useForm<organizationSchemaType>({
		resolver: zodResolver(organizationSchema),
		defaultValues: {
			name: '',
		}
	});
	
	
	const orgName = form.watch("name");
	const previewSlug = orgName
		? orgName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
		: "your-slug";
	
	const debouncedSlug = useDebounce(previewSlug, 500);
	
	const onSubmit = async (data: organizationSchemaType) => {
		console.log('heh')
		if (!debouncedSlug || !data.name) return
		console.log('hehehe')
		await authClient.organization.create({
			name: data.name,
			slug: debouncedSlug
		}, {
			onError: (ctx) => {
				setLoading(false)
				toast.error(ctx.error.message || "An error occurred while creating the organization. Please try again.")
			},
			onSuccess: (ctx) => {
				toast.success("Organization created successfully!")
				setLoading(false);
				// For example: router.push(`/organizations/${ctx.data.id}/dashboard`)
			},
			onRequest: (ctx) => {
				setLoading(true)
			}
		})
	};
	
	useEffect(() => {
		if (!orgName || orgName.length < 3) return;
		
		setLoading(true)
		
		async function checkSlug() {
			const {data, error} = await authClient.organization.checkSlug({
				slug: debouncedSlug
			})
			
			if (data && data.status === true && !error) {
				setSlugAvailable(true)
			}
			
			if (error && error.message) {
				setSlugAvailable(false)
				form.setError('name', {message: error.message})
			}
			
		}
		
		form.clearErrors('name')
		checkSlug()
		setLoading(false)
	}, [debouncedSlug]);
	
	return (
		<Card className='w-full md:max-w-[450px] shadow-xl border-muted/50'>
			<CardHeader className="space-y-1.5">
				<CardTitle className="text-2xl tracking-tight font-headline uppercase italic font-black text-primary">
					Register Business
				</CardTitle>
				<CardDescription>
					Create a workspace for your event management
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="create-org-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup className="gap-6">
						<Controller
							name="name"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Organization Name</FieldLabel>
									<div className="relative">
										<Building2
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input
											{...field}
											className="pl-9 h-11"
											placeholder="Grand Plaza Events"
											aria-invalid={fieldState.invalid}
										/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
									
									{!fieldState.invalid && orgName && slugAvailable && (
										<div
											className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all animate-in fade-in slide-in-from-top-1">
											<Globe className="size-3.5 text-primary"/>
											<p className="text-[11px] text-muted-foreground truncate">
												Workspace URL: <span
												className="font-bold text-primary">shiftly.app/{previewSlug}</span>
											</p>
										</div>
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 pt-2">
				<Button
					type="submit"
					form="create-org-form"
					disabled={loading || !slugAvailable}
					className="w-full h-12 font-bold shadow-md transition-all hover:opacity-90 active:scale-[0.98] bg-primary text-primary-foreground flex gap-2"
				>
					Create Organization
					<ArrowRight className="size-4"/>
				</Button>
				<p className="text-[10px] text-center text-muted-foreground px-6 uppercase tracking-widest font-medium">
					By creating an organization you agree to our Terms of Service
				</p>
			</CardFooter>
		</Card>
	);
};

export default CreateOrganizationForm;