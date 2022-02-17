import {FlatList, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Card, List, Paragraph} from 'react-native-paper';
import {useUser, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';

const CommentItem = ({singleCommment}) => {
  const {getUserById} = useUser();
  const [commentOwner, setCommentOwner] = useState({username: 'fetching...'});
  const {convertUTCToLocalTime} = useTime();

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

  useEffect(() => {
    fetchCommentOwner();
  }, []);

  return (
    <List.Item
      title={commentOwner.username}
      titleStyle={{fontSize: 14, fontWeight: '500'}}
      description={singleCommment.comment}
      left={() => <AvatarComponent userId={singleCommment.user_id} />}
      right={() => (
        <Text
          style={{
            position: 'absolute',
            top: 7,
            right: 0,
          }}
        >
          {convertUTCToLocalTime(singleCommment.time_added)}
        </Text>
      )}
      style={{padding: 5}}
    />
  );
};

export default CommentItem;
