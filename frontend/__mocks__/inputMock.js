// __mocks__/inputMock.js
import React from 'react';
import { TextInput } from 'react-native';

const Input = ({ placeholder, onChangeText, value, secureTextEntry, ...props }) => {
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
      testID={`input-${placeholder}`}
      {...props}
    />
  );
};

export default Input;