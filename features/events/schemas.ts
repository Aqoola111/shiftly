import {z} from "zod";

export const createEventSchema = z.object({
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title is too long"),
	
	description: z
		.string()
		.max(500, "Description is too long")
		.optional()
		.or(z.literal("")),
	
	day: z.coerce.date<Date | undefined>(),
	startTime: z.preprocess((arg: string | Date | undefined) => (arg === "" ? undefined : arg),
		z.coerce.date<string | Date | undefined>()
	),
	endTime: z.preprocess((arg: string | Date | undefined) => (arg === "" ? undefined : arg),
		z.coerce.date<string | Date | undefined>()
	),
	locationId: z
		.string()
		.min(1, "Please select a location"),
}).refine((data) => {
	return data.startTime && data.endTime ? data.startTime < data.endTime : true;
}, {
	error: "End time must be after start time",
});


export type CreateEventSchemaType = z.infer<typeof createEventSchema>;