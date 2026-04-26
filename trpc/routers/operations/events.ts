import {createEventSchema} from "@/features/events/schemas";
import prisma from "@/lib/prisma";
import {createTRPCRouter, managerProcedure} from "@/trpc/init";
import {z} from "zod";

export const eventsRouter = createTRPCRouter({
	createEvent: managerProcedure.input(createEventSchema).mutation(({ctx, input}) => {
		const validated = createEventSchema.parse(input);
		const event = prisma.event.create({
			data: {
				title: input.title,
				locationId: input.locationId,
				creatorId: ctx.auth.user.id,
				date: validated.day,
				startTime: validated.startTime,
				endTime: validated.endTime,
				organizationId: ctx.orgId
			}
		})
		return event;
	}),
	deleteEvent: managerProcedure.input(z.object({
		eventId: z.string()
	})).mutation(({ctx, input}) => {
		return prisma.event.delete({
			where: {
				organizationId: ctx.orgId,
				id: input.eventId
			}
		})
	}),
	updateEvent: managerProcedure.input(createEventSchema.extend({
		eventId: z.string()
	})).mutation(({ctx, input}) => {
		return prisma.event.update({
			where: {
				organizationId: ctx.orgId,
				id: input.locationId
			}, data: {
				title: input.title,
				locationId: input.locationId,
				description: input.description,
			}
		})
	}),
	getAllEvents: managerProcedure.query(async ({ctx}) => {
		const events = prisma.event.findMany({
			where: {organizationId: ctx.orgId},
			include: {
				location: true,
				_count: {
					select: {shifts: true}
				}
			}
		});
		return events;
	}),
	getEventsByLocationId: managerProcedure.input(z.object({})).query(({ctx, input}) => {
	
	})
})