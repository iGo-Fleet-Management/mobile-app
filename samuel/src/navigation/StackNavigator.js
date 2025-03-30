import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Auth Screens
import LoginScreen from '../screens/CommonScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/CommonScreens/ForgotPasswordScreen';
import SignUpScreen from '../screens/CommonScreens/SignUpScreen';
import ResetPasswordScreen from '../screens/CommonScreens/ResetPasswordScreen';

import PassengerProfileScreen from '../screens/PassengerScreens/PassengerProfileScreen';
import DriverProfileScreen from '../screens/DriverScreens/DriverProfileScreen';
import EditProfileScreen from '../screens/CommonScreens/EditProfileScreen';
import EditAddressesScreen from '../screens/CommonScreens/EditAddressesScreen';
import PassengerHomeScreen from '../screens/PassengerScreens/PassengerHomeScreen';

import HelpScreen from '../screens/PassengerScreens/HelpScreen';


// Import Drawer Navigator for main app
import BottomTab from './BottomTabNavigator';

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

        {/* Profile Screens - These will slide in from the right */}
        <Stack.Screen 
          name="Profile" 
          component={PassengerProfileScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="DriverProfile" 
          component={DriverProfileScreen}
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

        {/* PassengerHomeScrenn */}
        <Stack.Screen name="PassengerHomeScreen" component={PassengerHomeScreen} />
        <Stack.Screen name="Ajuda" component={HelpScreen} />
        {/* DriverHomeScrenn */}
        <Stack.Screen 
          name="DriverHomeScreen" 
          component={BottomTab} 
          options={{
            gestureEnabled: false
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;