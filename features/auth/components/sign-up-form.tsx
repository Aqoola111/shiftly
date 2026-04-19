'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {SignUpFormSchema, signUpFormSchemaType} from "@/features/auth/schemas";
import {authClient} from "@/lib/auth-client";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {User, Mail, Calendar, Lock, ShieldCheck} from "lucide-react";
import {toast} from "sonner";

const SignUpForm = () => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<signUpFormSchemaType>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: {
			name: '',
			lastname: '',
			birth: new Date(),
			confirmPassword: '',
			password: '',
			email: ''
		}
	})
	
	const handleSubmit = async (data: signUpFormSchemaType) => {
		await authClient.signUp.email({
			email: data.email,
			password: data.password,
			name: data.name + ' ' + data.lastname,
		}, {
			onRequest: (ctx) => {
				setLoading(true)
			},
			onSuccess: (ctx) => {
				router.push('/onboarding');
			},
			onError: (ctx) => {
				setLoading(false)
				toast.error(ctx.error.message || "An error occurred while creating your account. Please try again.")
			}
		})
	}
	
	return (
		<Card className='w-full md:max-w-[450px] shadow-xl border-muted/50'>
			<CardHeader className="space-y-1.5">
				<CardTitle className="text-2xl tracking-tight">
					Welcome to <span className='font-bold font-heading text-primary'>Shiftly</span>
				</CardTitle>
				<CardDescription>
					Create your account to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="signup-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup className="gap-4">
						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="name"
								control={form.control}
								render={({field, fieldState}) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Name</FieldLabel>
										<div className="relative">
											<User
												className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
											<Input {...field} className="pl-9" placeholder="John"
												   aria-invalid={fieldState.invalid}/>
										</div>
										{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
									</Field>
								)}
							/>
							<Controller
								name="lastname"
								control={form.control}
								render={({field, fieldState}) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Lastname</FieldLabel>
										<Input {...field} placeholder="Doe" aria-invalid={fieldState.invalid}/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
									</Field>
								)}
							/>
						</div>
						
						<Controller
							name="email"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Email</FieldLabel>
									<div className="relative">
										<Mail
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input {...field} className="pl-9" type="email" placeholder="example@mail.com"
											   aria-invalid={fieldState.invalid}/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
								</Field>
							)}
						/>
						
						<Controller
							name="birth"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Date of Birth</FieldLabel>
									<div className="relative">
										<Calendar
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input
											{...field}
											className="pl-9"
											type="date"
											value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
											onChange={(e) => field.onChange(new Date(e.target.value))}
											aria-invalid={fieldState.invalid}
										/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
								</Field>
							)}
						/>
						
						<Controller
							name="password"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Password</FieldLabel>
									<div className="relative">
										<Lock
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input {...field} className="pl-9" type="password" placeholder="••••••••"
											   aria-invalid={fieldState.invalid}/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
								</Field>
							)}
						/>
						
						<Controller
							name="confirmPassword"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Confirm Password</FieldLabel>
									<div className="relative">
										<ShieldCheck
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input {...field} className="pl-9" type="password" placeholder="••••••••"
											   aria-invalid={fieldState.invalid}/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 pt-2">
				<Button type="submit" form="signup-form"
						disabled={loading}
						className="w-full h-11 font-semibold shadow-md transition-all hover:opacity-90 active:scale-[0.98]">
					Create account
				</Button>
				<div className="text-sm text-muted-foreground text-center">
					Already have an account?{" "}
					<Link href="/sign-in"
						  className="text-primary hover:underline underline-offset-4 font-semibold transition-colors">
						Sign in
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}

export default SignUpForm