import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

// Import Navigation
import BottomTabNavigator from './BottomTabNavigator';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#3f51b5',
        drawerItemStyle: { marginVertical: 5 },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={BottomTabNavigator} 
        options={{
          drawerLabel: 'Início',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="home" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Sobre" 
        component={AboutScreen} 
        options={{
          drawerLabel: 'Sobre o Aplicativo',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="info" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Ajuda" 
        component={HelpScreen} 
        options={{
          drawerLabel: 'Ajuda',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="help" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;