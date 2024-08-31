import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { urlRest, CLIENT_ID, CLIENT_SECRET } from "../api/api";
const ListLugaresScreen = ({ route, navigation }) => {
  const [lugares, setLugares] = useState([]);
  const [municipioId, setMunicipioId] = useState(null);
  const [reservaId, setReservaId] = useState(null);

  useEffect(() => {
    const { municipioId, reservaId } = route.params;
    setMunicipioId(municipioId);
    setReservaId(reservaId);
    fetchObjectsWithIds(municipioId, reservaId);
  }, [route.params]);

  const fetchObjectsWithIds = (municipioId, reservaId) => {
    if (municipioId && reservaId) {
      let urlapi = `${urlRest}api/obtenerlugaresFiltrados`;
      fetch(urlapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID,
          "X-Client-Secret": CLIENT_SECRET,
        },
        body: JSON.stringify({
          idMunicipio: municipioId,
          idTipoReserva: reservaId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLugares(data.lugaresFiltrados);
        })
        .catch((error) => {
          console.error(
            "Error al conectar con la API para obtener objetos:",
            error
          );
        });
    } else {
      console.error("Los IDs proporcionados no son válidos.");
    }
  };

  const handleItemPress = (id) => {
    navigation.navigate("ListElementos", {
      municipioId: municipioId,
      reservaId: reservaId,
      lugarId: id,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item.id)}
      style={styles.itemContainer}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemAddress}>{item.direccion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/imagenes/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <FlatList
          data={lugares}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  itemContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemAddress: {
    fontSize: 16,
    color: "#666",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default ListLugaresScreen;
