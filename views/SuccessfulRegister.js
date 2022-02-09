import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

const SuccessfulRegister = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLoader
        visible={true}
        source={require('../assets/check.json')}
        animationStyle={styles.lottie}
        speed={0.6}
        loop={false}
      >
        <Text style={styles.registerText}>Registration successful!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </AnimatedLoader>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D3354',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  registerText: {
    fontWeight: '500',
    fontSize: 36,
    color: '#fefefe',
    marginHorizontal: 17,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#467599',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  continueText: {
    fontWeight: '500',
    fontSize: 24,
    color: '#fefefe',
  },
});

export default SuccessfulRegister;
