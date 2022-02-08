import React from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Register</Text>
      <RegisterForm />
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

export default Register;
