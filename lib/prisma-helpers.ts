import prisma from "@/lib/prisma";
import {TRPCError} from "@trpc/server";

export const checkForOwnershipOfOrganization = async (orgId: string, userId: string) => {
	const membership = await prisma.member.findFirst({
		where: {
			organizationId: orgId,
			userId: userId,
			role: 'owner'
		}
	})
	if (!membership) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not an owner of this organization",
		});
	}
	
}