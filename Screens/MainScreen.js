import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Video } from 'expo-av';
import Navbar from './Components/NavBar';
import { LinearGradient } from 'expo-linear-gradient';

const MainScreen = ({route}) => {
  const {user}=route.params;
  console.log("In main");
  console.log(user.pets);

    
  
  const options = [
    { id: '1', title: 'Health', img:require("../assets/paw-health.png")},
    { id: '2', title: 'Feeding and Exercise Scheduler', img:require("../assets/schedular.png") },
    { id: '4', title: 'Pet Diary',img:require("../assets/diary.png") },
    { id: '7', title: 'Pet Training',img:require("../assets/hamster.png") },
  ];


  const renderItem = ({ item }) => (
    <LinearGradient
        colors={['#008cb8', '#52babf']} 
        style={styles.gradient}
      >
    <TouchableOpacity style={styles.listItem}>
    <Image source={item.img} style={styles.IMG}/>
        <Text style={styles.listItemText}>{item.title}</Text>
      
    </TouchableOpacity>
    </LinearGradient>
  );
  const renderPetItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.PetName}</Text>
      <Text style={styles.tableCell}>{item.PetBreed}</Text>
      <Text style={styles.tableCell}>{item.PetAge}</Text>
      <Text style={styles.tableCell}>{item.PetType}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <Video
        source={require('../assets/vid-6.mp4')}
        style={StyleSheet.absoluteFill}
        shouldPlay
        resizeMode="cover"
      />
      <Navbar/>
      

      {/* FlatList */}
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          <>
          <View style={styles.vidcontainer}>
            <Video
              source={require('../assets/Dog-vid.mp4')}
              style={styles.video}
              shouldPlay
              isLooping
              resizeMode="cover"
              controls
            />
          </View>
          <View style={styles.petTableContainer}>
          <Text style={styles.tableHeader}>Your Pets</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableCellHeader}>Name</Text>
              <Text style={styles.tableCellHeader}>Breed</Text>
              <Text style={styles.tableCellHeader}>Age</Text>
              <Text style={styles.tableCellHeader}>Type</Text>
            </View>
            <FlatList
              data={user.pets}
              keyExtractor={(item) => item.id}
              renderItem={renderPetItem}
            />
          </View>
        </View>
      </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    marginTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    marginVertical: 10,
    borderRadius: 20,
  },
  vidcontainer: {
    width: '95%',
    height: 200,
    margin: 'auto',
    borderRadius: 20,
    marginBottom: 50,
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
  },
  listItemText: {
    fontSize: 16,
    color: '#fff',
  },
  IMG: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  petTableContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    alignSelf: 'center',
    width: '90%',
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#008cb8',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});
export default MainScreen;
