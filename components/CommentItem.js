import {
  FlatList,
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {Card, List, Paragraph, IconButton} from 'react-native-paper';
import {useUser, useTag, useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';
import {MainContext} from '../contexts/MainContext';
import InteractiveTextInput from 'react-native-text-input-interactive';
import {ErrorMessage} from '@hookform/error-message';

const CommentItem = ({navigation, singleCommment}) => {
  const {getUserById} = useUser();
  const {deleteComment} = useComment();
  const [commentOwner, setCommentOwner] = useState({username: 'fetching...'});
  const {convertUTCToLocalTime} = useTime();
  const {user} = useContext(MainContext);
  const {commentUpdate, setCommentUpdate} = useContext(MainContext);

  const fetchCommentOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(singleCommment.user_id, token);
      setCommentOwner(userData);
    } catch (error) {
      console.error('fetchCommentOwner error ', error.message);
      setCommentOwner({username: '[not available]'});
    }
  };

  const removeComment = async () => {
    Alert.alert('Delete', 'This comment will be deleted permanently.', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteComment(
              singleCommment.comment_id,
              token
            );
            response && setCommentUpdate(commentUpdate + 1);
          } catch (error) {
            console.error(error);
            Alert.alert('Error:', 'Deleting comment failed');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCommentOwner();
  }, []);

  return (
    <Card mode="elevated" style={{margin: 5}} elevation={2}>
      <Card.Title
        title={commentOwner.username}
        titleStyle={{fontSize: 14, fontWeight: '500', marginLeft: -15}}
        left={() => (
          <TouchableOpacity
            onPress={() => {
              navigation.push('Profile', {
                navigation: navigation,
                fromBottomNav: false,
                userProf: commentOwner,
              });
            }}
          >
            <AvatarComponent userId={singleCommment.user_id} />
          </TouchableOpacity>
        )}
        right={() => (
          <>
            <Text
              style={{
                marginTop: -27,
                paddingRight: 7,
              }}
            >
              {convertUTCToLocalTime(singleCommment.time_added)}
            </Text>
            {commentOwner.user_id === user.user_id && (
              <IconButton
                icon="delete"
                size={25}
                style={{position: 'absolute', right: 0, marginTop: -11}}
                onPress={() => {
                  removeComment();
                }}
              />
            )}
          </>
        )}
      />
      <Card.Content>
        <Text>{singleCommment.comment}</Text>
      </Card.Content>
    </Card>
  );
};

export default CommentItem;
