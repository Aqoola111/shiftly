'use client'

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarGroup
} from "@/components/ui/sidebar";
import {sidebarNavigation} from "@/features/dashboard/constants";
import {ChevronRight} from "lucide-react";
import React from 'react'
import Link from "next/link";
import {useParams} from "next/navigation";

interface DashboardSidebarProps {
	orgName: string;
}

const DashboardSidebar = ({orgName}: DashboardSidebarProps) => {
	const params = useParams();
	const slug = params.slug as string;
	
	return (
		<Sidebar collapsible='icon'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" className="font-headline uppercase italic font-black text-primary">
							<div
								className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">
								{orgName.charAt(0)}
							</div>
							<span className="truncate">{orgName}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{sidebarNavigation.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarMenu>
							<Collapsible
								asChild
								defaultOpen={true}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={group.title}>
											{group.icon && <group.icon className="size-4"/>}
											<span className="font-bold uppercase tracking-widest text-xs">
                                        {group.title}
                                     </span>
											<ChevronRight
												className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{group.items.map((item) => (
												<SidebarMenuSubItem key={item.title}>
													<SidebarMenuSubButton asChild>
														<Link href={`/dashboard/${slug}${item.href}`}
															  className="flex items-center gap-3">
															{item.icon && <item.icon className="size-4"/>}
															<span>{item.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter/>
		</Sidebar>
	)
}

export default DashboardSidebar;