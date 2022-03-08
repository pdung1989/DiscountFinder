import {FlatList, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appId} from '../utils/variables';
import {Alert} from 'react-native';
import NoPostFound from './NoPostFound';
import ToTheTopButton from './ToTheTopButton';
import {CONTENT_OFFSET_THRESHOLD} from '../utils/variables';

const List = ({navigation, route}) => {
  const {category} = route.params;
  const {loadMedia, searchMedia} = useMedia();
  const [postArray, setPostArray] = useState([]);
  const {update} = useContext(MainContext);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);

  const fetchAllPosts = async (tag) => {
    try {
      const data = await loadMedia(tag);
      setPostArray(data);
    } catch (error) {
      console.error('fetchAllPosts error', error.message);
      Alert.alert('Error fetching posts');
    }
  };

  const searchItem = async (tag) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = await searchMedia({title: tag, description: tag}, token);
      setPostArray(data);
    } catch (error) {
      console.error('searchItem error', error.message);
      Alert.alert('Error searching posts');
    }
  };

  useEffect(() => {
    let tag = appId;
    if (
      category === 'Food' ||
      category === 'Furniture' ||
      category === 'Clothing' ||
      category === 'Vacation'
    ) {
      tag = `${appId}_${category.toLowerCase()}`;
      fetchAllPosts(tag);
    } else if (category.split('_')[0] === 'search') {
      tag = category.split('_').pop().trim();
      searchItem(tag);
    } else {
      fetchAllPosts(tag);
    }
  }, [update]);

  return (
    <>
      <FlatList
        style={styles.list}
        data={postArray}
        keyExtractor={(item) => item.file_id.toString()}
        initialNumToRender={10}
        ref={listRef}
        onScroll={(event) => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
        renderItem={({item}) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
        ListEmptyComponent={<NoPostFound />}
      />
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <ToTheTopButton listRef={listRef} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fefefe',
    paddingTop: 15,
    paddingBottom: 15,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
