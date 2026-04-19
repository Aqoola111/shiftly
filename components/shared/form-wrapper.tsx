import {Dialog} from "@/components/ui/dialog";

type Props = {
	title: string;
	description: string;
	onSuccess?: () => void;
	onError?: () => void;
	children?: React.ReactNode;
};

const FormWrapper = ({title, onSuccess, onError, description, children}: Props) => {
	return (
		<>
			<div className='md:block hidden'>
				<Dialog>
				
				</Dialog>
			</div>
			
			<div className='md:hidden block'>
			
			</div>
		
		</>
	);
};
export default FormWrapper;
