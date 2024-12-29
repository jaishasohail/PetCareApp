import React, { useState } from 'react';
import { View, Button, Text, FlatList, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const getWeatherData = async (city) => {
  const apiKey = '48f7d6748b7482cae7d36a5854083911';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.main && data.main.temp) {
      return data.main.temp;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchCities = async () => {
  const cities = ['London', 'Paris', 'New York', 'Tokyo', 'Berlin', 'Sydney', 'Mumbai', 'Mexico City', 'Toronto', 'Rome'];
  const validCities = [];

  for (let city of cities) {
    const temperature = await getWeatherData(city);
    if (temperature >= 10 && temperature <= 35) {
      validCities.push(city);
    }
  }

  return validCities;
};

const HomeScreen = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTodosAndCities = async () => {
    setLoading(true);
    try {
      const todoResponse = await fetch('https://jsonplaceholder.typicode.com/todos');
      const todosData = await todoResponse.json();
      const validCities = await fetchCities();
      const updatedTodos = todosData.map((todo, index) => {
        todo.title = validCities[index] || 'Default City';
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
    setLoading(false);
  };

  const storeDataInFirestore = async (todos) => {
    const collectionRef = firestore().collection('todos');
    try {
      for (let todo of todos) {
        await collectionRef.add(todo);
      }
      Alert.alert('Success', 'Data has been stored in Firestore');
    } catch (error) {
      Alert.alert('Error', 'Failed to store data');
    }
  };

  const retrieveDataFromFirestore = async () => {
    try {
      const snapshot = await firestore().collection('todos').get();
      const todos = snapshot.docs.map((doc) => doc.data());
      setTodos(todos);
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve data');
    }
  };

  return (
    <View style={styles.homeContainer}>
      <Button title="Fetch Data" onPress={fetchTodosAndCities} />
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={todos}
          renderItem={({ item }) => <Text style={styles.todoText}>{item.title}</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Button title="Store Data in Firestore" onPress={() => storeDataInFirestore(todos)} />
      <Button title="Retrieve Data from Firestore" onPress={retrieveDataFromFirestore} />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  todoText: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default HomeScreen;
