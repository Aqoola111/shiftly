import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList, BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {ReactNode} from "react";

type Props = { children: ReactNode, params: Promise<{ slug: string }> }

const Layout = async ({children, params}: Props) => {
	const {slug} = await params
	const session = await auth.api.getSession({
		headers: await headers()
	});
	
	if (!session) {
		redirect('/sign-in')
	}
	
	const organization = await prisma.organization.findUnique({
		where: {
			slug: slug
		}
	})
	
	if (!organization) {
		notFound();
	}
	
	return (
		<SidebarProvider>
			<DashboardSidebar orgName={organization.name}/>
			<SidebarInset>
				<header
					className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1"/>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
export default Layout;
