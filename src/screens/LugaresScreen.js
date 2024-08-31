import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Button,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { urlRest, CLIENT_ID, CLIENT_SECRET } from "../api/api";

const LugaresScreen = ({ navigation }) => {
  const [queryMunicipio, setQueryMunicipio] = useState("");
  const [queryReserva, setQueryReserva] = useState("");
  const [municipiosSugeridos, setMunicipiosSugeridos] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(null);
  const [cardAnimation] = useState(new Animated.Value(0));
  const [showMunicipiosList, setShowMunicipiosList] = useState(false);
  const [reservasSugeridos, setReservasSugeridos] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const [showReservasList, setShowReservasList] = useState(false);

  useEffect(() => {
    if (selectedMunicipio !== null) {
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedMunicipio]);

  const fetchMunicipios = (query) => {
    if (query.length > 3) {
      let urlapi = urlRest + "api/buscarMunicipios";
      fetch(urlapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID,
          "X-Client-Secret": CLIENT_SECRET,
        },
        body: JSON.stringify({ textoBusqueda: query }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMunicipiosSugeridos(data.municipios);
        })
        .catch((error) => {
          console.error(
            "Error al conectar con la API para obtener municipios:",
            error
          );
        });
    }
  };

  const handleMunicipioQueryChange = (text) => {
    setQueryMunicipio(text);
    setSelectedMunicipio(null);
    setSelectedMunicipioId(null);
    fetchMunicipios(text);
    setShowMunicipiosList(text.length > 0);
  };

  const selectMunicipio = (municipioSeleccionado) => {
    setShowMunicipiosList(false);
    setSelectedMunicipio(municipioSeleccionado.municipio);
    setSelectedMunicipioId(municipioSeleccionado.id_municipio);
  };

  const renderMunicipioItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => selectMunicipio(item)}>
      <Text style={styles.itemText}>
        {item.municipio}, {item.departamento}
      </Text>
    </TouchableOpacity>
  );

  const fetchReservas = (query) => {
    if (query.length > 0) {
      let urlapi = urlRest + "api/buscarTiposResevas";
      fetch(urlapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID,
          "X-Client-Secret": CLIENT_SECRET,
        },
        body: JSON.stringify({ textoBusqueda: query }),
      })
        .then((response) => response.json())
        .then((data) => {
          setReservasSugeridos(data.reservas);
        })
        .catch((error) => {
          console.error(
            "Error al conectar con la API para obtener reservas:",
            error
          );
        });
    }
  };

  const selectReserva = (reservaSeleccionado) => {
    setSelectedReserva(reservaSeleccionado.nombre);
    setSelectedReservaId(reservaSeleccionado.id);
    setShowReservasList(false);
    setQueryReserva(reservaSeleccionado.nombre);
  };

  const renderReservaItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => selectReserva(item)}>
      <Text style={styles.itemText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const handleReservaQueryChange = (text) => {
    setQueryReserva(text);
    setSelectedReserva(null);
    setSelectedReservaId(null);
    fetchReservas(text);
    setShowReservasList(text.length > 0);
  };

  const goToNextScreen = () => {
    navigation.navigate("ListLugares", {
      municipioId: selectedMunicipioId,
      reservaId: selectedReservaId,
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/imagenes/background.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Buscar Municipio:</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe el municipio"
              value={selectedMunicipio ? selectedMunicipio : queryMunicipio}
              onChangeText={handleMunicipioQueryChange}
            />
            {showMunicipiosList && (
              <FlatList
                data={municipiosSugeridos}
                renderItem={renderMunicipioItem}
                keyExtractor={(item) => item.id_municipio.toString()}
                style={styles.list}
              />
            )}
          </View>

          <Text style={styles.label}>Buscar Reserva:</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe la reserva"
              value={queryReserva}
              onChangeText={handleReservaQueryChange}
            />
            {showReservasList && (
              <FlatList
                data={reservasSugeridos}
                renderItem={renderReservaItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              !(selectedMunicipioId && selectedReservaId) &&
                styles.disabledButton,
            ]}
            onPress={goToNextScreen}
            disabled={!(selectedMunicipioId && selectedReservaId)}
          >
            <Text style={styles.buttonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderRadius: 15,
    margin: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.black,
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  list: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default LugaresScreen;
