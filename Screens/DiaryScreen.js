import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../Context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const DiaryScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Fetch the logged-in user details
  const [diaryEntries, setDiaryEntries] = useState([]);

  // Fetch diary entries when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchDiaryEntries = async () => {
        try {
          const response = await fetch(`http://192.168.1.76:5000/api/diary/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Sort entries by timestamp in descending order
            const sortedEntries = data.entries ? data.entries.sort((a, b) => b.timestamp._seconds - a.timestamp._seconds) : [];
            setDiaryEntries(sortedEntries);
          } else {
            console.error('Failed to fetch diary entries');
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      };

      fetchDiaryEntries();
    }, [user.id]) // Dependencies array includes user.id
  );

  // Generate summary from the first 100 characters of content
  const generateSummary = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  // Format the timestamp to a readable date string
  const formatDate = (timestamp) => {
    // Firestore timestamp contains _seconds and _nanoseconds
    const { _seconds } = timestamp;

    // Convert _seconds to milliseconds (JavaScript's Date works in milliseconds)
    const date = new Date(_seconds * 1000);

    // Check if date is valid
    if (isNaN(date)) {
      return 'Invalid date';
    }

    // Format the date as a readable string
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pet Diary</Text>

      <FlatList
        data={diaryEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entry}
            onPress={() => { navigation.navigate('DiaryDetail', { entry: item }); }}
          >
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entrySummary}>{generateSummary(item.content)}</Text>
            <Text style={styles.entryDate}>{formatDate(item.timestamp)}</Text> 
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noEntries}>No diary entries yet.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDiaryEntry')}
      >
        <Text style={styles.addButtonText}>Add New Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  entry: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  entrySummary: {
    fontSize: 14,
    color: '#333',
  },
  noEntries: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DiaryScreen;
