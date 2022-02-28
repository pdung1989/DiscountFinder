import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import CustomHeader from '../components/CustomHeader';

const Filter = ({navigation, route}) => {
  const {category} = route.params;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader navigation={navigation} header={category} />
        <List navigation={navigation} route={route} style={styles.infoArea} />
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
    paddingTop: 0,
  },
  infoArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  title: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 26,
    color: '#fdfdfd',
    fontWeight: 'bold',
  },
});

Filter.propTypes = {
  navigation: PropTypes.object,
};

export default Filter;
