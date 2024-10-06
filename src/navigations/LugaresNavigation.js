import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LugaresScreen from '../screens/LugaresScreen';
import DetalleLugarScreen from '../screens/DetalleLugarScreen';
import ListLugarScreen from '../screens/ListLugaresScreen';
import ListElementosScreen from '../screens/ListElementosScreen';
import ElementoScreen from '../screens/ElementoScreen';
import {INFO_CLIENTE} from '../api/api';

const Stack = createStackNavigator();

const LugaresNavigation = () => {
  const isUserLoggedIn = INFO_CLIENTE.length > 0;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: 'transparent'},
        headerTintColor: '#fff', // Color de los iconos y texto en el header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTransparent: true,
        headerTitleAlign: 'center', // Opcional: Alínea el título al centro
      }}>
      <Stack.Screen name="LugaresForm" component={LugaresScreen} />
      <Stack.Screen name="ListLugares" component={ListLugarScreen} />
      <Stack.Screen name="ListElementos" component={ListElementosScreen} />
      <Stack.Screen name="ElementoView" component={ElementoScreen} />
      <Stack.Screen name="DetalleLugar" component={DetalleLugarScreen} />
    </Stack.Navigator>
  );
};

export default LugaresNavigation;
