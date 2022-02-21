import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ListFavorites from '../components/ListFavorites';
import PropTypes from 'prop-types';

const Favourites = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ListFavorites navigation={navigation} style={styles.infoArea} />
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

Favourites.propTypes = {
  navigation: PropTypes.object,
};

export default Favourites;
