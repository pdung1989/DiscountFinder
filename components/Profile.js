import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LogBox,
  Alert,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import {appId, uploadsUrl} from '../utils/variables';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {
  Menu,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import ListItem from './ListItem';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

/* This view is the profile page*/
const Profile = ({route, navigation}) => {
  const {fromBottomNav, userProf} = route.params;
  const {setIsLoggedIn} = useContext(MainContext);
  const {user} = useContext(MainContext);
  const [currentUser] = useState(userProf);
  const [ownProfile, setOwnProfile] = useState(false);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const menuP = useRef();
  const [userMedia, setUserMedia] = useState([]);
  const {loadMedia} = useMedia();

  const {Popover} = renderers;
  const tag = appId;

  const fetchAvatar = async (id) => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + id);
      const avatar = avatarArray.pop();
      avatar !== undefined && setAvatar(uploadsUrl + avatar.filename);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchPosts = async (tag) => {
    try {
      let data = await loadMedia(tag);
      data = data.filter((post) => {
        return post.user_id === userProf.user_id;
      });
      setUserMedia(data);
    } catch (error) {
      console.error('fetchAllPosts error', error.message);
      Alert.alert('Error fetching posts');
    }
  };

  useEffect(() => {
    userProf.user_id == user.user_id && setOwnProfile(true);
    fetchAvatar(userProf.user_id);
    fetchPosts(tag);
  }, []);

  const closeMenu = async () => {
    await menuP.current.menuCtx.menuActions.closeMenu();
  };

  return (
    <>
      <MenuProvider ref={menuP} skipInstanceCheck={true}>
        {ownProfile ? (
          <SafeAreaView style={styles.full}>
            <View style={styles.header}>
              {fromBottomNav ? (
                <Text style={styles.title}>My Profile</Text>
              ) : (
                <View style={styles.titleWithButtonView}>
                  <Ionicons
                    style={menuStyles.settingsIcon}
                    name="arrow-back-outline"
                    size={30}
                    color="#fefefe"
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                  <Text style={styles.title}>Profile</Text>
                </View>
              )}
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
                  <TouchableOpacity
                    style={menuStyles.button}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate('Edit profile');
                    }}
                  >
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
                    <Ionicons
                      name="ios-exit-outline"
                      size={24}
                      color="#D64045"
                    />
                    <Text style={menuStyles.logoutText}>Log out</Text>
                  </TouchableOpacity>
                </MenuOptions>
              </Menu>
            </View>
            <View>
              <FlatList
                style={styles.list}
                data={userMedia}
                contentContainerStyle={{paddingBottom: 60}}
                ListHeaderComponent={
                  <View style={styles.scroll}>
                    <View style={styles.profilePhotoBackground}></View>
                    <View style={styles.content}>
                      <View style={styles.profile}>
                        <Image
                          source={{
                            uri: avatar,
                          }}
                          style={styles.profilePic}
                        />
                        <Text style={styles.username}>
                          {currentUser.username}
                        </Text>
                        <Text style={styles.fullName}>
                          {currentUser.full_name}
                        </Text>
                      </View>
                      <View style={styles.feed}></View>
                    </View>
                  </View>
                }
                keyExtractor={(item) => item.file_id.toString()}
                renderItem={({item}) => (
                  <ListItem navigation={navigation} singleMedia={item} />
                )}
              />
            </View>
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.full}>
            <View style={styles.header}>
              {fromBottomNav ? (
                <Text style={styles.title}>My Profile</Text>
              ) : (
                <View style={styles.titleWithButtonView}>
                  <Ionicons
                    style={menuStyles.settingsIcon}
                    name="arrow-back-outline"
                    size={30}
                    color="#fefefe"
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                  <Text style={styles.title}>Profile</Text>
                </View>
              )}
            </View>
            <View>
              <FlatList
                style={styles.list}
                data={userMedia}
                contentContainerStyle={{paddingBottom: 60}}
                ListHeaderComponent={
                  <View style={styles.scroll}>
                    <View style={styles.profilePhotoBackground}></View>
                    <View style={styles.content}>
                      <View style={styles.profile}>
                        <Image
                          source={{
                            uri: avatar,
                          }}
                          style={styles.profilePic}
                        />
                        <Text style={styles.username}>
                          {currentUser.username}
                        </Text>
                        <Text style={styles.fullName}>
                          {currentUser.full_name}
                        </Text>
                      </View>
                      <View style={styles.feed}></View>
                    </View>
                  </View>
                }
                keyExtractor={(item) => item.file_id.toString()}
                renderItem={({item}) => (
                  <ListItem navigation={navigation} singleMedia={item} />
                )}
              />
            </View>
          </SafeAreaView>
        )}
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginRight: 17,
    marginLeft: 17,
  },
  titleWithButtonView: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 26,
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
    marginTop: 20,
  },
  list: {
    height: '100%',
    backgroundColor: '#fefefe',
    paddingBottom: 100,
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
