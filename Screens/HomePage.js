import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,Alert } from 'react-native';
import { Video } from 'expo-av';

export default function SignUpPage({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSignUp = async () => {
    console.log("Sign Up Button Pressed");
    
    if (!name || !email || !password) {
      Alert.alert('Input Required', 'Please fill in all the fields before proceeding.');
      return;
    }
  
    try {
      // Replace with your backend API endpoint
      const response = await fetch('http://192.168.1.76:5000/api/signUP-1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 409) {
        // Assuming 409 is returned for conflicts (username or email taken)
        Alert.alert('Error', data.message || 'Username or email is already taken.');
      } else if (response.status === 201) {
        // Assuming 201 is returned for successful signup
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Profile Page', { name, email, password });
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while signing up. Please try again later.');
    }
  };
  const LoginNav=()=>{
    navigation.navigate("LoginPage")
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
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={{color: '#fff',}}>Already have an account?</Text>
        <TouchableOpacity onPress={LoginNav}>
          <Text style={styles.loginText}>Login</Text>
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
  signUpButton: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  
});
