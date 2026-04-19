import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {TRPCReactProvider} from "@/trpc/client";
import {ReactNode} from "react";

type Props = {
	children: ReactNode;
};

const MainProvider = ({children}: Props) => {
	return (
		<TRPCReactProvider>
			<TooltipProvider>
				{children}
			</TooltipProvider>
		</TRPCReactProvider>
	);
};

export default MainProvider;
