import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const CustomStepper = ({ steps, stepContent, onComplete, canProceed }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete && onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepperHeader}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              { backgroundColor: index === currentStep ? '#66b7bb' : '#ccc' },
            ]}
          >
            <Text style={styles.stepText}>{index + 1}</Text>
          </View>
        ))}
      </View>
      <View style={styles.content}>{stepContent[currentStep]}</View>
      <View style={styles.buttons}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: canProceed[currentStep] ? '#66b7bb' : '#cccccc' },
          ]}
          onPress={handleNext}
          disabled={!canProceed[currentStep]}
        >
          <Text style={styles.buttonText}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#66b7bb',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomStepper;
