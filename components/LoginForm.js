import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {MainContext} from '../contexts/MainContext';
import {useLogin} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InteractiveTextInput from 'react-native-text-input-interactive';

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [hidden, setHidden] = useState(true);
  const {postLogin} = useLogin();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const userData = await postLogin(data);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      setError(true);
      error.message === 'Authentication failed due bad password' ||
      error.message === 'Authentication failed due bad username'
        ? setErrorMessage('Incorrect username or password')
        : setErrorMessage(error.message);
      Alert.alert('Error:', `${errorMessage}`, [
        {
          text: 'OK',
          onPress: () => {
            setError(false);
          },
        },
      ]);
      console.log('login error', errorMessage);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InteractiveTextInput
            textInputStyle={styles.input}
            animatedPlaceholderTextColor={'#1D3354'}
            mainColor={'#467599'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Username"
          />
        )}
        name="username"
      />
      {errors.username && <Text>This is required.</Text>}

      <Controller
        style={styles.input}
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InteractiveTextInput
            textInputStyle={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            animatedPlaceholderTextColor={'#1D3354'}
            mainColor={'#467599'}
            value={value}
            autoCapitalize="none"
            secureTextEntry={hidden}
            placeholder="Password"
            enableIcon
            iconContainerStyle={styles.icon}
            iconImageSource={require('../assets/visibility-button.png')}
            onIconPress={() => {
              setHidden(!hidden);
            }}
          />
        )}
        name="password"
      />
      {errors.password && <Text>This is required.</Text>}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    width: '100%',
  },
  icon: {
    height: 50,
    paddingRight: 10,
    paddingLeft: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    right: 6,
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: '#467599',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  loginText: {
    fontWeight: '500',
    fontSize: 24,
    color: '#fefefe',
  },
});

export default LoginForm;
