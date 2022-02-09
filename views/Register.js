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
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";

const Register = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Card>
          <Card.Title h4>Register</Card.Title>
          <Card.Divider />
          <RegisterForm />
        </Card>
      </View>
      <FocusAwareStatusBar barStyle="light-content" />
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
