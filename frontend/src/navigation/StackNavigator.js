import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Auth Screens
import LoginScreen from '../screens/CommonScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/CommonScreens/ForgotPasswordScreen';
//import SignUpScreen from '../screens/CommonScreens/SignUpScreen';
import ResetPasswordScreen from '../screens/CommonScreens/ResetPasswordScreen';

// Import Profile Screens
import PassengerProfileScreen from '../screens/PassengerScreens/PassengerProfileScreen';
import DriverProfileScreen from '../screens/DriverScreens/DriverProfileScreen';
import EditProfileScreen from '../screens/CommonScreens/EditProfileScreen';
import EditAddressesScreen from '../screens/CommonScreens/EditAddressesScreen';
import PassengerHomeScreen from '../screens/PassengerScreens/PassengerHomeScreen';

// Import First Login Screens
import FirstLoginScreen from '../screens/CommonScreens/FirstLoginScreen';
import FirstLoginPersonalInfoScreen from '../screens/CommonScreens/FirstLoginPersonalInfoScreen';
import FirstLoginAddressInfoScreen from '../screens/CommonScreens/FirstLoginAddressInfoScreen';

import HelpScreen from '../screens/PassengerScreens/HelpScreen';

// Import Drawer Navigator for main app
import BottomTab from './BottomTabNavigator';

// Driver Screens
import SuggestedRouteScreen from '../screens/DriverScreens/SuggestedRouteScreen';
import ActiveTripScreen from '../screens/DriverScreens/ActiveTripScreen';
import AddPassengerScreen from '../screens/DriverScreens/AddPassengerScreen';


const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* First Login Screens */}
        <Stack.Screen 
          name="FirstLogin" 
          component={FirstLoginScreen}
          options={{
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="FirstLoginPersonalInfo" 
          component={FirstLoginPersonalInfoScreen} 
        />
        <Stack.Screen 
          name="FirstLoginAddressInfo" 
          component={FirstLoginAddressInfoScreen} 
        />

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

        {/* PassengerHomeScreen */}
        <Stack.Screen name="PassengerHomeScreen" component={PassengerHomeScreen} />
        <Stack.Screen name="Ajuda" component={HelpScreen} />
        {/* DriverHomeScreen */}
        <Stack.Screen 
          name="DriverHomeScreen" 
          component={BottomTab} 
          options={{
            gestureEnabled: false
          }}
        />

        {/* Registration Screens - Commented out until files are created */}
        {/* <Stack.Screen name='DriverRegistration' component={DriverRegistrationScreen} />
        <Stack.Screen name='PassengerRegistration' component={PassengerRegistrationScreen} /> */}

        {/* Driver Screens */}
        <Stack.Screen
          name='SuggestedRoute'
          component={SuggestedRouteScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        
        <Stack.Screen
          name='ActiveTrip'
          component={ActiveTripScreen}
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name='AddPassenger'
          component={AddPassengerScreen}
          options={{
            presentation: 'card',
            gestureEnabled: true,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;