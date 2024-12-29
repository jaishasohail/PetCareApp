import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../Context/UserContext';

const AddDiaryEntryScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Fetch the logged-in user details
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Generate summary from the first 100 characters of content
  const summary = content.length > 100 ? content.substring(0, 100) + '...' : content;

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Both title and content are required.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.76:5000/api/diary/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Diary entry added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to add diary entry.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Diary Entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your diary entry here..."
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Display Summary if content exists */}
      {content.trim() && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary:</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03989e',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  summaryContainer: {
    width: '100%',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#22bcb5',
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#22bcb5',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddDiaryEntryScreen;
