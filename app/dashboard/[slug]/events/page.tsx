import EventsClientPage from "@/features/events/components/events-client-page";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import React from 'react'

const Page = () => {
	const queryClient = getQueryClient()
	void queryClient.prefetchQuery(
		trpc.events.getAllEvents.queryOptions()
	)
	void queryClient.prefetchQuery(
		trpc.locations.getAllLocations.queryOptions()
	)
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EventsClientPage/>
		</HydrationBoundary>
	)
}
export default Page
