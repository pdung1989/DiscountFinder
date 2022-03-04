import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

const Login = ({navigation}) => {
  // props is needed for navigation
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  // check token when the app starts
  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token value in async storage', userToken);
    if (!userToken) {
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Authentication error: ', `${error.message}`, [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.content}>
          <Text style={styles.loginTitle}>Login</Text>
          <LoginForm />
          <Text style={styles.noAccountText}>Don't have an account yet?</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Sign up here</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <FocusAwareStatusBar barStyle="light-content" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D3354',
  },
  header: {
    flex: 2,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '50%',
    resizeMode: 'contain',
  },
  content: {
    flex: 3,
    width: '100%',
    paddingLeft: 17,
    paddingRight: 17,
    backgroundColor: '#fefefe',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loginTitle: {
    fontSize: 30,
    color: '#1D3354',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  noAccountText: {
    color: '#1D3354',
    marginTop: 40,
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#fefefe',
    width: 150,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  registerText: {
    fontWeight: '500',
    fontSize: 18,
    color: '#467599',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
