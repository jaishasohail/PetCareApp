import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  } else {
    alert('Must use a physical device for Push Notifications');
  }
};

const Notif = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [feedingTime, setFeedingTime] = useState(null);
  const [exerciseTime, setExerciseTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // "feeding" or "exercise"

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const scheduleNotification = async (title, body, time) => {
    if (!time) {
      alert('Please select a time first.');
      return;
    }

    const trigger = new Date(time);
    if (trigger < new Date()) {
      alert('Scheduled time must be in the future.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: require("./Pets/dog.mp3"),
      },
      trigger,
    });

    alert(`Notification scheduled for ${trigger.toLocaleTimeString()}`);
  };

  const handleConfirm = (selectedTime) => {
    if (activePicker === 'feeding') {
      setFeedingTime(selectedTime);
    } else if (activePicker === 'exercise') {
      setExerciseTime(selectedTime);
    }
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feeding and Exercise Scheduler</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Feeding Time:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => {
            setActivePicker('feeding');
            setTimePickerVisible(true);
          }}
        >
          <Text style={styles.timeText}>
            {feedingTime ? feedingTime.toLocaleTimeString() : 'Set Feeding Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            scheduleNotification('Feeding Reminder', 'Time to feed your pet!', feedingTime)
          }
        >
          <Text style={styles.buttonText}>Set Feeding Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Exercise Time:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => {
            setActivePicker('exercise');
            setTimePickerVisible(true);
          }}
        >
          <Text style={styles.timeText}>
            {exerciseTime ? exerciseTime.toLocaleTimeString() : 'Set Exercise Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            scheduleNotification('Exercise Reminder', 'Time to exercise your pet!', exerciseTime)
          }
        >
          <Text style={styles.buttonText}>Set Exercise Reminder</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  timeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Notif;
