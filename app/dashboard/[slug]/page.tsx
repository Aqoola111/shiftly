import {getOrganizationBySlug} from "@/lib/get-org";

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
	const {slug} = await params;
	const org = await getOrganizationBySlug(slug);
	
	if (!org) return null;
	
	return (
		<div className=''>
			<div>
			
			</div>
		</div>
	);
}