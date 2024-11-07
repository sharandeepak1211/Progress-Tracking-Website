import React from "react";
import { BarChart2, BookMarked, List, Settings, Tags } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
	const location = useLocation();

	const navItems = [
		{ path: "/", icon: BookMarked, label: "Track" },
		{ path: "/trends", icon: BarChart2, label: "Trends" },
		{ path: "/history", icon: List, label: "History" },
		{ path: "/tags", icon: Tags, label: "Tags" },
		{ path: "/settings", icon: Settings, label: "Settings" },
	];

	return (
		<nav className="bg-white shadow-lg mb-8">
			<div className="container mx-auto px-4">
				<div className="flex justify-center space-x-8">
					{navItems.map(({ path, icon: Icon, label }) => (
						<Link key={path} to={path} className={`flex items-center space-x-2 py-4 px-4 border-b-2 transition-colors ${location.pathname === path ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-600 hover:text-indigo-600"}`}>
							<Icon className="w-5 h-5" />
							<span>{label}</span>
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
