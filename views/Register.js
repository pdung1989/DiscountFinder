import React from 'react';
import {StyleSheet, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-web';
import RegisterForm from '../components/RegisterForm';
import PropTypes from 'prop-types';

const Register = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Register</Text>
      <RegisterForm />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
