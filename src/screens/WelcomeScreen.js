import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

const WelcomeScreen = ({navigation}) => {
  const handleLoginPress = () => {
    navigation.navigate('LoginForm');
  };

  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.icon}
          />
          <Text style={styles.title}>Bienvenido a StarBell</Text>
          <Text style={styles.subtitle}>Explora y disfruta</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
