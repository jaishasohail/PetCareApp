import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

const DATA = [
  { id: 1, title: 'Dog', image: require('../Pets/Dog.png') ,sound: require('../Pets/dog.mp3') },
  { id: 2, title: 'Cat', image: require('../Pets/Cat.png'),sound: require('../Pets/cat.mp3') },
  { id: 3, title: 'Bird', image: require('../Pets/Bird.png') ,sound: require('../Pets/bird.mp3')},
  { id: 4, title: 'Reptile', image: require('../Pets/Reptile.png'),sound: require('../Pets/snake.mp3') },
  { id: 5, title: 'Pocket Pets', image: require('../Pets/Hamster.png') ,sound: require('../Pets/mouse.mp3')},
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Image source={item.image} style={styles.image} />
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

export default function PetPage({ onSelection,PetType }) {
  const [selectedId, setSelectedId] = useState(null);
  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isPlaying) {
        sound.unloadAsync(); // Unload sound when playback is complete
      }
    });
  };

  const handleSelect = (id,type,soundFile) => {
    setSelectedId(id);
    playSound(soundFile);
    if (onSelection) {
      onSelection(true); 
      PetType(type);
      console.log(type);
      
      
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#006666' : '#66b7bb';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => handleSelect(item.id,item.title,item.sound)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
          numColumns={2}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    margin: 5,
    padding: 10,
    backgroundColor: '#f9c2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '47%',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
});
