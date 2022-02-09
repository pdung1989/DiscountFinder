import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import RegisterForm from '../components/RegisterForm';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { Ionicons } from "@expo/vector-icons";

const Register = ({navigation}) => {
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
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.headerButton}
          onPress={() => {
            navigation.goBack();
          }}>
            <Ionicons name={'arrow-back-outline'} size={40} color={'#1D3354'} />
          </TouchableOpacity>
        </SafeAreaView>
        <ScrollView style={styles.content}>
          <Text style={styles.loginTitle}>Sign Up</Text>
          <RegisterForm />
        </ScrollView>
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
    width: '100%',
    height: 150,
  },
  headerButton: {
    width: 50,
    height: 50,
    marginTop: 17,
    marginLeft: 17,
    borderRadius: 50,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 4,
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
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#fefefe',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#467599',
    borderRadius: 10,
    alignSelf: 'center',
  },
  registerText: {
    fontWeight: '500',
    fontSize: 24,
    color: '#467599',
  },
});
Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
