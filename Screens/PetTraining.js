import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import { UserContext } from '../Context/UserContext';

const PetTraining = ({ route, navigation }) => {
  const { user } = useContext(UserContext);

  // Function to render the training content based on pet type
  const renderTrainingContent = (petType) => {
    switch (petType.toLowerCase()) {
      case 'dog':
        return (
          <>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/jFMA5ggFsXU?si=ja4snNgNkbkJDUGT' }}
              style={styles.video}
            />
            <Text style={styles.guidelinesTitle}>Dog Training Guidelines:</Text>
            <Text style={styles.guidelines}>
              - Be consistent with commands like sit, stay, and come.{'\n'}
              - Use positive reinforcement with treats or praise.{'\n'}
              - Ensure regular exercise to reduce unwanted behaviors.{'\n'}
              - Socialize your dog with people and other pets early on.
            </Text>
          </>
        );
      case 'cat':
        return (
          <>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/yM3n2mWZqUU?si=WUo9I4sMOw2TrIt6' }}
              style={styles.video}
            />
            <Text style={styles.guidelinesTitle}>Cat Training Guidelines:</Text>
            <Text style={styles.guidelines}>
              - Use treats to teach your cat tricks like high-five.{'\n'}
              - Train your cat to use the litter box consistently.{'\n'}
              - Redirect scratching to appropriate areas like scratching posts.{'\n'}
              - Build trust with patience and gentle interactions.
            </Text>
          </>
        );
      case 'bird':
        return (
          <>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/nzCjoXO6zpI?si=vPKQ_hvYhAsCGjRU' }}
              style={styles.video}
            />
            <Text style={styles.guidelinesTitle}>Bird Training Guidelines:</Text>
            <Text style={styles.guidelines}>
              - Teach your bird basic tricks like stepping up.{'\n'}
              - Use a clicker or treat to reinforce positive behavior.{'\n'}
              - Socialize your bird with frequent interactions.{'\n'}
              - Ensure a safe and enriching cage environment.
            </Text>
          </>
        );
      case 'reptile':
        return (
          <>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/l9CsBSPR14c?si=ELRBUhqZEYD_WN3M' }}
              style={styles.video}
            />
            <Text style={styles.guidelinesTitle}>Reptile Care Guidelines:</Text>
            <Text style={styles.guidelines}>
              - Handle your reptile gently and regularly to build trust.{'\n'}
              - Maintain appropriate temperature and humidity levels.{'\n'}
              - Feed a diet tailored to the specific reptile species.{'\n'}
              - Clean the habitat regularly to prevent health issues.
            </Text>
          </>
        );
      case 'pocket pets':
        return (
          <>
            <WebView
              source={{ uri: 'https://www.youtube.com/embed/RiIkUA4J3uA?si=-Ke0DDiNnnMlem8l' }}
              style={styles.video}
            />
            <Text style={styles.guidelinesTitle}>Pocket Pet Care Guidelines:</Text>
            <Text style={styles.guidelines}>
              - Provide a secure and stimulating cage environment.{'\n'}
              - Handle gently to prevent stress or injury.{'\n'}
              - Feed a species-appropriate diet and clean water.{'\n'}
              - Monitor for signs of illness and consult a vet as needed.
            </Text>
          </>
        );
      default:
        return <Text style={styles.guidelines}>No training content available for this pet type.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={user?.pets || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petContainer}>
            <Text style={styles.petName}>{item.PetName} ({item.PetType})</Text>
            {renderTrainingContent(item.PetType)}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    padding: 20,
    alignItems:"center",
    justifyContent:"center"

  },
  petContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignSelf:"center",
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guidelines: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default PetTraining;
