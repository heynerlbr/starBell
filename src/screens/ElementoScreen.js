import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";
import { urlRest, CLIENT_ID, CLIENT_SECRET } from "../api/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import HorariosDisponibles from "../componentes/HorariosDisponibles";

const ElementoScreen = ({ route, navigation }) => {
  const [elemento, setElemento] = useState({});
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [ValidateDay, setValidateDay] = useState(0);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const { id } = route.params;

  const fetchElemento = () => {
    if (!id || isNaN(id)) {
      Alert.alert("Error", "ID inválido proporcionado.");
      console.error("ID inválido proporcionado.");
      return;
    }
    if (id) {
      const urlapi = `${urlRest}api/obtenerInformacionElemento`;
      fetch(urlapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID,
          "X-Client-Secret": CLIENT_SECRET,
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setElemento(data.elemento);
          setImages(data.imagenes);
        })
        .catch((error) => {
          Alert.alert(
            "Error",
            "Failed to fetch element data. Please try again later."
          );
          console.log("Error fetching element data:", error);
        });
    } else {
      Alert.alert("Error", "Invalid ID provided.");
      console.error("Invalid ID provided.");
    }
  };

  const validarDiaApi = (fecha) => {
    if (!id || isNaN(id)) {
      Alert.alert("Error", "ID inválido proporcionado.");
      console.error("ID inválido proporcionado.");
      return;
    }
    if (id) {
      console.log(id);
      console.log(fecha);
      const urlapi = `${urlRest}api/validarDiaApi`;
      fetch(urlapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID,
          "X-Client-Secret": CLIENT_SECRET,
        },
        body: JSON.stringify({
          id_elemento: id,
          fecha: fecha,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setValidateDay(data.diaValido);
          setHorariosDisponibles(data.horariosDisponibles);
        })
        .catch((error) => {
          Alert.alert(
            "Error",
            "Failed to fetch element data. Please try again later."
          );
          console.log("Error fetching element data:", error);
        });
    } else {
      Alert.alert("Error", "Invalid ID provided.");
      console.error("Invalid ID provided.");
    }
  };

  //crear reserva

  const crearReserva = () => {
    // Validar que se haya proporcionado un objeto válido para el elemento
    // if (!elemento || typeof elemento !== "object") {
    //   Alert.alert("Error", "Elemento inválido proporcionado.");
    //   console.error("Elemento inválido proporcionado.");
    //   return;
    // }

    // Separar cada variable del objeto elemento

    let row = JSON.stringify({
      fecha: selectedDate.toISOString().split("T")[0],
      id_elemento: id,
      hora_inicio: formatTime(startTime),
      hora_fin: formatTime(endTime),
      id_usuario_crea: "2",
    });
    console.log(row);

    const urlapi = `${urlRest}api/CrearReservaApi`; // Asegúrate de que esta URL sea la correcta para tu API de Laravel
    fetch(urlapi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-ID": CLIENT_ID,
        "X-Client-Secret": CLIENT_SECRET,
      },
      body: row,
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((data) => {
        Alert.alert("Éxito", "Se creó el elemento correctamente.");
        console.log("Elemento creado:", data);
        setModalVisible(false);
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "No se pudo crear el elemento. Por favor, inténtelo de nuevo más tarde."
        );
        console.log("Error al crear el elemento:", error);
      });
  };

  const handleSubmit = () => {
    validarDiaApi(selectedDate);
  };

  const detailsRef = useRef(null);

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

  const renderImage = (item) => (
    <View style={styles.imageContainer} key={item.id}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        onLoad={handleImageLoad}
      />
    </View>
  );

  const renderAvailabilityIcon = (isAvailable) => (
    <Icon
      name={isAvailable ? "check-circle" : "times-circle"}
      size={20}
      color={isAvailable ? "green" : "red"}
    />
  );

  const formatValue = (value) =>
    value != null
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : value;

  const formatTime = (time) => {
    if (time != null) {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    return time;
  };

  return (
    <View style={styles.container}>
      {loadingImages && (
        <View style={styles.imageContainer}>
          <Image
            source={require("../images/acecard.png")}
            style={styles.image}
          />
        </View>
      )}
      {images && images.length > 0 && (
        <Swiper
          style={styles.wrapper}
          loop={true}
          autoplay={true}
          autoplayTimeout={3}
          paginationStyle={{ bottom: 10 }}
        >
          {images.map(renderImage)}
        </Swiper>
      )}
      <Animatable.View
        ref={detailsRef}
        style={styles.detailsContainer}
        animation="slideInUp"
        duration={800}
        delay={200}
      >
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
                    "Lunes",
                    "Martes",
                    "Miércoles",
                    "Jueves",
                    "Viernes",
                    "Sábado",
                    "Domingo",
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
                  {formatTime(elemento.hora_inicio_disponibilidad)} -{" "}
                  {formatTime(elemento.hora_fin_disponibilidad)}
                </Text>
              </View>
              <View>
                <Button
                  title="Seleccionar"
                  onPress={() => setModalVisible(true)}
                />
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View
                      style={{
                        ...styles.modalView,
                        width: "90%",
                        maxHeight: Dimensions.get("window").height - 50,
                      }}
                    >
                      <TouchableOpacity
                        style={{ position: "relative", top: -5, right: -150 }}
                        onPress={() => setModalVisible(false)}
                      >
                        <Icon name="times" size={24} color="#000" />
                      </TouchableOpacity>
                      <View style={styles.rowContainer}>
                        <Text style={styles.label}>Fecha</Text>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            value={selectedDate.toISOString().split("T")[0]}
                            editable={false}
                          />
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.iconContainer}
                          >
                            <Icon name="calendar" size={30} color="#888" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <HorariosDisponibles horarios={horariosDisponibles} />
                      <View style={styles.timeInputsContainer}>
                        <Text style={styles.label}>Hora Inicio</Text>
                        <Text style={styles.timeInput}>
                          {formatTime(startTime)}
                        </Text>
                        <TouchableOpacity
                          style={styles.iconContainer}
                          onPress={() => setShowStartTimePicker(true)}
                        >
                          <Icon name="clock-o" size={30} color="#888" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.timeInputsContainer}>
                        <Text style={styles.label}>Hora Fin</Text>
                        <Text style={styles.timeInput}>
                          {formatTime(endTime)}
                        </Text>
                        <TouchableOpacity
                          style={styles.iconContainer}
                          onPress={() => setShowEndTimePicker(true)}
                        >
                          <Icon name="clock-o" size={30} color="#888" />
                        </TouchableOpacity>
                      </View>

                      {showDatePicker && (
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || selectedDate;
                            setShowDatePicker(false);
                            setSelectedDate(currentDate);
                            handleSubmit();
                          }}
                        />
                      )}

                      {showStartTimePicker && (
                        <DateTimePicker
                          value={startTime}
                          mode="time"
                          is24Hour={true}
                          display="clock"
                          onChange={(event, selectedTime) => {
                            if (selectedTime !== undefined) {
                              setStartTime(selectedTime);
                            }
                            setShowStartTimePicker(false);
                          }}
                        />
                      )}

                      {showEndTimePicker && (
                        <DateTimePicker
                          value={endTime}
                          mode="time"
                          is24Hour={true}
                          display="clock"
                          onChange={(event, selectedTime) => {
                            if (selectedTime !== undefined) {
                              setEndTime(selectedTime);
                            }
                            setShowEndTimePicker(false);
                          }}
                        />
                      )}

                      <TouchableOpacity
                        style={{
                          ...styles.openButton,
                          backgroundColor: "green",
                          marginTop: 20,
                        }}
                        onPress={crearReserva}
                      >
                        <Text style={styles.textStyle}>Reservar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </>
        )}
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    shadowColor: "#000",
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
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  day: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 10,
  },
  daysLabel: {
    marginRight: 5,
    fontSize: 16,
    color: "#666",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: "70%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  timeInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  timeInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },

  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  iconContainer: {
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    width: 100,
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

export default ElementoScreen;
