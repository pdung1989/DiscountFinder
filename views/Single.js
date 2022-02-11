import React, {useEffect, useState} from 'react';
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
} from 'react-native-paper';
import ListComment from '../components/ListComment';
import CommentPostForm from '../components/CommentPostForm';
import {useUser, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '../components/AvatarComponent';
import {useTime} from '../hooks/helpersHooks';

const Single = ({route, navigation}) => {
  const {file} = route.params;
  const {getUserById} = useUser();
  const {convertUTCToLocalTime} = useTime();
  const [postOwner, setPostOwner] = useState({username: 'fetching...'});

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

  useEffect(() => {
    fetchPostOwner();
  }, []);

  return (
    <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : ''}>
        <SafeAreaView>
          <Card style={{position: 'relative', height: '100%'}}>
            <Card.Cover
              source={{uri: uploadsUrl + file.filename}}
              style={{height: 200}}
            />
            <FAB
              style={styles.fabRight}
              small
              icon="heart-outline"
              onPress={() => console.log('Pressed')}
            />
            <FAB
              style={styles.fabLeft}
              small
              icon="arrow-left"
              onPress={() => navigation.navigate('Browse')}
            />
            <Card.Content>
              <Title style={styles.cardTitle}>{file.title}</Title>
              <List.Item
                title={postOwner.username}
                titleStyle={{fontSize: 14, fontWeight: '500'}}
                left={() => <AvatarComponent userId={file.user_id} />}
              />
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
    backgroundColor: '#ffffff',
    top: 0,
    left: 0,
  },

  fabRight: {
    position: 'absolute',
    margin: 16,
    backgroundColor: '#ffffff',
    top: 0,
    right: 0,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
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
