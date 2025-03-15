import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Auth Screens
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

import PassengerProfileScreen from '../screens/PassengerProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditAddressesScreen from '../screens/EditAddressesScreen';

// Import Drawer Navigator for main app
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        
        {/* Main App */}
        <Stack.Screen name="Main" component={DrawerNavigator} />

        {/* Profile Screens - These will slide in from the right */}
        <Stack.Screen 
          name="Profile" 
          component={PassengerProfileScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="EditAddresses" 
          component={EditAddressesScreen}
          options={{
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;