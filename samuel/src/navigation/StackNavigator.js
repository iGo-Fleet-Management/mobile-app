import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Drawer Navigator
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={DrawerNavigator} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;