import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import COLORS from '../constants/colors';
import {urlRest, CLIENT_ID, CLIENT_SECRET} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext'; // Asegúrate de ajustar la ruta

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const {loginA} = useContext(AuthContext); // Usa el contexto

  const handleLogin = async () => {
    try {
      const urlapi = `${urlRest}api/LoginMovil`; // Uso de template literals para mayor claridad
      console.log(username);

      const response = await fetch(urlapi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);

      if (data.token) {
        userProfile = data.user;
        await AsyncStorage.setItem('authToken', data.token); // Guardar token
        console.log('Login exitoso');
        loginA(data.user); // Actualiza el contexto con el usuario autenticado
        navigation.navigate('Perfil'); // Navegar a la pantalla del perfil
      } else if (data.error && data.status === 'error') {
        // Mostrar alert para credenciales inválidas
        Alert.alert(
          'Error de inicio de sesión',
          'Las credenciales ingresadas no coinciden',
          [{text: 'OK'}],
        );
      } else {
        console.log('Error en el login', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/imagenes/background.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>¡Hola! ¡Bienvenido de nuevo! 👋</Text>
          <Text style={styles.subheading}>
            ¡Hola de nuevo, te hemos extrañado!
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Ingresa tu email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordInput}>
              <TextInput
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={styles.toggleButton}>
                <Ionicons
                  name={isPasswordShown ? 'eye-off' : 'eye'}
                  size={24}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : undefined}
            />
            <Text style={styles.checkboxLabel}>Recuérdame</Text>
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>¿No tengo una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signupText, styles.signupLink]}>
                Registro
              </Text>
            </TouchableOpacity>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.black,
  },
  input: {
    color: 'black',
    height: 40,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 5,
  },
  toggleButton: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginVertical: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
    color: COLORS.black,
  },
  signupLink: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: COLORS.primary,
  },
});

export default Login;
