import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import GlobalSyles from '../utils/GlobalSyles';

/* This view shows a list of all posts*/
const Browse = ({navigation, route}) => {
  return (
    <>
      <SafeAreaView style={(GlobalSyles.AndroidSafeArea, styles.container)}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse</Text>
        </View>
        <List navigation={navigation} route={route} />
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
    paddingTop: 10,
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

Browse.propTypes = {
  navigation: PropTypes.object,
};

export default Browse;
