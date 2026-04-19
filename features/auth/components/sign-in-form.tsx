'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {SignInFormSchema, signInFormSchemaType} from "@/features/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {Controller, useForm} from "react-hook-form";
import {Mail, Lock} from "lucide-react";

const SignInForm = () => {
	const form = useForm<signInFormSchemaType>({
		resolver: zodResolver(SignInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})
	
	const handleSubmit = (data: signInFormSchemaType) => {
		// Submit logic
	}
	
	return (
		<Card className='w-full md:max-w-[450px] shadow-xl border-muted/50'>
			<CardHeader className="space-y-1.5">
				<CardTitle className="text-2xl tracking-tight">
					Welcome back to <span className='font-bold font-heading text-primary'>Shiftly</span>
				</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="signin-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup className="gap-4">
						<Controller
							name="email"
							control={form.control}
							render={({field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Email</FieldLabel>
									<div className="relative">
										<Mail
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input
											{...field}
											className="pl-9"
											type="email"
											placeholder="example@mail.com"
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
									<div className="flex items-center justify-between">
										<FieldLabel>Password</FieldLabel>
										<Link
											href="/forgot-password"
											className="text-xs text-primary hover:underline font-medium"
										>
											Forgot password?
										</Link>
									</div>
									<div className="relative">
										<Lock
											className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
										<Input
											{...field}
											className="pl-9"
											type="password"
											placeholder="••••••••"
											aria-invalid={fieldState.invalid}
										/>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 pt-2">
				<Button
					type="submit"
					form="signin-form"
					className="w-full h-11 font-semibold shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
				>
					Sign in
				</Button>
				<div className="text-sm text-muted-foreground text-center">
					Don&apos;t have an account?{" "}
					<Link
						href="/sign-up"
						className="text-primary hover:underline underline-offset-4 font-semibold transition-colors"
					>
						Register now
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}

export default SignInForm