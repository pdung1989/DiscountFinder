import React from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity} from 'react-native';

const SuccessfulRegister = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Register Successfully!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
      >
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

export default SuccessfulRegister;
