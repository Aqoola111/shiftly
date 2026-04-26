import {z} from "zod";

export const createLocationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	address: z.string().min(1, 'Address is required'),
	instructions: z.string().optional(),
})

export type createLocationSchemaType = z.infer<typeof createLocationSchema>