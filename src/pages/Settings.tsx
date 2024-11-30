import React, { useState } from "react";
import { Trash2, Bell, Send } from "lucide-react";
import { progressApi } from "../api/progressApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNotifications } from "../hooks/useNotifications";

export default function Settings() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { checkNotificationPermission } = useNotifications();
	const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
		return localStorage.getItem("notificationsEnabled") === "true";
	});

	const handleNotificationToggle = async () => {
		try {
			await checkNotificationPermission();

			if (Notification.permission === "granted") {
				const newState = !notificationsEnabled;
				setNotificationsEnabled(newState);
				localStorage.setItem("notificationsEnabled", String(newState));

				if (newState) {
					navigator.serviceWorker.ready.then((registration) => {
						registration.active?.postMessage("START_NOTIFICATIONS");
						toast.success("Daily reminders enabled for 6 PM");
					});
				}
			}
		} catch (error) {
			console.error("Error toggling notifications:", { error });
			toast.error("Failed to toggle notifications");
		}
	};

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

	const handleTestNotification = async () => {
		try {
			if (Notification.permission === "granted") {
				new Notification("Test Notification", {
					body: "This is a test notification for Daily Progress Tracker",
					icon: "/favicon.ico",
				});
				toast.success("Test notification sent");
			} else {
				toast.error("Please enable notifications first");
			}
		} catch (error) {
			console.error("Error sending test notification:", { error });
			toast.error("Failed to send test notification");
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-8">Settings</h1>

			{/* Notification Settings */}
			<div className="bg-white rounded-xl shadow-xl p-6">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1">
						<h2 className="text-lg font-semibold text-gray-900">Daily Reminder</h2>
						<p className="text-sm text-gray-500">Get notified at 6 PM daily to fill your progress form</p>
					</div>
					<div className="flex items-center gap-2">
						<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleTestNotification} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200" title="Send test notification">
							<Send className="w-5 h-5" />
							<span>Test</span>
						</motion.button>
						<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNotificationToggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${notificationsEnabled ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"}`}>
							<Bell className="w-5 h-5" />
							<span>{notificationsEnabled ? "Enabled" : "Disabled"}</span>
						</motion.button>
					</div>
				</div>
			</div>

			{/* Delete All Progress */}
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
