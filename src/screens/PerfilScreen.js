import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import COLORS from '../constants/colors';
import {obtenerPerfilUsuario} from '../api/api';
import BtnLogout from '../componentes/BtnLogout';

const Perfil = ({route}) => {
  // Obtener el perfil del usuario
  const userProfile = obtenerPerfilUsuario() || {};

  // Valores predeterminados
  const defaultName = 'Nombre no disponible';
  const defaultEmail = 'Email no disponible';

  // Asignar valores del perfil del usuario o valores predeterminados
  const name = userProfile.name || defaultName;
  const email = userProfile.email || defaultEmail;

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
