import React from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';

const AddPost= () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is for adding post</Text>
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

export default AddPost;
