import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import COLORS from "../constants/colors";
import { urlRest, CLIENT_ID, CLIENT_SECRET } from "../api/api";
const ListElementosScreen = ({ route, navigation }) => {
  const [elementos, setElementos] = useState([]);
  const { municipioId, reservaId, lugarId } = route.params;

  useEffect(() => {
    fetchElementos();
  }, []);

  const fetchElementos = () => {
    if (municipioId && reservaId && lugarId) {
      const urlapi = `${urlRest}api/obtenerElementosFiltrados`;
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
          idLugar: lugarId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setElementos(data.elementosFiltrados);
        })
        .catch((error) => {
          console.log(
            "Error al conectar con la API para obtener objetos elementos:",
            error
          );
        });
    } else {
      console.error("Los IDs proporcionados no son válidos.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item.id)}
      style={styles.itemContainer}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        {item.url_imagen && (
          <Image
            source={{ uri: item.url_imagen }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (id) => {
    navigation.navigate("ElementoView", { id: id });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/imagenes/background.png")}
        style={styles.backgroundImage}
      >
        <FlatList
          data={elementos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
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
  itemImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default ListElementosScreen;
