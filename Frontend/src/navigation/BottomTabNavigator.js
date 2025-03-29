import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import Screens
import DriverHomeScreen from '../screens/DriverScreens/DriverHomeScreen';
import PassengersScreen from '../screens/DriverScreens/PassengersScreen';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = 'home';
          } else if (route.name === 'Passageiros') {
            iconName = 'people';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3f51b5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen 
        name="Início" 
        component={DriverHomeScreen} 
      />
      <BottomTab.Screen
        name='Passageiros'
        component={PassengersScreen}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;