import React from "react";
import { View, Text, FlatList, StyleSheet, Modal } from "react-native";

const HorariosDisponibles = ({ horarios, visible, onClose }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hourInt = parseInt(hours, 10);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Horarios Disponibles</Text>
      <FlatList
        data={horarios}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {formatTime(item.inicio)} - {formatTime(item.fin)}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "50%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    textAlign: "center",
    color: "blue",
    marginTop: 10,
  },
});

export default HorariosDisponibles;
