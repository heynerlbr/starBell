import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginNavigation from './LoginNavigation';
import LugaresNavigation from './LugaresNavigation';
import MyReservasNavigation from './MyReservasNavigation';
import UserProfileScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: '#f8f9fa'},
      }}>
      <Tab.Screen
        name="Perfil"
        component={UserProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lugares"
        component={LugaresNavigation}
        options={{
          tabBarLabel: 'Lugares',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="building" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mis reservas"
        component={MyReservasNavigation}
        options={{
          tabBarLabel: 'Mis reservas',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginNavigation}
        options={{
          tabBarLabel: 'Login',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
