import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Card,
  Paragraph,
  List,
  Chip,
  IconButton,
  ActivityIndicator,
  Title,
} from 'react-native-paper';
import {Video} from 'expo-av';
import ListComment from '../components/ListComment';
import CommentPostForm from '../components/CommentPostForm';
import {useUser, useFavorite, useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';
import {Ionicons} from '@expo/vector-icons';
import {MainContext} from '../contexts/MainContext';
import PostDescription from '../components/PostDescription';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import LottieView from 'lottie-react-native';

const Single = ({route, navigation}) => {
  const {file} = route.params;
  const videoRef = useRef(null);
  const {getUserById} = useUser();
  const {convertUTCToLocalTime} = useTime();
  const {getFavoritesByFileId, postFavorite, deleteFavorite} = useFavorite();
  const [postOwner, setPostOwner] = useState({username: 'fetching...'});
  const [likes, setLikes] = useState([]);
  const [likedByUser, setLikedByUser] = useState(false);
  const {user, update, setUpdate} = useContext(MainContext);
  const {getAllTagsOfAFile} = useTag();
  const [tag, setTag] = useState('Other');
  const {deleteMedia} = useMedia();

  const fetchPostOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(file.user_id, token);
      setPostOwner(userData);
    } catch (error) {
      console.error('fetchPostOwner error ', error.message);
      setPostOwner({username: '[not available]'});
    }
  };

  const fetchLikes = async () => {
    try {
      const likesData = await getFavoritesByFileId(file.file_id);
      setLikes(likesData);
      likesData.forEach((like) => {
        like.user_id === user.user_id && setLikedByUser(true);
      });
    } catch (error) {
      console.error('fetchLikes error', error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const tags = await getAllTagsOfAFile(file.file_id);
      const tag = tags.pop().tag.split('_').pop();
      setTag(tag);
    } catch (error) {
      console.error('fetchTags', error);
      setTag('Other');
    }
  };

  const createFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavorite(file.file_id, token);

      response && setLikedByUser(true);
      setUpdate(update + 1);
    } catch (error) {
      console.error('createFavorite error', error);
      setPostOwner({username: '[not available]'});
    }
  };

  const removeFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavorite(file.file_id, token);

      response && setLikedByUser(false);
      setUpdate(update + 1);
    } catch (error) {
      console.error('removeFavorite error', error);
      setPostOwner({username: '[not available]'});
    }
  };

  // delete post
  const deletePost = () => {
    Alert.alert('Delete', 'Do you want to delete?', [
      {text: 'No'},
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(token, file.file_id);
            console.log('delete', deletePost);
            response && setUpdate(update + 1);
            navigation.navigate('Browse');
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchPostOwner();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [likedByUser]);

  return (
    <>
      <SafeAreaView>
        <Card style={{height: '100%'}}>
          <View style={{maxHeight: '70%'}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
              <TouchableOpacity
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
              >
                <Card.Title
                  title={file.title}
                  titleNumberOfLines={2}
                  titleStyle={styles.cardTitle}
                  left={() => (
                    <IconButton
                      icon="arrow-left"
                      onPress={() => navigation.goBack()}
                    />
                  )}
                  right={() => (
                    <View style={styles.iconGroup}>
                      {likedByUser ? (
                        <IconButton
                          icon="cards-heart"
                          size={25}
                          onPress={() => {
                            removeFavorite();
                          }}
                          color="#d64045"
                        />
                      ) : (
                        <IconButton
                          icon="heart-outline"
                          size={25}
                          onPress={() => {
                            createFavorite();
                            fetchLikes();
                          }}
                        />
                      )}

                      {file.user_id === user.user_id && (
                        <>
                          <IconButton
                            icon="square-edit-outline"
                            size={25}
                            onPress={() =>
                              navigation.navigate('Modify Post', {file})
                            }
                          />
                          <IconButton
                            icon="delete"
                            size={25}
                            onPress={() => deletePost()}
                          />
                        </>
                      )}
                    </View>
                  )}
                />
                {file.media_type === 'image' ? (
                  <Card.Cover
                    source={{uri: uploadsUrl + file.filename}}
                    style={{height: 200}}
                    PlaceholderContent={
                      <ActivityIndicator animating={true} color="#d64045" />
                    }
                  />
                ) : (
                  <>
                    <Video
                      ref={videoRef}
                      style={{height: 200}}
                      source={{
                        uri: uploadsUrl + file.filename,
                      }}
                      posterSource={{
                        uri: uploadsUrl + file.screenshot,
                      }}
                      useNativeControls={true}
                      isLooping
                      resizeMode="center"
                      onError={(error) => {
                        console.error('<Video> error', error);
                      }}
                    ></Video>
                  </>
                )}
                <View style={styles.fabRight}>
                  <Ionicons name="heart-sharp" size={16} color="#d64045" />
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {likes.length}
                  </Text>
                </View>
                <List.Item
                  title={postOwner.username}
                  titleStyle={{fontSize: 14, fontWeight: '500'}}
                  left={() => <AvatarComponent userId={file.user_id} />}
                  style={{paddingLeft: 15, paddingTop: 5}}
                  onPress={() => {
                    navigation.push('Profile', {
                      navigation: navigation,
                      fromBottomNav: false,
                      userProf: postOwner,
                    });
                  }}
                />
                <PostDescription text={file.description}></PostDescription>
                <Card.Content style={styles.tag}>
                  <Chip style={{height: 30}}>{tag}</Chip>
                  <Text style={{paddingTop: 7}}>
                    {convertUTCToLocalTime(file.time_added)}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
            </KeyboardAvoidingView>
            <CommentPostForm fileId={file.file_id} />
          </View>
          <View style={{maxHeight: '40%'}}>
            <ListComment fileId={file.file_id} />
          </View>
        </Card>
      </SafeAreaView>
      <FocusAwareStatusBar barStyle="dark-content" />
    </>
  );
};

const styles = StyleSheet.create({
  fabRight: {
    flexDirection: 'row',
    position: 'absolute',
    top: 280,
    right: 16,
    padding: 5,
    borderRadius: 50,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  iconGroup: {
    flexDirection: 'row',
    alignContent: 'center',
  },

  tag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },

  commentTitle: {fontSize: 16, fontWeight: '700', padding: 5},
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
