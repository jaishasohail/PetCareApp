import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './Screens/HomePage';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Video } from 'expo-av';
import LoginPage from './Screens/LoginPage';
import ProfilePage from './Screens/ProfilePage';
import PetDetails from './Screens/PetDetails';
import MainScreen from './Screens/MainScreen';
import { AppContext } from './Screens/Context';
// import PetSchedulerScreen from './Screens/PetSchedularScreen';
// import '@react-native-firebase/app'; 

const { width, height } = Dimensions.get('window');

export default function App() {
  const Stack = createNativeStackNavigator();

  const slides = [
    {
      key: '1',
      video: require('./assets/vid-2.mp4'),
    },
    {
      key: '2',
      video: require('./assets/vid-3.mp4'),
    },
    {
      key: '3',
      video: require('./assets/vid-4.mp4'),
    },
  ];

  const [showMainApp, setShowMainApp] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const onDone = () => {
    setShowMainApp(true);
  };

  const renderSlide = ({ item, index }) => (
    <View style={{ flex: 1, backgroundColor: '#00a2b8' }}>
      <Video
        source={item.video}
        style={styles.video}
        shouldPlay={index === activeSlide} 
        isLooping
        resizeMode="cover"
      />
    </View>
  );

  if (showMainApp) {
    return (
      <NavigationContainer>
        {/* <AppContext.Provider > */}
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home Page"
            component={HomePage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile Page"
            component={ProfilePage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Pet Details"
            component={PetDetails}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="PetSchedular"
            component={PetSchedulerScreen}
            options={{
              headerShown: false,
            }}
          /> */}
        </Stack.Navigator>
        {/* </AppContext.Provider> */}
      </NavigationContainer>
    );
  }

  const renderDoneButton = () => (
    <TouchableOpacity style={styles.doneButton} onPress={onDone}>
      <Text style={styles.doneButtonText}>Get Started</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={onDone}
      renderDoneButton={renderDoneButton}
      onSlideChange={(index) => setActiveSlide(index)} 
    />
  );
}

const styles = StyleSheet.create({
  video: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: '100%',
  },
  doneButton: {
    backgroundColor: '#22bcb5',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 90,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
