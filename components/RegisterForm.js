import React, { useState } from 'react';
import {View, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import InteractiveTextInput from 'react-native-text-input-interactive';

// Handle registering new users with useForm
const RegisterForm = ({navigation}) => {
  const {postUser, checkUsername} = useUser();
  const [hidden, setHidden] = useState(true);
  const [hiddenConfirm, setHiddenConfirm] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      const userData = await postUser(data);
      console.log('register onSubmit', userData);
      if (userData) {
        navigation.navigate('SuccessfulRegister');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              if (available) {
                return true;
              } else {
                return 'Username is already taken.';
              }
            } catch (error) {
              throw new Error(error.message);
            }
          },
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
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 5,
            message: 'Password has to be at least 5 characters.',
          },
          /*
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message: 'Min 8, Uppercase, Number',
          },
          */
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
            secureTextEntry={hidden}
            placeholder="Password"
            errorMessage={errors.password && errors.password.message}
            enableIcon
            iconContainerStyle={styles.icon}
            iconImageSource={require("../assets/visibility-button.png")}
            onIconPress={() => {setHidden(!hidden)}}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: true,
          required: {value: true, message: 'This is required.'},
          validate: (value) => {
            const {password} = getValues();
            if (value === password) {
              return true;
            } else {
              return 'Passwords do not match.';
            }
          },
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
            secureTextEntry={hiddenConfirm}
            placeholder="Confirm Password"
            enableIcon
            iconContainerStyle={styles.icon}
            iconImageSource={require("../assets/visibility-button.png")}
            onIconPress={() => {setHiddenConfirm(!hiddenConfirm)}}
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value: /\S+@\S+\.\S+$/,
            message: 'Has to be valid email.',
          },
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
            placeholder="Email"
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Full name has to be at least 3 characters.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InteractiveTextInput
            textInputStyle={styles.input}
            animatedPlaceholderTextColor={'#1D3354'}
            mainColor={'#467599'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="Full name"
            errorMessage={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.loginText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
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
    marginBottom: 15,
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

export default RegisterForm;
