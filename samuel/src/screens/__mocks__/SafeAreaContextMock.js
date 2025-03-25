import React from 'react';

const MockSafeAreaView = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

export const SafeAreaProvider = ({ children }) => children;
export const SafeAreaConsumer = ({ children }) => children(null);
export const SafeAreaView = MockSafeAreaView;

export function useSafeAreaInsets() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
}

export default {
  SafeAreaProvider,
  SafeAreaConsumer,
  SafeAreaView,
  useSafeAreaInsets
};