import React, {useContext} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {StatusBar} from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";

const Profile = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };
  return (
    <>
      <SafeAreaView style={styles.full}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.profile}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnzCc4_HnkhhWPouqsYT42QDguYx2Qwjzrlg&usqp=CAU',
              }}
              style={styles.profilePic}
            />
            <Text style={styles.username}>username</Text>
          </View>
        </View>
        <View style={styles.content}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="ios-eye-outline" size={30} color="#1D3354" />
            <Text style={styles.settingsText}>View profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="pencil-square-o" size={30} color="#1D3354" />
            <Text style={styles.settingsText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="key-outline" size={30} color="#1D3354" />
            <Text style={styles.settingsText}>Change password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Ionicons name="ios-exit-outline" size={30} color="#D64045" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <FocusAwareStatusBar barStyle="light-content" />
    </>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#1D3354',
  },
  header: {
    height: 190,
    marginLeft: 17,
    marginTop: 20,
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  username: {
    color: '#fdfdfd',
    paddingLeft: 15,
    fontSize: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingTop: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 34,
    color: '#fdfdfd',
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    width: '100%',
    paddingLeft: 17,
    marginBottom: 12,
  },
  settingsText: {
    color: '#1D3354',
    paddingLeft: 12,
    fontSize: 16,
  },
  logoutText: {
    color: '#D64045',
    paddingLeft: 12,
    fontSize: 16,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;

/*
import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Button title={'Logout'} onPress={logout} />
    </SafeAreaView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
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
*/
