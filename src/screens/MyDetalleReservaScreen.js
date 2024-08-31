import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';

const MyDetalleReservaScreen = ({route, navigation}) => {
  const [elemento, setElemento] = useState({});
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const {reserva} = route.params;

  const fetchElemento = () => {
    const id = reserva.id_elemento;
    if (!id || isNaN(id)) {
      Alert.alert('Error', 'ID inválido proporcionado.');
      console.error('ID inválido proporcionado.');
      return;
    }
    if (id) {
      const urlapi = `${urlRest}api/obtenerInformacionElemento`;
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
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setElemento(data.elemento);
          setImages(data.imagenes);
        })
        .catch(error => {
          Alert.alert(
            'Error',
            'Failed to fetch element data. Please try again later.',
          );
          console.log('Error fetching element data:', error);
        });
    } else {
      Alert.alert('Error', 'Invalid ID provided.');
      console.error('Invalid ID provided.');
    }
  };

  useEffect(() => {
    fetchElemento();
  }, []);

  useEffect(() => {
    setLoadingImages(true);
  }, [images]);

  const handleImageLoad = () => {
    setLoadingImages(false);
  };

  const formatValue = value => {
    return typeof value === 'number' && !isNaN(value)
      ? value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      : 0;
  };

  const renderAvailabilityIcon = isAvailable => (
    <Icon
      name={isAvailable ? 'check-circle' : 'times-circle'}
      size={20}
      color={isAvailable ? 'green' : 'red'}
    />
  );

  const formatTime = time => {
    if (time != null) {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    return time;
  };

  const renderImage = item => (
    <View style={styles.imageContainer} key={item.id}>
      <Image
        source={{uri: item.url}}
        style={styles.image}
        resizeMode="cover"
        onLoad={handleImageLoad}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {loadingImages && (
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/acecard.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      {images && images.length > 0 && (
        <Swiper
          style={styles.swiper}
          loop={true}
          autoplay={true}
          autoplayTimeout={3}
          paginationStyle={{bottom: 10}}>
          {images.map(renderImage)}
        </Swiper>
      )}
      <View style={styles.detailsContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Detalle de la Reserva</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>
              <Text style={styles.label}>Nombre del lugar:</Text>{' '}
              {reserva.nombreLugar}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Dirección:</Text>{' '}
              {reserva.direccionLugar}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Departamento:</Text>{' '}
              {reserva.departamento}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Municipio:</Text> {reserva.municipio}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Fecha:</Text> {reserva.fecha}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Hora de inicio:</Text>{' '}
              {reserva.hora_inicio}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Hora de fin:</Text> {reserva.hora_fin}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Estado:</Text> {reserva.estado}
            </Text>
          </View>
        </View>
        {elemento && (
          <>
            <Text style={styles.title}>{elemento.descripcion}</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Capacidad:</Text>
                <Text style={styles.infoText}>{elemento.numero_capacidad}</Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Valor:</Text>
                <Text style={styles.infoText}>
                  ${formatValue(elemento.valor)}
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <View style={styles.daysContainer}>
                  {[
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado',
                    'Domingo',
                  ].map((day, index) => (
                    <View key={index} style={styles.day}>
                      <Text style={styles.daysLabel}>{day}:</Text>
                      {renderAvailabilityIcon(elemento[day.toLowerCase()])}
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Horario :</Text>
                <Text style={styles.infoText}>
                  {formatTime(elemento.hora_inicio_disponibilidad)} -{' '}
                  {formatTime(elemento.hora_fin_disponibilidad)}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingBottom: 20,
  },
  swiper: {
    height: Dimensions.get('window').width * 0.8,
    marginTop: 20,
    marginBottom: 30,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  day: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  daysLabel: {
    marginRight: 5,
    fontSize: 16,
    color: '#666',
  },
});

export default MyDetalleReservaScreen;
