import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { Video } from 'expo-av';

export default function ProfilePage({ navigation,route }) {
  const {name ,email , password}=route.params;
  const [Rname, setRName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleDateConfirm = (date) => {
    setDob(date.toLocaleDateString());  
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleLogout = () => {
    navigation.navigate('LoginPage');
  };
  const onSave=()=>{
    console.log(name ,email , password);
    navigation.navigate("Pet Details",{name,email,password,Rname,phone,dob});
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/vid-1.mp4')}
        style={StyleSheet.absoluteFill}
        shouldPlay
        isLooping
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Profile Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={Rname}
          onChangeText={setRName}
        />
         <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text style={styles.inputText}>{dob ? dob : 'Select DOB'}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        

        <TouchableOpacity style={styles.saveButton} onPress={onSave} >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: "70%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius:20,
    margin:"auto",
    width:"80%",
    padding:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  saveButton: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#fff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  inputText:{
    marginTop:10,
    color:"rgba(0, 0, 0, 0.5)"
  }
});
