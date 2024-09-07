import React, {useState, useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {INFO_CLIENTE, eliminarPerfilUsuario} from '../api/api';
import {AuthContext} from '../context/AuthContext'; // Asegúrate de ajustar la ruta

const CerrarSesion = () => {
  const navigation = useNavigation();
  const {logout} = useContext(AuthContext); // Usa el contexto
  const cerrarSesion = () => {
    // Eliminar la información del perfil del usuario
    logout();
    // eliminarPerfilUsuario();
    INFO_CLIENTE.length = 0; // Limpiar el array existente

    // Redirigir al usuario a la pantalla de bienvenida o inicio de sesión
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>¿Estás seguro de que deseas cerrar sesión?</Text>
      <Button title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CerrarSesion;
