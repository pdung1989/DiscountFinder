import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import {uploadsUrl} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';
import {Dimensions} from 'react-native';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const Profile = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();

  const {Popover} = renderers;

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <>
      <MenuProvider
        style={styles.container}
        customStyles={{backdrop: styles.backdrop}}
      >
        <SafeAreaView style={styles.full}>
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <Menu renderer={Popover} rendererProps={{placement: 'bottom'}}>
              <MenuTrigger>
                <Ionicons
                  style={menuStyles.settingsIcon}
                  name="settings-outline"
                  size={30}
                  color="#fefefe"
                />
              </MenuTrigger>
              <MenuOptions style={menuStyles.menuOptions}>
                <TouchableOpacity style={menuStyles.button} onPress={() => {
                  navigation.navigate('Edit profile');
                }}>
                  <FontAwesome
                    name="pencil-square-o"
                    size={24}
                    color="#1D3354"
                  />
                  <Text style={menuStyles.settingsText}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={menuStyles.button}
                  onPress={async () => {
                    await AsyncStorage.clear();
                    setIsLoggedIn(false);
                  }}
                >
                  <Ionicons name="ios-exit-outline" size={24} color="#D64045" />
                  <Text style={menuStyles.logoutText}>Log out</Text>
                </TouchableOpacity>
              </MenuOptions>
            </Menu>
          </View>
          <ScrollView style={styles.scroll}>
            <View style={styles.profilePhotoBackground}></View>
            <View style={styles.content}>
              <View style={styles.profile}>
                <Image
                  source={{
                    uri: avatar,
                  }}
                  style={styles.profilePic}
                />
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.fullName}>{user.full_name}</Text>
              </View>
              <View style={styles.feed}></View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </MenuProvider>
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
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginRight: 17,
    marginLeft: 17,
  },
  title: {
    fontSize: 30,
    color: '#fdfdfd',
    fontWeight: 'bold',
  },
  profilePhotoBackground: {
    height: 70,
    backgroundColor: '#1D3354',
  },
  scroll: {
    backgroundColor: '#fefefe',
  },
  profile: {
    alignItems: 'center',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: 'relative',
    top: -60,
  },
  username: {
    color: '#1D3354',
    fontWeight: '600',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 26,
    marginTop: -50,
  },
  fullName: {
    color: '#1D3354',
    paddingLeft: 17,
    paddingRight: 17,
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
  },
  feed: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },
});

const menuStyles = StyleSheet.create({
  settingsIcon: {
    padding: 5,
    paddingTop: 0,
  },
  menuOptions: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  settingsText: {
    color: '#1D3354',
    paddingLeft: 12,
    fontSize: 14,
  },
  logoutText: {
    color: '#D64045',
    paddingLeft: 12,
    fontSize: 14,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
