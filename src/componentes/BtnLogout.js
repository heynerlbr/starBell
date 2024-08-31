import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {INFO_CLIENTE, eliminarPerfilUsuario} from '../api/api';
const CerrarSesion = () => {
  const navigation = useNavigation();
  const cerrarSesion = () => {
    // Eliminar la información del perfil del usuario
    eliminarPerfilUsuario();
    INFO_CLIENTE.length = 0; // Limpiar el array existente

    // Redirigir al usuario a la pantalla de bienvenida o inicio de sesión
    navigation.navigate('Welcome');
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
