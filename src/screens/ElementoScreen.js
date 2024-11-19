import React, {useRef, useEffect, useState, useContext} from 'react';
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
  ActivityIndicator,
  Platform,
  Button,
  FlatList,
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import HorariosDisponibles from '../componentes/HorariosDisponibles';
import {AuthContext} from '../context/AuthContext';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const ElementoScreen = ({route, navigation}) => {
  const {userProfile} = useContext(AuthContext);
  const [elemento, setElemento] = useState({});
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [validateDay, setValidateDay] = useState(0);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [horariosModalVisible, setHorariosModalVisible] = useState(false);
  const [selectedHorarios, setSelectedHorarios] = useState([]);
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
      setIsLoading(true);
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
        'No se pudo obtener la información. Por favor, intente más tarde.',
      );
      console.error('Error fetching element data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const validarDiaApi = async fecha => {
    console.log('llega');

    console.log(fecha);

    if (!id || isNaN(id)) {
      Alert.alert('Error', 'ID inválido proporcionado.');
      return;
    }
    try {
      console.log('validarDiaApi');

      let URL = `${urlRest}api/validarDiaApi`;

      console.log(URL);

      const response = await fetch(URL, {
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
      console.log(data);

      setValidateDay(data.diaValido);
      setHorariosDisponibles(data.horariosDisponibles);
    } catch (error) {
      Alert.alert('Error', 'Error al validar la fecha. Intente nuevamente.');
      console.error('Error validating date:', error);
    }
  };
  const crearReserva = async () => {
    const reservaData = {
      fecha_inicio: selectedStartDate.toISOString().split('T')[0],
      fecha_fin: selectedEndDate.toISOString().split('T')[0],
      id_elemento: id,
      hora_inicio: startTime,
      hora_fin: endTime,
      id_usuario_crea: userProfile.id,
    };
    console.log('reservaData:', reservaData);
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
      console.log('data:', data);
      if (data.tipo === 'success') {
        Alert.alert('Éxito', 'Reserva creada exitosamente');
        setModalVisible(false);
      } else if (data.tipo === 'error') {
        Alert.alert('Error', data.respuesta || 'Error al crear la reserva');
      } else {
        throw new Error(data.message || 'Error al crear la reserva');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo crear la reserva. Por favor, inténtelo nuevamente.',
      );
      console.error('Error creating reservation:', error);
    }
  };
  const handleSubmit = () => {
    console.log('se esta ejecutando...');
    console.log(selectedStartDate);

    if (selectedStartDate == undefined) {
      return;
    }
    validarDiaApi(selectedStartDate.toISOString().split('T')[0]);
  };
  useEffect(() => {
    fetchElemento();
  }, []);
  useEffect(() => {
    if (!isLoading && detailsRef.current) {
      detailsRef.current.slideInUp(800);
    }
  }, [isLoading]);
  const handleImageLoad = () => {
    setLoadingImages(false);
  };
  const formatValue = value =>
    value != null
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '0';
  const formatTime = time => {
    if (!time) {
      return ''; // Retorna vacío si `time` es null o undefined
    }

    // Convierte `time` a cadena si no lo es
    if (typeof time !== 'string') {
      time = time.toString();
      console.log('Convertido a cadena:', time);
    }

    // Si contiene una 'T', extrae la hora
    if (time.includes('T')) {
      try {
        const timePart = time.split('T')[1]?.split('.')[0]; // Extrae después de 'T' y elimina milisegundos
        if (timePart) {
          const [hours, minutes] = timePart.split(':');
          console.log('Paso por acá, hora extraída:', `${hours}:${minutes}`);
          return `${hours}:${minutes}`; // Devuelve en formato "HH:mm"
        }
      } catch (error) {
        console.error('Error al extraer hora y minutos:', error);
        return 'Formato inválido';
      }
    }

    // Si es un formato tipo "Tue Nov 19 2024 22:20:31 GMT+0000"
    if (time.includes('GMT')) {
      try {
        const parsedDate = new Date(time); // Convierte a objeto `Date`
        if (!isNaN(parsedDate.getTime())) {
          const hours = parsedDate.getUTCHours();
          const minutes = parsedDate.getUTCMinutes();
          console.log('Paso por acá, fecha válida:', `${hours}:${minutes}`);
          return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;
        }
      } catch (parseError) {
        console.error('Error al analizar la fecha:', parseError);
      }
    }

    // Si el formato es HH:mm:ss o HH:mm
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error al formatear la hora:', error);
      return 'Formato inválido';
    }
  };

  const formatTimeHorario = time => {
    const [hours, minutes] = time.split(':');
    const hourInt = parseInt(hours, 10);
    const suffix = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };
  const renderImage = item => (
    <View style={styles.slideContainer} key={item.id}>
      {loadingImages && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
      <Image
        source={{uri: item.url}}
        style={styles.slideImage}
        onLoad={handleImageLoad}
        resizeMode="cover"
      />
    </View>
  );
  const renderAvailabilityIcon = isAvailable => (
    <Icon
      name={isAvailable ? 'check-circle' : 'times-circle'}
      size={20}
      color={isAvailable ? '#4CAF50' : '#FF5252'}
      style={styles.availabilityIcon}
    />
  );
  const renderDatePicker = (
    showPicker,
    setShowPicker,
    selectedDate,
    setSelectedDate,
    label,
  ) => (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}>
        <Text style={styles.datePickerText}>
          {selectedDate.toISOString().split('T')[0]}
        </Text>
        <Icon name="calendar" size={24} color="#666" />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            console.log('el picker');

            setShowPicker(false);
            if (date) {
              setSelectedDate(date);
              // if (label === 'Fecha Inicio') {
              handleSubmit();
              // }
            }
          }}
          minimumDate={new Date()}
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
    <View style={styles.timePickerContainer}>
      <Text style={styles.timePickerLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowPicker(true)}>
        <Text style={styles.timePickerText}>{formatTime(selectedTime)}</Text>
        <Icon name="clock-o" size={24} color="#666" />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, time) => {
            setShowPicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}
    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.carouselContainer}>
          {images && images.length > 0 ? (
            <Swiper
              style={styles.wrapper}
              height={screenHeight * 0.4}
              loop
              autoplay
              autoplayTimeout={3}
              showsPagination={true}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={styles.pagination}>
              {images.map(renderImage)}
            </Swiper>
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={require('../images/acecard.png')}
                style={styles.placeholderImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <Animatable.View
          ref={detailsRef}
          style={styles.detailsContainer}
          animation="slideInUp"
          duration={800}>
          {elemento && (
            <>
              <Text style={styles.title}>
                {truncateText(elemento.descripcion, 50)}
              </Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Capacidad:</Text>
                  <Text style={styles.infoText}>
                    {elemento.numero_capacidad} personas
                  </Text>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Valor:</Text>
                  <Text style={styles.infoText}>
                    ${formatValue(elemento.valor)}
                  </Text>
                </View>
                <View style={styles.daysContainer}>
                  <Text style={styles.title}>Días disponibles:</Text>
                  <View style={styles.table}>
                    {[
                      'Lunes',
                      'Martes',
                      'Miércoles',
                      'Jueves',
                      'Viernes',
                      'Sábado',
                      'Domingo',
                    ].map((day, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={styles.dayLabel}>{day}</Text>
                        {renderAvailabilityIcon(elemento[day.toLowerCase()])}
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Horario:</Text>
                  <Text style={styles.infoText}>
                    {elemento.hora_inicio_disponibilidad} -{' '}
                    {elemento.hora_fin_disponibilidad}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.reserveButtonText}>Reservar Ahora</Text>
                  <Icon
                    name="calendar-check-o"
                    size={20}
                    color="#fff"
                    style={styles.reserveButtonIcon}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animatable.View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Realizar Reserva</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.scrollContentContainer}>
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.datePickerText}>
                    {selectedStartDate
                      ? selectedStartDate.toLocaleDateString()
                      : 'Fecha Inicio'}
                  </Text>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#000"
                    style={styles.datePickerIcon}
                  />
                </TouchableOpacity>
              </View>
              {showStartDatePicker && (
                <DateTimePicker
                  value={selectedStartDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    console.log('cambio aca');
                    console.log(date);

                    setShowStartDatePicker(false);
                    if (date) {
                      setSelectedStartDate(date);
                      setTimeout(() => {
                        handleSubmit();
                      }, 2000);
                    }
                  }}
                />
              )}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.datePickerText}>
                    {selectedEndDate
                      ? selectedEndDate.toLocaleDateString()
                      : 'Fecha Fin'}
                  </Text>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#000"
                    style={styles.datePickerIcon}
                  />
                </TouchableOpacity>
              </View>
              {showEndDatePicker && (
                <DateTimePicker
                  value={selectedEndDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndDatePicker(false);
                    if (date) setSelectedEndDate(date);
                  }}
                />
              )}
              {horariosDisponibles && horariosDisponibles.length > 0 && (
                // <View style={styles.horariosContainer}>
                //   <Text style={styles.horariosTitle}>Horarios Disponibles</Text>
                //   <View style={styles.horariosGrid}>
                //     {horariosDisponibles.map((horario, index) => (
                //       <View key={index} style={styles.horarioItem}>
                //         <Text>
                //           {horario.inicio} - {horario.fin}
                //         </Text>
                //       </View>
                //     ))}
                //   </View>
                // </View>
                <View style={styles.horariosContainer}>
                  <Text style={styles.horariosTitle}>Horarios Disponibles</Text>
                  <View style={styles.horariosGrid}>
                    {horariosDisponibles.map((horario, index) => {
                      const isSelected = selectedHorarios.includes(index);

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.horarioItem,
                            isSelected && styles.horarioItemSelected,
                          ]}
                          onPress={() => {
                            // Actualiza el estado de horarios seleccionados
                            if (isSelected) {
                              setSelectedHorarios(
                                selectedHorarios.filter(i => i !== index),
                              );
                            } else {
                              setSelectedHorarios([...selectedHorarios, index]);
                              // Cambia la hora de inicio al seleccionar
                              const newStartTime = new Date();
                              const [hours, minutes] =
                                horario.inicio.split(':');
                              newStartTime.setHours(parseInt(hours, 10));
                              newStartTime.setMinutes(parseInt(minutes, 10));
                              setStartTime(newStartTime);
                              //horario fin
                              const newEndTime = new Date();
                              const [hoursEnd, minutesEnd] =
                                horario.fin.split(':');
                              newEndTime.setHours(parseInt(hoursEnd, 10));
                              newEndTime.setMinutes(parseInt(minutesEnd, 10));
                              setEndTime(newEndTime);
                            }
                          }}>
                          <Text style={styles.horarioText}>
                            <Icon name="clock-o" size={20} color="#007bff" />{' '}
                            {horario.inicio} - {horario.fin}{' '}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.datePickerText}>
                    {startTime
                      ? startTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Hora Inicio'}
                  </Text>
                  <Icon
                    name="clock-o"
                    size={20}
                    color="#000"
                    style={styles.datePickerIcon}
                  />
                </TouchableOpacity>
              </View>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, time) => {
                    setShowStartTimePicker(false);
                    if (time) {
                      setStartTime(time);
                      setTimeout(() => {
                        handleSubmit();
                      }, 2000);
                    }
                  }}
                />
              )}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.datePickerText}>
                    {endTime
                      ? endTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Hora Fin'}
                  </Text>
                  <Icon
                    name="clock-o"
                    size={20}
                    color="#000"
                    style={styles.datePickerIcon}
                  />
                </TouchableOpacity>
              </View>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, time) => {
                    setShowEndTimePicker(false);
                    if (time) setEndTime(time);
                  }}
                />
              )}
              <TouchableOpacity
                style={[styles.reserveButton, styles.modalReserveButton]}
                onPress={crearReserva}>
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
                <Icon
                  name="check"
                  size={20}
                  color="#fff"
                  style={styles.reserveButtonIcon}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
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
    marginBottom: 10, // Reducido de 30 a 10
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
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    height: screenHeight * 0.4,
    backgroundColor: '#fff',
  },
  wrapper: {},
  slideContainer: {
    height: screenHeight * 0.4,
    width: screenWidth,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  placeholderContainer: {
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    width: '80%',
    height: '80%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 20,
    minHeight: screenHeight * 0.6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
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
  // Estilo del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%', // Reducido de 90% a 80%
    maxHeight: '70%', // Añadido para controlar la altura máxima
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 15, // Reducido de 20 a 15
    paddingHorizontal: 20, // Reducido de 25 a 20
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Reducido de 15 a 10
  },
  modalTitle: {
    fontSize: 18, // Reducido de 20 a 18
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8, // Reducido de 10 a 8
  },
  modalScrollView: {
    width: '100%',
  },
  scrollContentContainer: {
    paddingVertical: 10, // Reducido de 15 a 10
  },
  inputGroup: {
    color: 'black',
    marginBottom: 15, // Reducido de 20 a 15
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10, // Reducido de 12 a 10
    paddingHorizontal: 12, // Reducido de 15 a 12
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderColor: '#e9ecef',
    borderWidth: 1,
    width: '100%', // Asegura que no exceda el ancho del contenedor
    maxWidth: '100%', // Previene desbordamiento
  },
  datePickerText: {
    fontSize: 14, // Reducido de 16 a 14
    color: '#495057',
  },
  datePickerIcon: {
    marginLeft: 8, // Reducido de 10 a 8
    color: '#6c757d',
  },
  horariosContainer: {
    marginBottom: 15, // Reducido de 20 a 15
    padding: 12, // Reducido de 15 a 12
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderColor: '#e9ecef',
    borderWidth: 1,
    width: '100%', // Asegura que no exceda el ancho del contenedor
  },
  horariosTitle: {
    fontSize: 14, // Reducido de 16 a 14
    fontWeight: 'bold',
    marginBottom: 8, // Reducido de 10 a 8
    textAlign: 'center',
    color: '#495057',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10, // Reducido de 12 a 10
    borderRadius: 20, // Reducido de 25 a 20
    marginTop: 15, // Reducido de 20 a 15
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Asegura que no exceda el ancho del contenedor
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16, // Reducido de 18 a 16
    fontWeight: 'bold',
  },
  reserveButtonIcon: {
    marginLeft: 8, // Reducido de 10 a 8
  },
  // Nuevo estilo para los horarios disponibles
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horarioItem: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    width: '48%', // Permite dos columnas con espacio entre ellas
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  table: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tableRow: {
    width: '30%', // Controla el ancho de cada celda
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});
export default ElementoScreen;
