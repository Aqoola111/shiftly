import {
	LayoutDashboard,
	Calendar,
	UserCheck,
	Users,
	UserPlus,
	History,
	MapPin,
	ShieldCheck,
	CreditCard,
	BarChart3,
	Settings,
	Briefcase,
	UserRoundSearch,
	Building,
	BarChartHorizontal
} from "lucide-react";

export const sidebarNavigation = [
	{
		title: "Operations",
		icon: Briefcase,
		items: [
			{
				title: "Dashboard",
				href: "/overview",
				icon: LayoutDashboard,
			},
			{
				title: "Events Calendar",
				href: "/events",
				icon: Calendar,
			},
			{
				title: "Placement",
				href: "/placement",
				icon: UserCheck,
			},
		],
	},
	{
		title: "Talent Management",
		icon: UserRoundSearch,
		items: [
			{
				title: "Staff Directory",
				href: "/staff",
				icon: Users,
			},
			{
				title: "Applications",
				href: "/applications",
				icon: UserPlus,
			},
			{
				title: "Attendance Logs",
				href: "/attendance",
				icon: History,
			},
		],
	},
	{
		title: "Infrastructure",
		icon: Building,
		items: [
			{
				title: "Locations",
				href: "/locations",
				icon: MapPin,
			},
			{
				title: "Managers",
				href: "/managers",
				icon: ShieldCheck,
			},
		],
	},
	{
		title: "Admin & Finance",
		icon: BarChartHorizontal,
		items: [
			{
				title: "Payroll",
				href: "/payroll",
				icon: CreditCard,
			},
			{
				title: "Analytics",
				href: "/analytics",
				icon: BarChart3,
			},
			{
				title: "Settings",
				href: "/settings",
				icon: Settings,
			},
		],
	},
];