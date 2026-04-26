import {cache} from "react";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import prisma from "@/lib/prisma";
import {redirect, notFound} from "next/navigation";


export const getActiveOrg = cache(async (slug: string) => {
	
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	
	if (!session) {
		redirect("/sign-in");
	}
	
	
	const organization = await prisma.organization.findUnique({
		where: {
			slug: slug,
			members: {
				some: {
					userId: session.user.id
				}
			}
		},
		select: {
			id: true,
			name: true,
			slug: true,
			logo: true,
		}
	});
	
	
	if (!organization) {
		notFound();
	}
	
	return {
		organization,
		user: session.user,
	};
});