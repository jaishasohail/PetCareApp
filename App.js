import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Video } from 'expo-av';
import HomePage from './Screens/HomePage';
import LoginPage from './Screens/LoginPage';
import ProfilePage from './Screens/ProfilePage';
import PetDetails from './Screens/PetDetails';
import MainScreen from './Screens/MainScreen';
import { UserProvider } from './Context/UserContext';
import ChatScreen from './Screens/chatGPT';
import PetTraining from './Screens/PetTraining';
import DiaryScreen from './Screens/DiaryScreen';
import AddDiaryEntryScreen from './Screens/AddDiaryEntry';
import DiaryDetailScreen from './Screens/DiaryDetailScreen';
import Notif from './Screens/notifications';
import MedicalScreen from './Screens/Health';

const { width } = Dimensions.get('window');

const slides = [
  { key: '1', video: require('./assets/vid-2.mp4') },
  { key: '2', video: require('./assets/vid-3.mp4') },
  { key: '3', video: require('./assets/vid-4.mp4') },
];

export default function App() {
  const Stack = createNativeStackNavigator();
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  

  

  const onDone = () => setShowMainApp(true);

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

  const renderDoneButton = () => (
    <TouchableOpacity style={styles.doneButton} onPress={onDone}>
      <Text style={styles.doneButtonText}>Get Started</Text>
    </TouchableOpacity>
  );

  if (showMainApp) {
    return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }}  initialParams={{ testID: 'LoginPage' }} />
            <Stack.Screen name="Home Page" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Profile Page" component={ProfilePage} options={{ headerShown: false }} />
            <Stack.Screen name="Pet Details" component={PetDetails} options={{ headerShown: false }} />
            <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="chatGPT" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TrainPet" component={PetTraining} options={{ headerShown: false }} />
            <Stack.Screen name="Diary" component={DiaryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddDiaryEntry" component={AddDiaryEntryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DiaryDetail" component={DiaryDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="notif" component={Notif} options={{ headerShown: false }} />
            <Stack.Screen name="health" component={MedicalScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    );
  }

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={onDone}
      renderDoneButton={renderDoneButton}
      onSlideChange={index => setActiveSlide(index)}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    ...StyleSheet.absoluteFillObject,
    width,
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
