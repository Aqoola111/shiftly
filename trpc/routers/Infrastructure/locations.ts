import {createLocationSchema} from "@/features/locations/schemas";
import prisma from "@/lib/prisma";
import {checkForOwnershipOfOrganization} from "@/lib/prisma-helpers";
import {createTRPCRouter, organizationOwnerProcedure, protectedProcedure, RouterOutput} from "@/trpc/init";
import {TRPCError} from "@trpc/server";
import {z} from "zod";


export const locationsRouter = createTRPCRouter({
	getAllLocations: organizationOwnerProcedure.query(async ({ctx}) => {
		
		return prisma.location.findMany({
			where: {
				organizationId: ctx.auth.session.activeOrganizationId || ''
			},
			orderBy: {
				name: 'asc'
			}
		});
	}),
	addLocation: organizationOwnerProcedure.input(createLocationSchema).mutation(async ({ctx, input}) => {
		
		const location = prisma.location.create({
			data: {
				name: input.name,
				address: input.address,
				instructions: input.instructions,
				organizationId: ctx.orgId
			}
		})
		if (!location) throw new TRPCError({
			message: 'Failed to create location',
			code: 'BAD_REQUEST'
		})
		
		return location
	}),
	updateLocation: organizationOwnerProcedure.input(createLocationSchema.partial().extend({
		locationId: z.string()
	})).mutation(async ({ctx, input}) => {
		
		return prisma.location.update({
			where: {
				organizationId: ctx.orgId,
				id: input.locationId
			}, data: {
				name: input.name,
				address: input.address,
				instructions: input.instructions
			}
		});
	}),
	deleteLocation: organizationOwnerProcedure.input(z.object({
		locationId: z.string()
	})).mutation(async ({ctx, input}) => {
		return prisma.location.delete({
			where: {
				id: input.locationId,
				organizationId: ctx.orgId,
			}
		});
		
	})
})

export type LocationTrpc = RouterOutput["locations"]["getAllLocations"][number]