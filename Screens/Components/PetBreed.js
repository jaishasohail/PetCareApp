import React,{ useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const breedOptions = {
  Dog: ['Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle', 'Beagle'],
  Cat: ['Persian Cat', 'Siamese Cat', 'Maine Coon', 'Bengal', 'Ragdoll', 'British Shorthair'],
  Bird: ['Parrot', 'Canary', 'Cockatiel', 'Finch', 'Budgerigar', 'Lovebird'],
  Reptile: ['Bearded Dragon', 'Leopard Gecko', 'Corn Snake', 'Red-Eared Slider', 'Chameleon', 'Ball Python'],
  PocketPets: ['Hamster', 'Guinea Pig', 'Gerbil', 'Chinchilla', 'Sugar Glider', 'Degu'],
};

const Item = ({ title, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.title, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

export default function PetBreed({ petType ,onSelectBreed,petBreeds}) {
    const [selectedBreed, setSelectedBreed] = useState(null);
    let data;
    if(petType !="Pocket Pets"){
        data = breedOptions[petType] || [];
    }
    else{
        data =breedOptions["PocketPets"]
    }
  
    const handleSelect = (item) => {
        setSelectedBreed(item);
        petBreeds(item);
        if (onSelectBreed) {
            onSelectBreed(true); 
          
        }
      };
//   const renderItem = ({ item }) => <Item title={item} />;
  const renderItem = ({ item }) => {
    const backgroundColor = item === selectedBreed ? '#006666' : '#66b7bb';
    const color = item === selectedBreed ? 'white' : 'black';

    return (
      <Item
        title={item}
        onPress={() => handleSelect(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
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
    backgroundColor: '#66b7bb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
});
