import React from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is for Profile Page</Text>
      <Button>Logout</Button>
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

export default Profile;
