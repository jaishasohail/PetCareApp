import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,Alert } from 'react-native';

export default function PetDetailForm({ onCompletedForm ,Petform}) {
  const [PetName, setPetName] = useState('');
  const [PetAge, setPetAge] = useState('');

  useEffect(() => {
    if (PetName !== '' && PetAge !== ''){
        onCompletedForm(true);
        Petform({ PetName, PetAge });
    }
    
  }, [PetAge,PetName]);
 
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Pet Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Pet name"
          value={PetName}
          onChangeText={setPetName}
        />

        <TextInput
          style={styles.input}
          placeholder="Pet age"
          value={PetAge}
          onChangeText={setPetAge}
          keyboardType="phone-pad"
        />
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
