import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiaryDetailScreen = ({ route }) => {
  const { entry } = route.params; // Get the selected diary entry from navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.content}>{entry.content}</Text>
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
    color: '#fff',
    marginBottom: 10,
  },
  summary: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  content: {
    fontSize: 14,
    color: '#fff',
  },
});

export default DiaryDetailScreen;
