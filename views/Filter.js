import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import CustomHeader from '../components/CustomHeader';
import GlobalSyles from '../utils/GlobalSyles';

/* This view shows posts relating to each category */
const Filter = ({navigation, route}) => {
  const {category} = route.params;

  return (
    <>
      <SafeAreaView style={(GlobalSyles.AndroidSafeArea, styles.container)}>
        <View style={styles.container}>
          <CustomHeader navigation={navigation} header={category} />
          <List navigation={navigation} route={route} />
        </View>
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
