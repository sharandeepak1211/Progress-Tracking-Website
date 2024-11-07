import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { progressApi } from "../api/progressApi";
import toast from "react-hot-toast";

export default function Settings() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDeleteAll = async () => {
		try {
			setIsDeleting(true);
			await progressApi.deleteAllProgress();
			setIsDialogOpen(false);
			toast.success("All progress data has been deleted");
		} catch (error) {
			toast.error("Failed to delete progress data");
			throw new Error(`Failed to delete progress data: ${error}`);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8">Settings</h1>

			<div className="bg-white rounded-xl shadow-xl p-6">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1">
						<h2 className="text-lg font-semibold text-gray-900">Delete All Progress</h2>
						<p className="text-sm text-gray-500">This will permanently delete all your progress entries. This action cannot be undone.</p>
					</div>
					<button onClick={() => setIsDialogOpen(true)} className="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap">
						<Trash2 className="w-4 h-4" />
						Delete All
					</button>
				</div>
			</div>

			{/* Confirmation Dialog */}
			{isDialogOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl p-6 max-w-md w-full">
						<h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
						<p className="text-gray-600 mb-6">Are you sure you want to delete all your progress data? This action cannot be undone.</p>
						<div className="flex justify-end gap-4">
							<button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200" disabled={isDeleting}>
								Cancel
							</button>
							<button onClick={handleDeleteAll} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50">
								{isDeleting ? "Deleting..." : "Yes, Delete All"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
