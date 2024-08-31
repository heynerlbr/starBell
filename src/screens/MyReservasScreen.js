import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { urlRest, CLIENT_ID, CLIENT_SECRET } from "../api/api";
import Icon from "react-native-vector-icons/FontAwesome";
import SweetAlert from "react-native-sweet-alert";

const ElementoScreen = ({ route, navigation }) => {
  const [reservas, setReservas] = useState([]);

  const cancelarReserva = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas cancelar la reserva?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => cancelarReservaConfirmada(id),
        },
      ],
      { cancelable: false }
    );
  };

  const cancelarReservaConfirmada = (id) => {
    const urlapi = `${urlRest}api/CancelarReservaApi`;
    console.log(urlapi);
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
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Tipo === "success") {
          fetchMyReservas();
        }
      })
      .catch((error) => {
        console.log("Error fetching element data:", error);
      });
  };

  const verDetalle = (item) => {
    navigation.navigate("MyDetalleReserva", {
      reserva: item,
      id: item.id_elemento,
    });
  };

  const fetchMyReservas = () => {
    const urlapi = `${urlRest}api/obtenerMisReservasApi`;
    console.log(urlapi);
    fetch(urlapi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-ID": CLIENT_ID,
        "X-Client-Secret": CLIENT_SECRET,
      },
      body: JSON.stringify({
        id: 2,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setReservas(data.reservas);
      })
      .catch((error) => {
        console.log("Error fetching element data:", error);
      });
  };

  useEffect(() => {
    fetchMyReservas();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Icon name="map-marker" size={20} color="#007bff" />
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.text}>{item.nombreLugar}</Text>
        </View>
        <View style={styles.column}>
          <Icon name="clock-o" size={20} color="#007bff" />
          <Text style={styles.label}>Hora inicio:</Text>
          <Text style={styles.text}>{item.hora_inicio}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Icon name="calendar" size={20} color="#007bff" />
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.text}>{item.fecha}</Text>
        </View>
        <View style={styles.column}>
          <Icon name="clock-o" size={20} color="#007bff" />
          <Text style={styles.label}>Hora fin:</Text>
          <Text style={styles.text}>{item.hora_fin}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Icon name="map-marker" size={20} color="#007bff" />
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.text}>{item.direccionLugar}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.verDetalleButton]}
          onPress={() => verDetalle(item)}
        >
          <Text style={styles.buttonText}>Ver Detalle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelarReservaButton]}
          onPress={() => cancelarReserva(item.id)}
        >
          <Text style={styles.buttonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/imagenes/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Mis Reservas</Text>
        <FlatList
          data={reservas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007bff",
  },
  itemContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#007bff",
  },
  text: {
    textAlign: "center",
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "45%", // Ajustar el ancho de los botones para evitar que se toquen
    elevation: 2,
  },
  verDetalleButton: {
    backgroundColor: "#007bff",
  },
  cancelarReservaButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default ElementoScreen;
