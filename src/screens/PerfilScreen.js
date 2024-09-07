import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import COLORS from '../constants/colors';
import {obtenerPerfilUsuario} from '../api/api'; // Asegúrate de que esto esté correctamente configurado
import BtnLogout from '../componentes/BtnLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {urlRest} from '../api/api'; // Ajusta según sea necesario
import {AuthContext} from '../context/AuthContext'; // Asegúrate de ajustar la ruta

const Perfil = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica la autenticación y obtiene datos del usuario
  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      console.log('No estás autenticado');
      navigation.navigate('Login');
      return false;
    }

    try {
      const urlapi = `${urlRest}api/user`;
      const response = await fetch(urlapi, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const userData = await response.json();
        console.log('Usuario autenticado:', userData);
        setUserData(userData); // Actualiza el estado con los datos del usuario
        return true;
      } else {
        console.log('Sesión expirada o token inválido');
        return false;
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      return false;
    }
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        navigation.navigate('Login');
      } else {
        setIsLoading(false); // Cambia el estado de carga a falso cuando la autenticación esté completa
      }
    };

    authenticateUser();
  }, [navigation]);

  if (isLoading) {
    return <Text>Cargando...</Text>; // Puedes mejorar esto con un componente de carga
  }

  const name = userData?.name || 'Nombre no disponible';
  const email = userData?.email || 'Email no disponible';

  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <Avatar
                rounded
                source={require('../images/acecard.png')}
                size="xlarge"
              />
            </View>
            <Text style={styles.title}>Perfil de Usuario</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.text}>{name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.text}>{email}</Text>
            </View>
            <BtnLogout />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Tarjeta transparente
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  infoContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
    color: COLORS.dark,
  },
  text: {
    fontSize: 18,
    color: COLORS.dark,
  },
});

export default Perfil;
