import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  LogBox,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import InteractiveTextInput from 'react-native-text-input-interactive';
import {ErrorMessage} from '@hookform/error-message';
import PassMeter from 'react-native-passmeter';

// Handle registering new users with useForm
const RegisterForm = ({navigation}) => {
  const {postUser, checkUsername} = useUser();
  const [hidden, setHidden] = useState(true);
  const [hiddenConfirm, setHiddenConfirm] = useState(true);
  const MAX_LEN = 15,
    MIN_LEN = 6,
    PASS_LABELS = ['Too Short', 'Weak', 'Normal', 'Strong', 'Secure'];

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
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

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

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
      Alert.alert('Error registering user:', 'Internal error', [
        {
          text: 'Try again',
          onPress: () => {
            setValue('username', '');
            setValue('password', '');
            setValue('confirmPassword', '');
            setValue('email', '');
            setValue('full_name', '');
          },
        },
      ]);
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
          <>
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
            <ErrorMessage
              errors={errors}
              name="username"
              render={({message}) => <Text>{message}</Text>}
            />
          </>
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 8,
            message: 'Password need to have at least 8 characters.',
          },
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message:
              'Minimum 8 characters, at least 1 uppercase character and 1 number',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <>
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
              iconImageSource={require('../assets/visibility-button.png')}
              onIconPress={() => {
                setHidden(!hidden);
              }}
            />
            <PassMeter
              showLabels
              password={value}
              maxLength={MAX_LEN}
              minLength={MIN_LEN}
              labels={PASS_LABELS}
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({message}) => <Text>{message}</Text>}
            />
          </>
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
          <>
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
              iconImageSource={require('../assets/visibility-button.png')}
              onIconPress={() => {
                setHiddenConfirm(!hiddenConfirm);
              }}
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({message}) => <Text>{message}</Text>}
            />
          </>
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
          <>
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
            <ErrorMessage
              errors={errors}
              name="email"
              render={({message}) => <Text>{message}</Text>}
            />
          </>
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
          <>
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
            <ErrorMessage
              errors={errors}
              name="full_name"
              render={({message}) => <Text>{message}</Text>}
            />
          </>
        )}
        name="full_name"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
      >
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
