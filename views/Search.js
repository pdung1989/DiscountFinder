import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import CustomHeader from '../components/CustomHeader';

const Search = ({navigation, route}) => {
  const {category} = route.params;
  const searchterm = category.split('_')[1].toLowerCase();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader
          navigation={navigation}
          header={`Search: ${searchterm}`}
        />
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
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
