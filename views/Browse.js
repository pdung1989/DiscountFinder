import React, {useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

/* This view shows a list of all posts*/
const Browse = ({navigation, route}) => {
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 500;
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse</Text>
        </View>
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
    height: '100%',
    paddingTop: 0,
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

Browse.propTypes = {
  navigation: PropTypes.object,
};

export default Browse;
