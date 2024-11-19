import React from 'react';
import {View, Text, FlatList, StyleSheet, Button} from 'react-native';

const HorariosDisponibles = ({horarios, visible, onClose}) => {
  // Validar que `horarios` es un array válido de objetos
  console.log(horarios);

  if (
    !Array.isArray(horarios) ||
    horarios.some(
      item => typeof item.inicio !== 'string' || typeof item.fin !== 'string',
    )
  ) {
    console.error('Datos de horarios no válidos:', horarios);
    return <Text>Hubo un error con los horarios.</Text>;
  }

  // Función para formatear la hora al formato 12 horas con AM/PM
  const formatTime = time => {
    const [hours, minutes] = time.split(':');
    const hourInt = parseInt(hours, 10);
    const suffix = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Horarios Disponibles</Text>
      <FlatList
        data={horarios}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {formatTime(item.inicio)} - {formatTime(item.fin)}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Asigna una clave única a cada elemento
      />
      <Button title="Cerrar" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default HorariosDisponibles;
