import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from './App'; 

jest.mock('expo-av', () => ({
  Video: 'mocked-video', 
}));

describe('App Component', () => {
  test('renders the intro slider and done button', () => {
    const { getByText, getByTestId } = render(<App />);

    
    expect(getByText('Get Started')).toBeTruthy();

  
    const doneButton = getByText('Get Started');
    fireEvent.press(doneButton); 

    
    expect(getByTestId('LoginPage')).toBeTruthy();
  });
});
