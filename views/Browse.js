import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

const Browse = ({navigation, route}) => {
  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} route={route} style={styles.infoArea} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: '100%',
    paddingTop: 0,
  },
  infoArea: {
    flex: 1,
  },
});

Browse.propTypes = {
  navigation: PropTypes.object,
};

export default Browse;
