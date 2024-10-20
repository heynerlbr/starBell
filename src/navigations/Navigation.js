import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginNavigation from './LoginNavigation';
import LugaresNavigation from './LugaresNavigation';
import MyReservasNavigation from './MyReservasNavigation';
import UserProfileScreen from '../screens/PerfilScreen';
import favoritosScreen from '../screens/favoritosScreen';
import {AuthContext} from '../context/AuthContext'; // Asegúrate de ajustar la ruta

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const {isAuthenticated} = useContext(AuthContext);

  console.log('si soy', isAuthenticated);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: '#f8f9fa'},
      }}>
      {isAuthenticated ? (
        <>
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
            name="reservas"
            component={LugaresNavigation}
            options={{
              tabBarLabel: 'reservas',
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
            name="Favoritos"
            component={favoritosScreen}
            options={{
              tabBarLabel: 'Favoritos',
              tabBarIcon: ({color, size}) => (
                <FontAwesome5 name="star" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
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
      )}
    </Tab.Navigator>
  );
};

export default Navigation;
