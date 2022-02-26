import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ListFavorites from '../components/ListFavorites';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

const Favourites = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <ListFavorites navigation={navigation} style={styles.infoArea} />
      </SafeAreaView>
      <FocusAwareStatusBar barStyle="light-content" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1D3354',
    height: '100%',
  },
  infoArea: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: '#1D3354',
    justifyContent: 'center',
    paddingTop: 15,
    marginBottom: 15,
  },
  title: {
    marginLeft: 17,
    fontSize: 26,
    color: '#fdfdfd',
    fontWeight: 'bold',
  },
});

Favourites.propTypes = {
  navigation: PropTypes.object,
};

export default Favourites;
