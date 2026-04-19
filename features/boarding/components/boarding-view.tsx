'use client'
import {Button} from "@/components/ui/button";
import CreateOrganizationForm from "@/features/boarding/components/create-organization-form";
import CreateStaffMemberForm from "@/features/boarding/components/create-staff-member-form";
import {ArrowLeft} from "lucide-react";
import {useState} from 'react'

const BoardingView = () => {
	const [view, setView] = useState<'OWNER' | 'STAFF' | null>(null);
	return (
		<div
			className='min-h-screen h-screen w-screen flex bg-linear-60 from-primary/80 to-primary items-center justify-center '>
			{view === null &&
                <div className='flex flex-col gap-10  rounded-2xl'>
                    <h1 className='font-bold text-4xl uppercase'>
                        I am here to
                    </h1>
                    <div className='flex gap-10'>
                        <Button variant='outline' className='w-40 h-10 rounded-md' onClick={() => setView('STAFF')}>
                            Find shifts
                        </Button>
                        <Button className='w-40 h-10 rounded-md' onClick={() => setView('OWNER')}>
                            Hire staff
                        </Button>
                    </div>
                </div>
			}
			{view === 'OWNER' && <div className='flex h-full w-full items-center justify-center flex-col gap-10'>
                <Button variant='ghost' onClick={() => setView(null)}>
                    <ArrowLeft/> Back
                </Button>
                <CreateOrganizationForm/>
            </div>}
			{view === 'STAFF' && <div className='flex h-full w-full items-center justify-center flex-col gap-10 '>
                <Button variant='ghost' onClick={() => setView(null)}>
                    <ArrowLeft/> Back
                </Button>
                <CreateStaffMemberForm/>
            </div>}
		
		</div>
	)
}
export default BoardingView
