import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { scheduleNotification } from './Components/notificationService';
import '@react-native-firebase/app';  // We'll create this function later

export default function PetSchedulerScreen() {
  const [feedingTime, setFeedingTime] = useState('');
  const [exerciseTime, setExerciseTime] = useState('');

  useEffect(() => {
    async function registerForPushNotifications() {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            alert('Failed to get push token for notifications!');
            return;
          }
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
      } else {
        alert('Must use a physical device for Push Notifications');
      }
    }

    registerForPushNotifications();
  }, []);

  const handleSchedule = async () => {
    if (feedingTime) {
      await scheduleNotification('Feeding Reminder', feedingTime);
    }
    if (exerciseTime) {
      await scheduleNotification('Exercise Reminder', exerciseTime);
    }
  };

  const handleFeedingTimeChange = (time) => setFeedingTime(time);
  const handleExerciseTimeChange = (time) => setExerciseTime(time);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Scheduler</Text>
      <Text style={styles.label}>Set Feeding Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={feedingTime}
        onChangeText={handleFeedingTimeChange}
      />
      <Text style={styles.label}>Set Exercise Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={exerciseTime}
        onChangeText={handleExerciseTimeChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>Set Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
