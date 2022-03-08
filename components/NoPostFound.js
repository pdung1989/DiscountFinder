import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const NoPostFound = () => {
  return (
    <View style={styles.notFoundContainer}>
      <LottieView
        source={require('../assets/empty-searching.json')}
        autoPlay
        loop
        speed={2}
        style={styles.animation}
      />
      <Text style={styles.notFoundText}>No post found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notFoundContainer: {
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
    width: '100%',
  },
  notFoundText: {
    color: '#cdcdcd',
    fontWeight: '700',
    fontSize: 20,
    padding: 10,
  },
  animation: {
    marginVertical: 50,
    width: 300,
    height: 300,
  },
});

export default NoPostFound;
