self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

const scheduleNotification = () => {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    18, // 6 PM
    0,
    0
  );

  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    self.registration.showNotification('Daily Progress Reminder', {
      body: "Don't forget to fill your daily progress form!",
      icon: '/favicon.ico',
      requireInteraction: true,
      tag: 'daily-reminder'
    });
    scheduleNotification(); // Schedule next notification
  }, timeUntilNotification);
};

self.addEventListener('message', (event) => {
  if (event.data === 'START_NOTIFICATIONS') {
    scheduleNotification();
  }
}); 