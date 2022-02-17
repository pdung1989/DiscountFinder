import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Card,
  Title,
  Paragraph,
  List,
  Avatar,
  Chip,
  FAB,
  IconButton,
} from 'react-native-paper';
import ListComment from '../components/ListComment';
import CommentPostForm from '../components/CommentPostForm';
import {useUser, useTag, useFavorite} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';
import {Ionicons} from '@expo/vector-icons';
import {MainContext} from '../contexts/MainContext';

const Single = ({route, navigation}) => {
  const {file} = route.params;
  const {getUserById} = useUser();
  const {convertUTCToLocalTime} = useTime();
  const {getFavoritesByFileId, postFavorite, deleteFavorite} = useFavorite();
  const [postOwner, setPostOwner] = useState({username: 'fetching...'});
  const [likes, setLikes] = useState([]);
  const [likedByUser, setLikedByUser] = useState(false);
  const {user} = useContext(MainContext);

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

  const createFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavorite(file.file_id, token);

      response && setLikedByUser(true);
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
    } catch (error) {
      console.error('removeFavorite error', error);
      setPostOwner({username: '[not available]'});
    }
  };

  useEffect(() => {
    fetchPostOwner();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [likedByUser]);

  return (
    <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : ''}>
        <SafeAreaView>
          <Card style={{position: 'relative', height: '100%'}}>
            <Card.Cover
              source={{uri: uploadsUrl + file.filename}}
              style={{height: 200}}
            />
            <View style={styles.fabRight}>
              <Ionicons name="heart-sharp" size={24} color="#d64045" />
              <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                {likes.length}
              </Text>
            </View>
            <FAB
              style={styles.fabLeft}
              small
              icon="arrow-left"
              onPress={() => navigation.navigate('Browse')}
            />
            <Card.Title
              title={file.title}
              titleStyle={styles.cardTitle}
              right={() => (
                <View style={styles.iconGroup}>
                  {likedByUser ? (
                    <IconButton
                      icon="cards-heart"
                      size={28}
                      onPress={() => {
                        removeFavorite();
                      }}
                      color="#d64045"
                    />
                  ) : (
                    <IconButton
                      icon="heart-outline"
                      size={28}
                      onPress={() => {
                        createFavorite();
                        fetchLikes();
                      }}
                    />
                  )}
                  <IconButton icon="square-edit-outline" size={28} />
                  <IconButton icon="delete" size={28} />
                </View>
              )}
            />
            <List.Item
              title={postOwner.username}
              titleStyle={{fontSize: 14, fontWeight: '500'}}
              left={() => <AvatarComponent userId={file.user_id} />}
              style={{paddingLeft: 15, paddingTop: 0}}
            />
            <Card.Content>
              <Paragraph>{file.description}</Paragraph>
              <View style={styles.tag}>
                <Chip style={{height: 30}}>Clothing</Chip>
                <Text style={{paddingTop: 7}}>
                  {convertUTCToLocalTime(file.time_added)}
                </Text>
              </View>
              <CommentPostForm fileId={file.file_id} />
              <ListComment fileId={file.file_id} />
            </Card.Content>
          </Card>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fabLeft: {
    position: 'absolute',
    margin: 16,
    backgroundColor: '#fafafa',
    top: 0,
    left: 0,
  },

  fabRight: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fafafa',
    padding: 5,
    borderRadius: 50,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  iconGroup: {
    flexDirection: 'row',
    paddingRight: 10,
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
