import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PetPage from './Components/PetPage';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomStepper from './CustomStepper';
import { Video } from 'expo-av';
import PetBreed from './Components/PetBreed';
import PetDetailForm from './Components/PetDetailForm';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PetDetails({ navigation ,route}) {
  const {name,email,password,Rname,phone,dob}=route.params;
  const steps = ['Choose Pet', 'Pet Details', 'Review & Save'];
  const [canProceed, setCanProceed] = useState([false, false, false]);
  const [selectedType, setSelectedType] = useState(null);
  const [Petbreed,setPetbreed]=useState(null);
  const [Form,setForm]=useState({});
  const [message, setMessage] = useState('');


  const updateCanProceed = (index, value) => {
    const updatedCanProceed = [...canProceed];
    updatedCanProceed[index] = value;
    setCanProceed(updatedCanProceed);
  };

  const stepContent = [
    <PetPage
      onSelection={(value) => updateCanProceed(0, value)} 
      PetType={(type) => setSelectedType(type)} 
    />,
    <PetBreed petType={selectedType} onSelectBreed={(value)=> updateCanProceed(1,value)} petBreeds={(value)=>setPetbreed(value)}/>,
    <PetDetailForm
    onCompletedForm={(value) => updateCanProceed(2, value)}
    Petform={(formData) => {
      setForm((prevState) => ({
        ...prevState,
        ...formData,
      }));}}
  />,
  ];

  const handleComplete = async() => {
    console.log(name);
    const newUser = {
      name,
      email,
      password,
      Rname,
      phone,
      dob,
      selectedType,      
      Petbreed,          
      pets: [            
        {
          breed: Petbreed,
          type: selectedType,
          details: Form, 
        },
      ],
    };
    const existingUsers = await AsyncStorage.getItem('users');
    const users = existingUsers ? JSON.parse(existingUsers) : [];

    
    users.push(newUser);

  
    await AsyncStorage.setItem('users', JSON.stringify(users));

    console.log('User saved successfully with pets:', newUser);
    await fetch('http://192.168.1.39:5000/api/signUP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name,email,password,Rname,phone,dob,selectedType,Petbreed,...Form }),
  })
    .then((response) => response.json())
    .then((data) =>{
      setMessage(data.message);
      console.log(message);
      console.log('Stepper Complete');
      navigation.navigate("LoginPage");
    } )
    .catch((error) => setMessage('Error: ' + error.message));
    
    
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/vid-6.mp4')}
        style={StyleSheet.absoluteFill}
        shouldPlay
        isLooping
        resizeMode="cover"
      />
      <CustomStepper
        steps={steps}
        stepContent={stepContent}
        canProceed={canProceed}
        onComplete={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
