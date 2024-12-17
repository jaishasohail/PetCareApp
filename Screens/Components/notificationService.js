import * as Notifications from 'expo-notifications';

export async function scheduleNotification(title, time) {
  const timeParts = time.split(':');
  const [hour, minute] = timeParts[0].split(':').map((val) => parseInt(val, 10));
  const amPm = timeParts[1].trim().toUpperCase();

  let notificationHour = hour;
  if (amPm === 'PM' && hour < 12) {
    notificationHour += 12; // Convert PM to 24-hour time
  } else if (amPm === 'AM' && hour === 12) {
    notificationHour = 0; // Midnight case
  }

  const notificationTime = new Date();
  notificationTime.setHours(notificationHour);
  notificationTime.setMinutes(minute);
  notificationTime.setSeconds(0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: `${title} time for your pet!`,
      sound: true,
    },
    trigger: notificationTime,
  });

  console.log(`${title} scheduled for ${notificationTime}`);
}
