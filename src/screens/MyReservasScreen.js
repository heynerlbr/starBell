import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../context/AuthContext'; // Asegúrate de ajustar la ruta
import PusherService from '../services/PusherService';
const ElementoScreen = ({route, navigation}) => {
  const [reservas, setReservas] = useState([]);
  const {userProfile} = useContext(AuthContext); // Usa el contexto
  console.log(userProfile);
  const cancelarReserva = id => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas cancelar la reserva?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => cancelarReservaConfirmada(id),
        },
      ],
      {cancelable: false},
    );
  };
  const cancelarReservaConfirmada = id => {
    const urlapi = `${urlRest}api/CancelarReservaApi`;
    console.log(urlapi);
    fetch(urlapi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.Tipo === 'success') {
          fetchMyReservas();
          // Mostrar Toast de éxito al cancelar la reserva
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Reserva Cancelada',
            text2: 'Tu reserva ha sido cancelada exitosamente.',
            backgroundColor: 'green',
            text1Color: 'white',
            text2Color: 'white',
            text1Style: {
              fontSize: 18,
              fontWeight: 'bold',
            },
            text2Style: {
              fontSize: 16,
            },
            visibilityTime: 3000,
            style: {
              paddingHorizontal: 20,
              borderRadius: 10,
              marginTop: 50,
              zIndex: 9999,
            },
          });
        }
      })
      .catch(error => {
        console.log('Error fetching element data:', error);
      });
  };
  const verDetalle = item => {
    navigation.navigate('MyDetalleReserva', {
      reserva: item,
      id: item.id_elemento,
    });
  };
  const fetchMyReservas = () => {
    const urlapi = `${urlRest}api/obtenerMisReservasApi`;
    console.log('este', userProfile.id);
    console.log(urlapi);
    setReservas([]);
    fetch(urlapi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
      },
      body: JSON.stringify({
        id: userProfile.id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setReservas(data.reservas);
      })
      .catch(error => {
        console.log('Error fetching element data:', error);
      });
  };
  useEffect(() => {
    fetchMyReservas();
    const initPusher = async () => {
      try {
        const pusherService = PusherService.getInstance();
        // Ejemplo de suscripción con manejador por defecto
        await pusherService.subscribeToChannel(
          'my-channel',
          'my-event',
          event => {
            console.log('Evento recibido:', event);
            // Aquí parseas solo la propiedad 'data' que es un string JSON
            let data = JSON.parse(event.data);
            console.log('Datos del evento:', data);
            fetchMyReservas();
            Toast.show({
              type: 'success', // Tipo de notificación
              position: 'top', // Posición en la pantalla
              text1: data.message, // Título
              text2: data.message, // Mensaje personalizado
              visibilityTime: 5000, // Duración del Toast
              style: {
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 50,
                zIndex: 9999, // Asegúrate de que el zIndex sea suficientemente alto
                elevation: 999, // Para Android
              },
              // Especificar la posición para que aparezca en la parte superior derecha
              positionValue: {top: 50, right: 10},
            });
          },
        );
      } catch (error) {
        console.error('Error al inicializar Pusher:', error);
      }
    };
    initPusher();
    // return () => {
    //   const pusherService = PusherService.getInstance();
    //   pusherService
    //     .unsubscribeFromChannel('my-channel')
    //     .catch(error => console.error('Error al desuscribirse:', error));
    // };
  }, []);
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <Icon name="map-marker" size={16} color="#007bff" />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {item.nombreLugar}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={14} color="#007bff" />
          <Text style={styles.dateText}>
            {item.fecha_inicio} - {item.fecha_fin}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailColumn}>
          <View style={styles.iconTextRow}>
            <Icon name="clock-o" size={14} color="#007bff" />
            <Text style={styles.detailLabel}>Hora Inicio:</Text>
            <Text style={styles.detailText}>{item.hora_inicio}</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icon name="clock-o" size={14} color="#007bff" />
            <Text style={styles.detailLabel}>Hora Fin:</Text>
            <Text style={styles.detailText}>{item.hora_fin}</Text>
          </View>
        </View>
        <View style={styles.addressColumn}>
          <Icon name="map-marker" size={14} color="#007bff" />
          <Text style={styles.addressLabel}>Dirección:</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {item.direccionLugar}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.verDetalleButton]}
          onPress={() => verDetalle(item)}>
          <Text style={styles.buttonText}>Ver Detalle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelarReservaButton]}
          onPress={() => cancelarReserva(item.id)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Toast zIndex={9999} ref={ref => Toast.setRef(ref)} />
        <Text style={styles.title}>Mis Reservas</Text>
        <FlatList
          data={reservas}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailColumn: {
    flex: 1,
    marginRight: 10,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    marginRight: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#333',
  },
  addressColumn: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  verDetalleButton: {
    backgroundColor: '#007bff',
  },
  cancelarReservaButton: {
    backgroundColor: '#dc3545',
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },

  flatListContainer: {
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
});
export default ElementoScreen;
