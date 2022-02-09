import React from 'react';
import {StyleSheet, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';

const RecentPosts = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is for recent posts</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

RecentPosts.propTypes = {
  navigation: PropTypes.object,
};

export default RecentPosts;
