import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, ActivityIndicator,ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { UserContext } from '../Context/UserContext';

const MedicalScreen = () => {
  const { user } = useContext(UserContext);

  const [vaccinationTime, setVaccinationTime] = useState(null);
  const [medicationStartTime, setMedicationStartTime] = useState(null);
  const [medicationEndTime, setMedicationEndTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [vaccineName, setVaccineName] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activePicker, setActivePicker] = useState('vaccination');
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch Vaccination and Medication History
  const fetchVaccinationHistory = async () => {
    try {
      const response = await fetch(`http://192.168.1.76:5000/api/vaccination/${user.id}/${user.pets.id}`);
      const data = await response.json();
    console.log('Vaccination Data:', data);  // Add this line to log the response data
    const { vaccinationRecords } = data;
    setVaccinationHistory(vaccinationRecords);
    } catch (error) {
      console.error('Error fetching vaccination history:', error);
    }
  };

  const fetchMedicationHistory = async () => {
    try {
      const response = await fetch(`http://192.168.1.76:5000/api/medication/${user.id}/${user.pets.id}`);
      const data = await response.json();
    console.log('Medication Data:', data);  // Log the response for debugging
    const { medicationRecords } = data;
    setMedicationHistory(medicationRecords);
    } catch (error) {
      console.error('Error fetching medication history:', error);
    }
  };

  const scheduleNotification = async (time, type) => {
    const trigger = new Date(time);
    if (trigger < new Date()) {
      alert('Scheduled time must be in the future.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${type} Reminder`,
        body: `It's time for your pet's ${type.toLowerCase()}!`,
        sound: "default", // Add sound file path
      },
      trigger,
    });

    alert(`${type} reminder scheduled for ${trigger.toLocaleTimeString()}`);
  };

  const handleConfirm = (selectedTime) => {
    if (activePicker === 'vaccination') {
      setVaccinationTime(selectedTime);
    } else if (activePicker === 'medicationStart') {
      setMedicationStartTime(selectedTime);
    } else if (activePicker === 'medicationEnd') {
      setMedicationEndTime(selectedTime);
    }
    setTimePickerVisible(false);
  };

  const handleSaveVaccinationReminder = async () => {
    if (!vaccineName || !vaccinationTime) {
      alert('Please provide vaccine name and time.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.76:5000/api/vaccination/${user.id}/${user.pets.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaccineName,
          date: vaccinationTime.toLocaleDateString(),
          time: vaccinationTime.toLocaleTimeString(),
        }),
      });
      const result = await response.json();
      alert(result.message);

      // Set reminder notification
      await scheduleNotification(vaccinationTime, 'Vaccination');

      // Fetch updated history
      fetchVaccinationHistory();
    } catch (error) {
      console.error('Error saving vaccination reminder:', error);
    }
  };

  const handleSaveMedicationLog = async () => {
    if (!medicationName || !dosage || !medicationStartTime || !medicationEndTime) {
      alert('Please fill all medication details.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.76:5000/api/medication/${user.id}/${user.pets.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName,
          dosage,
          startDate: medicationStartTime.toLocaleDateString(),
          endDate: medicationEndTime.toLocaleDateString(),
        }),
      });
      const result = await response.json();
      alert(result.message);

      // Set medication reminder notifications
      await scheduleNotification(medicationStartTime, 'Medication');
      await scheduleNotification(medicationEndTime, 'Medication');

      // Fetch updated history
      fetchMedicationHistory();
    } catch (error) {
      console.error('Error saving medication log:', error);
    }
  };

  useEffect(() => {
    fetchVaccinationHistory();
    fetchMedicationHistory();
    setLoading(false); // Set loading to false after data is fetched
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.container}>
        <Text style={styles.title}>Vaccination and Medication Reminder</Text>
  
        {/* Vaccination Section */}
        <TextInput
          style={styles.input}
          placeholder="Enter Vaccine Name"
          value={vaccineName}
          onChangeText={setVaccineName}
        />
        <TouchableOpacity style={styles.button} onPress={() => { setActivePicker('vaccination'); setTimePickerVisible(true); }}>
          <Text style={styles.buttonText}>
            {vaccinationTime ? vaccinationTime.toLocaleTimeString() : 'Set Vaccination Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSaveVaccinationReminder}>
          <Text style={styles.buttonText}>Save Vaccination Reminder</Text>
        </TouchableOpacity>
  
        {/* Medication Section */}
        <TextInput
          style={styles.input}
          placeholder="Enter Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Dosage"
          value={dosage}
          onChangeText={setDosage}
        />
        <TouchableOpacity style={styles.button} onPress={() => { setActivePicker('medicationStart'); setTimePickerVisible(true); }}>
          <Text style={styles.buttonText}>
            {medicationStartTime ? medicationStartTime.toLocaleTimeString() : 'Set Medication Start Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setActivePicker('medicationEnd'); setTimePickerVisible(true); }}>
          <Text style={styles.buttonText}>
            {medicationEndTime ? medicationEndTime.toLocaleTimeString() : 'Set Medication End Time'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSaveMedicationLog}>
          <Text style={styles.buttonText}>Save Medication Log</Text>
        </TouchableOpacity>
  
        {/* Vaccination History */}
        <FlatList
          data={vaccinationHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>{item.vaccineName}</Text>
              <Text>{item.date} at {item.time}</Text>
            </View>
          )}
          ListHeaderComponent={<Text style={styles.historyHeader}>Vaccination History</Text>}
        />
  
        {/* Medication History */}
        <FlatList
          data={medicationHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>{item.medicationName}</Text>
              <Text>{item.startDate} - {item.endDate}</Text>
              <Text>Dosage: {item.dosage}</Text>
            </View>
          )}
          ListHeaderComponent={<Text style={styles.historyHeader}>Medication History</Text>}
        />
  
        {/* DateTime Picker */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setTimePickerVisible(false)}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});

export default MedicalScreen;
