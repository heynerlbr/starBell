import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importación corregida
import COLORS from '../constants/colors';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';

const Register = ({navigation}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleSignup = () => {
    console.log('Signup:', nombre, email, password);

    const urlapi = `${urlRest}api/RegisterMovil`; // Uso de template literals para mayor claridad
    console.log(urlapi);

    fetch(urlapi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
      },
      body: JSON.stringify({
        name: nombre,
        email,
        password,
        password_confirmation: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status === 'ok') {
          Alert.alert(
            'Registro Exitoso',
            'Se creó la cuenta de manera correcta',
            [{text: 'OK', onPress: () => navigation.navigate('LoginForm')}],
          );
        } else {
          Alert.alert('Error en el registro', data.msg || 'Hubo un error');
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API:', error);
        Alert.alert('Error', 'No se pudo conectar al servidor.');
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>¡Regístrate!</Text>
              <Text style={styles.subtitle}>¡Únete a nosotros hoy!</Text>
            </View>

            {/* Nombre completo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Ingresa nombre"
                  placeholderTextColor={COLORS.black}
                  value={nombre}
                  onChangeText={setNombre}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Ingresa email"
                  placeholderTextColor={COLORS.black}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Ingresa contraseña"
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={!isPasswordShown}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={isPasswordShown ? 'eye-off' : 'eye'}
                    size={24}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón de registro */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Registrarse</Text>
            </TouchableOpacity>

            {/* Enlace a iniciar sesión */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
              <Pressable onPress={() => navigation.navigate('LoginForm')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
  },
  inputWrapper: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.black,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  signupButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: COLORS.black,
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default Register;
