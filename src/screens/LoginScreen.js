import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import COLORS from '../constants/colors';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = () => {
    console.log('Iniciar sesión:', username, password);
    navigation.navigate('Perfil');
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

          <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>¿No tengo una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
