import {z} from "zod";

export const SignUpFormSchema = z
	.object({
		email: z.email("Invalid email address"),
		name: z.string().min(2, "Name is too short").max(50),
		lastname: z.string().min(2, "Lastname is too short").max(50),
		birth: z.date({
			error: "Please select a date",
		}),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long"), //Todo: uncomment
		// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		// .regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(8, "Confirm Password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

export const SignInFormSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long")
})


export type signInFormSchemaType = z.infer<typeof SignInFormSchema>
export type signUpFormSchemaType = z.infer<typeof SignUpFormSchema>