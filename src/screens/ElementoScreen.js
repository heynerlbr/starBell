import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import HorariosDisponibles from '../componentes/HorariosDisponibles';

const ElementoScreen = ({route, navigation}) => {
  const [elemento, setElemento] = useState({});
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [validateDay, setValidateDay] = useState(0);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const {id} = route.params;

  const detailsRef = useRef(null);

  const truncateText = (text, length) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const fetchElemento = async () => {
    if (!id || isNaN(id)) {
      Alert.alert('Error', 'ID inválido proporcionado.');
      return;
    }

    try {
      const response = await fetch(`${urlRest}api/obtenerInformacionElemento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({id}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setElemento(data.elemento);
      setImages(data.imagenes);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch element data. Please try again later.',
      );
      console.error('Error fetching element data:', error);
    }
  };

  const validarDiaApi = async fecha => {
    if (!id || isNaN(id)) {
      Alert.alert('Error', 'ID inválido proporcionado.');
      return;
    }

    try {
      const response = await fetch(`${urlRest}api/validarDiaApi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify({
          id_elemento: id,
          fecha: fecha,
        }),
      });

      const data = await response.json();
      setValidateDay(data.diaValido);
      setHorariosDisponibles(data.horariosDisponibles);
    } catch (error) {
      Alert.alert('Error', 'Failed to validate date. Please try again later.');
      console.error('Error validating date:', error);
    }
  };

  const crearReserva = async () => {
    const reservaData = {
      fecha_inicio: selectedStartDate.toISOString().split('T')[0],
      fecha_fin: selectedEndDate.toISOString().split('T')[0],
      id_elemento: id,
      hora_inicio: formatTime(startTime),
      hora_fin: formatTime(endTime),
      id_usuario_crea: '2',
    };

    try {
      const response = await fetch(`${urlRest}api/CrearReservaApi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET,
        },
        body: JSON.stringify(reservaData),
      });

      const data = await response.json();
      Alert.alert('Éxito', 'Se creó la reserva correctamente.');
      console.log('Reserva creada:', data);
      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo crear la reserva. Por favor, inténtelo de nuevo más tarde.',
      );
      console.error('Error al crear la reserva:', error);
    }
  };

  const handleSubmit = () => {
    validarDiaApi(selectedStartDate);
  };

  useEffect(() => {
    fetchElemento();
    detailsRef.current?.slideInUp(800);
  }, []);

  useEffect(() => {
    setLoadingImages(true);
  }, [images]);

  const handleImageLoad = () => {
    setLoadingImages(false);
  };

  const renderImage = item => (
    <View style={styles.imageContainer} key={item.id}>
      <Image
        source={{uri: item.url}}
        style={styles.image}
        onLoad={handleImageLoad}
      />
    </View>
  );

  const renderAvailabilityIcon = isAvailable => (
    <Icon
      name={isAvailable ? 'check-circle' : 'times-circle'}
      size={20}
      color={isAvailable ? 'green' : 'red'}
    />
  );

  const formatValue = value =>
    value != null
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : value;

  const formatTime = time => {
    if (time != null) {
      const date = new Date(time);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    return time;
  };

  const renderDatePicker = (
    showPicker,
    setShowPicker,
    selectedDate,
    setSelectedDate,
    label,
  ) => (
    <View style={styles.rowContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={selectedDate.toISOString().split('T')[0]}
          editable={false}
        />
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.iconContainer}>
          <Icon name="calendar" size={30} color="#888" />
        </TouchableOpacity>
      </View>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setSelectedDate(selectedDate);
              if (label === 'Fecha Inicio') {
                handleSubmit();
              }
            }
          }}
        />
      )}
    </View>
  );

  const renderTimePicker = (
    showPicker,
    setShowPicker,
    selectedTime,
    setSelectedTime,
    label,
  ) => (
    <View style={styles.timeInputsContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.timeInput}>{formatTime(selectedTime)}</Text>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setShowPicker(true)}>
        <Icon name="clock-o" size={30} color="#888" />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) {
              setSelectedTime(selectedTime);
            }
          }}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {loadingImages && (
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/acecard.png')}
            style={styles.image}
          />
        </View>
      )}
      {images && images.length > 0 && (
        <Swiper
          style={styles.wrapper}
          loop
          autoplay
          autoplayTimeout={3}
          paginationStyle={{bottom: 10}}>
          {images.map(renderImage)}
        </Swiper>
      )}
      <Animatable.View
        ref={detailsRef}
        style={styles.detailsContainer}
        animation="slideInUp"
        duration={800}
        delay={200}>
        {elemento && (
          <>
            <Text style={styles.title}>
              {truncateText(elemento.descripcion, 50)}
            </Text>
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
                <Text style={styles.infoLabel}>Horario:</Text>
                <Text style={styles.infoText}>
                  {formatTime(elemento.hora_inicio_disponibilidad)} -{' '}
                  {formatTime(elemento.hora_fin_disponibilidad)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.reserveButtonText}>Reservar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animatable.View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Icon name="times" size={24} color="#000" />
            </TouchableOpacity>
            {renderDatePicker(
              showStartDatePicker,
              setShowStartDatePicker,
              selectedStartDate,
              setSelectedStartDate,
              'Fecha Inicio',
            )}
            {renderDatePicker(
              showEndDatePicker,
              setShowEndDatePicker,
              selectedEndDate,
              setSelectedEndDate,
              'Fecha Fin',
            )}
            <HorariosDisponibles horarios={horariosDisponibles} />
            {renderTimePicker(
              showStartTimePicker,
              setShowStartTimePicker,
              startTime,
              setStartTime,
              'Hora Inicio',
            )}
            {renderTimePicker(
              showEndTimePicker,
              setShowEndTimePicker,
              endTime,
              setEndTime,
              'Hora Fin',
            )}
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={crearReserva}>
              <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// ... (previous code remains the same)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: Dimensions.get('window').height - 100,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  label: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginLeft: 10,
    padding: 5,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ElementoScreen;
