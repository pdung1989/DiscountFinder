import {FlatList, Text, View, Alert} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {Card, List, Paragraph, IconButton} from 'react-native-paper';
import {useUser, useTag, useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';
import {MainContext} from '../contexts/MainContext';

const CommentItem = ({singleCommment}) => {
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
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCommentOwner();
  }, []);

  return (
    <List.Item
      title={commentOwner.username}
      titleStyle={{fontSize: 14, fontWeight: '500'}}
      description={
        <View style={{alignSelf: 'center'}}>
          <Text>{singleCommment.comment}</Text>
        </View>
      }
      left={() => <AvatarComponent userId={singleCommment.user_id} />}
      right={() => (
        <>
          <Text
            style={{
              position: 'absolute',
              //top: 7,
              right: 0,
            }}
          >
            {convertUTCToLocalTime(singleCommment.time_added)}
          </Text>
          {commentOwner.user_id === user.user_id && (
            <IconButton
              icon="delete"
              size={25}
              style={{marginTop: 15}}
              onPress={() => {
                removeComment();
              }}
            />
          )}
        </>
      )}
      style={{padding: 5}}
    />
  );
};

export default CommentItem;
