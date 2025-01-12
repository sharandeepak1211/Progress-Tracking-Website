import React from "react";
import ProgressIcon from "./ProgressIcon";

const Header: React.FC = () => {
	try {
		return (
			<header className="flex items-center gap-2 p-4">
				<ProgressIcon width={24} height={24} />
				<h1 className="text-xl font-bold">Progress Tracker</h1>
			</header>
		);
	} catch (error) {
		console.error({ error: "Error rendering Header", details: error });
		throw new Error("Failed to render Header");
	}
};

export default Header;
