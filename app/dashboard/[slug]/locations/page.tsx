import LocationsClientPage from "@/features/locations/components/locations-client-page";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

const Page = async () => {
	const queryClient = getQueryClient()
	void queryClient.prefetchQuery(
		trpc.locations.getAllLocations.queryOptions()
	)
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<LocationsClientPage/>
		</HydrationBoundary>
	)
}
export default Page
