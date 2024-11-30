import { useEffect } from "react";

export const useNotifications = () => {
	const checkNotificationPermission = async () => {
		try {
			if (!("Notification" in window)) {
				console.log("This browser does not support notifications");
				return;
			}

			if (Notification.permission !== "granted") {
				await Notification.requestPermission();
			}
		} catch (error) {
			console.error("Error checking notification permission:", { error });
		}
	};

	const scheduleNotification = () => {
		try {
			const now = new Date();
			const scheduledTime = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				18, // 6 PM
				0,
				0
			);

			// If it's past 6 PM, schedule for next day
			if (now > scheduledTime) {
				scheduledTime.setDate(scheduledTime.getDate() + 1);
			}

			const timeUntilNotification = scheduledTime.getTime() - now.getTime();

			setTimeout(() => {
				if (Notification.permission === "granted") {
					new Notification("Daily Progress Reminder", {
						body: "Don't forget to fill your daily progress form!",
						icon: "/favicon.ico", // Add your favicon path
					});
					// Schedule next day's notification
					scheduleNotification();
				}
			}, timeUntilNotification);
		} catch (error) {
			console.error("Error scheduling notification:", { error });
		}
	};

	useEffect(() => {
		checkNotificationPermission();
		scheduleNotification();
	}, []);

	return { checkNotificationPermission };
};
