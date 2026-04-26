import {RouterOutput} from "@/trpc/init";
import {create} from "zustand/react";

type ModalType = "addLocation" | "deleteLocation" | "editLocation" | 'editEvent' | 'deleteEvent' | 'addEvent';
type Location = RouterOutput["locations"]["getAllLocations"][number];
type Event = RouterOutput["events"]["getAllEvents"][number];


interface ModalData {
	location?: Location;
	Event?: Event;
	apiUrl?: string;
}

interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({isOpen: true, type, data}),
	onClose: () => set({isOpen: false, type: null}),
}));