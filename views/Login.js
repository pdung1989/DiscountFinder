import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
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
      console.log('chekToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
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
        <View style={styles.header}></View>
        <View style={styles.content}>
          <Text style={styles.loginTitle}>Login</Text>
          <LoginForm />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Register</Text>
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
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 2,
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
  registerButton: {
    marginTop: 35,
    backgroundColor: '#467599',
    width: 140,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  registerText: {
    fontWeight: '500',
    fontSize: 24,
    color: '#fefefe',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
