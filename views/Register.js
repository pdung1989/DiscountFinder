import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RegisterForm from '../components/RegisterForm';
import PropTypes from 'prop-types';
import {Card} from 'react-native-elements';

const Register = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Card>
          <Card.Title h4>Register</Card.Title>
          <Card.Divider />
          <RegisterForm />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>Login</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    flex: 8,
  },
});

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
