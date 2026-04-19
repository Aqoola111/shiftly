import {z} from "zod";

export const organizationSchema = z.object({
	name: z.string()
		.min(3, "Organization name must be at least 3 characters")
		.max(50, "Name is too long")
})

export const serverOrganizationSchema = organizationSchema.extend({
	slug: z.string().min(4, "Slug is required"),
})

export type organizationSchemaType = z.infer<typeof organizationSchema>