import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user,setUser]=useState({});
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    console.log(user);
    console.log("hello");
    console.log(user.pets);
    if (user && user.pets && user.pets.length > 0) {
      navigation.navigate('MainScreen', { user });
    }


  }, [user]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    return () => unsubscribe();
  }, []);


  const handleLogin = async () => {
    
    if (isOnline) {
    try {
      const response = await fetch('http://192.168.1.39:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) { 
        const data = await response.json();
        setMessage(data.message);
        console.log(data.message);
        setUser(data.user);
        
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  }
  else{
    try {
      
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
  
      const user1 = parsedUsers.find((user) => user.email === email);
  
      if (user1) {
        console.log('User found:', user1);
        setUser(user1);

        return user1;
      } else {
        console.log('User not found');
        return null; 
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null; 
    }
  }
  };
  
  const SignUpNav =()=>{
    navigation.navigate("Home Page");
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/vid-5.mp4')}
        style={StyleSheet.absoluteFill}
        shouldPlay
        isLooping
        resizeMode="cover"
        />
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>

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

        <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
          <Text style={styles.signUpButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={{color: '#fff',}}>Don't have an account?</Text>
        <TouchableOpacity onPress={SignUpNav}>
          <Text style={styles.loginText}>Sign Up</Text>
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
