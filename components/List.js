import {FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appId, baseUrl} from '../utils/variables';

const List = ({navigation, route}) => {
  const {category} = route.params;
  const {loadMedia} = useMedia();
  const [postArray, setPostArray] = useState([]);
  const {update, setUpdate} = useContext(MainContext);

  const fetchAllPosts = async () => {
    let tag = '';
    if (category === 'all') {
      tag = appId;
    } else {
      tag = `${appId}_${category.toLowerCase()}`;
    }
    console.log('tag', tag.toString());
    try {
      const data = await loadMedia(tag);
      setPostArray(data);
    } catch (error) {
      console.error('fetchAllPosts error', error.message);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [update]);

  return (
    <FlatList
      data={postArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
