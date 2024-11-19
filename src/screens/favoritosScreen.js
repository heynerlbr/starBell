import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListFavoritosScreen = ({navigation}) => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    console.log('ListFavoritosScreen mounted');
    fetchFavoritos();
  }, []);

  const fetchFavoritos = async () => {
    console.log('Fetching favoritos');

    const userId = await AsyncStorage.getItem('userId');
    console.log('User ID:', userId); // Verificar el ID del usuario

    if (!userId) {
      console.error('El ID del usuario no está disponible');
      return;
    }

    let urlapi = `${urlRest}api/obtenerFavoritos`;
    console.log('API URL:', urlapi); // Verificar la URL de la API

    fetch(urlapi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
      },
      body: JSON.stringify({userId}),
    })
      .then(response => {
        // Verificar respuesta antes de convertirla a JSON
        return response.json();
      })
      .then(data => {
        console.log('Data:', data); // Verificar la data recibida
        if (data.success) {
          setFavoritos(data.favoritos);
        } else {
          console.error('Error al obtener los favoritos:', data.message);
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API:', error);
      });
  };

  const handleItemPress = id => {
    navigation.navigate('ListElementos', {lugarId: id});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item.id)}
      style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemAddress}>{item.direccion}</Text>
        <Icon name="star" size={24} color="#FFD700" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={favoritos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemAddress: {
    fontSize: 16,
    color: '#666',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default ListFavoritosScreen;
