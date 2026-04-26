import {locationsRouter} from "@/trpc/routers/Infrastructure/locations";
import {eventsRouter} from "@/trpc/routers/operations/events";
import {createTRPCRouter} from '../init';

export const appRouter = createTRPCRouter({
	locations: locationsRouter,
	events: eventsRouter
});

export type AppRouter = typeof appRouter;