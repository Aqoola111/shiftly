'use client'

import React from 'react'
import {RouterOutput} from "@/trpc/init"
import {useModal} from "@/store/use-modal-store"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {
	Calendar,
	Clock,
	MapPin,
	Edit,
	Trash,
	Users,
	ChevronRight
} from 'lucide-react'
import {format} from "date-fns"

type Props = {
	event: RouterOutput["events"]['getAllEvents'][number]
}

const EventCard = ({event}: Props) => {
	const {onOpen} = useModal()
	
	const eventDate = format(new Date(event.date), "PPP")
	const eventStartTime = event.startTime ? format(new Date(event.startTime), "p") : null
	const eventEndTime = event.endTime ? format(new Date(event.endTime), "p") : null
	
	return (
		<Card className="group overflow-hidden transition-all hover:shadow-md border-muted-foreground/20">
			<CardHeader className="pb-3 bg-primary/5 group-hover:bg-primary/10 transition-colors">
				<div className="flex items-center justify-between gap-2">
					<div className="space-y-1 shrink overflow-hidden">
						<CardTitle className="text-lg font-bold truncate tracking-tight">
							{event.title}
						</CardTitle>
						<div
							className="flex items-center gap-1 text-primary font-medium text-xs uppercase tracking-wider">
							<MapPin className="size-3"/>
							<span className="truncate">{event.location.name}</span>
						</div>
					</div>
					<Badge variant="outline"
						   className="bg-background font-bold text-[10px] uppercase italic tracking-widest border-primary/30">
						Event
					</Badge>
				</div>
			</CardHeader>
			
			<CardContent className="pt-4 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Calendar className="size-3.5"/>
							<span className="text-xs font-semibold uppercase tracking-tight">Date</span>
						</div>
						<p className="text-sm font-medium">{eventDate}</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Clock className="size-3.5"/>
							<span className="text-xs font-semibold uppercase tracking-tight">Starts at</span>
						</div>
						<p className="text-sm font-medium">{eventStartTime}</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Clock className="size-3.5"/>
							<span className="text-xs font-semibold uppercase tracking-tight">Ends at</span>
						</div>
						<p className="text-sm font-medium">{eventEndTime}</p>
					</div>
				</div>
				
				{event.description && (
					<p className="text-sm text-muted-foreground line-clamp-2 border-l-2 border-muted pl-3 italic">
						{event.description}
					</p>
				)}
				
				<div className="flex items-center justify-between pt-2 border-t border-dashed">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Users className="size-4"/>
						<span className="text-xs font-medium">
                            {event._count?.shifts || 0} Shifts assigned
                        </span>
					</div>
					<Button variant="ghost" size="sm"
							className="h-8 gap-1 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5">
						Manage Shifts <ChevronRight className="size-3"/>
					</Button>
				</div>
			</CardContent>
			
			<CardFooter className="justify-end gap-2 bg-muted/20 py-3">
				<Button
					size="icon"
					variant="outline"
					className="size-8 transition-colors hover:border-primary/50"
					onClick={() => onOpen('editEvent', event)}
				>
					<Edit className="size-3.5"/>
				</Button>
				<Button
					size="icon"
					variant="outline"
					className="size-8 text-destructive hover:bg-destructive/5 hover:border-destructive/30"
					onClick={() => onOpen('deleteEvent', event)}
				>
					<Trash className="size-3.5"/>
				</Button>
			</CardFooter>
		</Card>
	)
}

export default EventCard