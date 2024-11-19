import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import COLORS from '../constants/colors';

const DetalleLugar = ({route}) => {
  const {lugar} = route.params;

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}>
      <View style={{flex: 1}}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.text}>{lugar.nombre}</Text>
        <Text style={styles.label}>Departamento:</Text>
        <Text style={styles.text}>{lugar.departamento}</Text>
        <Text style={styles.label}>Municipio:</Text>
        <Text style={styles.text}>{lugar.municipio}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});

export default DetalleLugar;
