import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigations/Navigation";

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
