import React, {useContext, useState} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {IconButton, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import InteractiveTextInput from 'react-native-text-input-interactive';

const EditProfile = ({navigation}) => {
  const {checkUsername, putUser} = useUser();
  const {user, setUser} = useContext(MainContext);
  const [hidden, setHidden] = useState(true);
  const [hiddenConfirm, setHiddenConfirm] = useState(true);
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      password: '',
      confirmPassword: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  // edit profile information
  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUser(data);
        navigation.navigate(back);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // change password
  const onSubmitPassword = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUser(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

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
        <SafeAreaView style={styles.full}>
          <View style={styles.title}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
              color={'#fefefe'}
            />
            <Title style={styles.titleText}>Edit Profile</Title>
          </View>
        </SafeAreaView>
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.customLabel}>Username</Text>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'This is required.'},
                minLength: {
                  value: 3,
                  message: 'Username has to be at least 3 characters.',
                },
                validate: async (value) => {
                  try {
                    const available = await checkUsername(value);
                    if (available || user.username === value) {
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
            <Text style={styles.customLabel}>Email</Text>
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
            <Text style={styles.customLabel}>Full name</Text>
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
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.loginText}>Submit</Text>
            </TouchableOpacity>
            <Text style={styles.customLabel}>Password</Text>
            <Controller
              control={control}
              rules={{
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
                  enableIcon
                  iconContainerStyle={styles.icon}
                  iconImageSource={require('../assets/visibility-button.png')}
                  onIconPress={() => {
                    setHidden(!hidden);
                  }}
                  errorMessage={errors.password && errors.password.message}
                />
              )}
              name="password"
            />

            <Text style={styles.customLabel}>Confirm Password</Text>
            <Controller
              control={control}
              rules={{
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
                  animatedPlaceholderTextColor={'#1D3354'}
                  mainColor={'#467599'}
                  onBlur={onBlur}
                  onChangeText={onChange}
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
              )}
              name="confirmPassword"
            />
            <TouchableOpacity
              style={styles.passwordButton}
              onPress={handleSubmit(onSubmitPassword)}
            >
              <Text style={styles.loginText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <FocusAwareStatusBar barStyle="light-content" />
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

EditProfile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  full: {
    width: '100%',
    backgroundColor: '#1D3354',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fefefe',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: '#fefefe',
  },
  content: {
    paddingTop: 10,
    backgroundColor: '#fefefe',
    height: '100%',
  },
  customLabel: {
    color: '#1D3354',
    marginLeft: 17,
    marginTop: 5,
  },
  input: {
    marginBottom: 10,
    marginLeft: 17,
    marginRight: 17,
  },
  icon: {
    height: 70,
    paddingRight: 25,
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
    width: 140,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  passwordButton: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#467599',
    width: 220,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  loginText: {
    fontWeight: '500',
    fontSize: 20,
    color: '#fefefe',
  },
});

export default EditProfile;
