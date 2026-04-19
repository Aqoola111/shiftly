import {Toaster} from "@/components/ui/sonner";
import {TRPCReactProvider} from "@/trpc/client";
import {ReactNode} from "react";

type Props = {
	children: ReactNode;
};

const MainProvider = ({children}: Props) => {
	return (
		<TRPCReactProvider>
			{children}
		</TRPCReactProvider>
	);
};

export default MainProvider;
