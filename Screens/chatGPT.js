import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';

const GEMINI_API_KEY = 'AIzaSyBIPqsK-avQUwOrhCaYoJyRgsmzZb4DrSk'; // Replace with your actual Gemini API key

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  const getGeminiResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userMessage,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const botResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I couldn’t process your request.';

      return botResponse;
    } catch (error) {
      console.error('Error fetching Gemini response:', error.message);
      return 'Sorry, I encountered an error while processing your message.';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    setGeneratingAnswer(true);
    const botResponse = await getGeminiResponse(input);
    const botMessage = { id: Date.now().toString() + '-bot', text: botResponse, sender: 'bot' };
    setMessages((prev) => [...prev, botMessage]);
    setGeneratingAnswer(false);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/chatGPT.png')} // Replace with your logo URL
            style={styles.logo}
          />
          <Text style={styles.headerText}>Ask Anything</Text>
        </View>

        <FlatList
          ref={chatContainerRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
        />

        {generatingAnswer && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.sendButton, generatingAnswer && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={generatingAnswer}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure the header stays on top
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: {
    padding: 10,
    paddingTop: 150, // Adjust the padding to ensure it doesn't overlap with the header
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typingIndicator: {
    padding: 10,
    alignItems: 'center',
  },
  typingText: {
    fontSize: 16,
    color: '#888',
  },
});

export default ChatScreen;
