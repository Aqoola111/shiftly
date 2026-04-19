import prisma from "@/lib/prisma";
import {cache} from "react";

export const getOrganizationBySlug = cache(async (slug: string) => {
	return await prisma.organization.findUnique({
		where: {slug},
	});
});