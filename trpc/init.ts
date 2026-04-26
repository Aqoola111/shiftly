import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {AppRouter} from "@/trpc/routers/_app";
import {inferRouterOutputs, initTRPC, TRPCError} from '@trpc/server';
import {headers} from "next/headers";
import {cache} from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
});

const t = initTRPC.create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ctx, next}) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	
	if (!session) {
		throw new TRPCError(({
			code: 'UNAUTHORIZED',
			message: 'Unauthorized',
		}))
	}
	
	return next({
		ctx: {
			...ctx,
			auth: session,
		}
	});
	
})

export const managerProcedure = protectedProcedure.use(async ({ctx, next}) => {
	const orgId = ctx.auth.session.activeOrganizationId
	
	if (!orgId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'No organization id found. You are nor a part of any orhanization.',
		})
	}
	
	const membership = await prisma.member.findFirst({
		where: {
			organizationId: orgId,
			userId: ctx.auth.user.id,
			role: {
				in: ['owner', 'manager']
			}
		}
	})
	
	if (!membership) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not a manager or owner of this organization",
		});
	}
	
	return next({
		ctx: {
			...ctx,
			orgId: orgId,
		}
	})
})

export const organizationOwnerProcedure = protectedProcedure.use(async ({ctx, next}) => {
	const orgId = ctx.auth.session.activeOrganizationId
	
	if (!orgId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'No organization id found.',
		})
	}
	
	const membership = await prisma.member.findFirst({
		where: {
			organizationId: orgId,
			userId: ctx.auth.user.id,
			role: 'owner'
		}
	})
	
	if (!membership) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not an owner of this organization",
		});
	}
	
	return next({
		ctx: {
			...ctx,
			orgId: orgId,
		}
	})
})

export type RouterOutput = inferRouterOutputs<AppRouter>;

