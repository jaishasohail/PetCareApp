import 'react-native-gesture-handler/jestSetup';
jest.mock('expo-av', () => ({ Video: jest.fn() }));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
