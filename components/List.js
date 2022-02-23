import {FlatList, Text, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appId, baseUrl} from '../utils/variables';

const List = ({navigation, route}) => {
  const {category} = route.params;
  console.log('category', category.split('_').pop());
  const {loadMedia, searchMedia} = useMedia();
  const [postArray, setPostArray] = useState([]);
  const {update, setUpdate} = useContext(MainContext);

  const fetchAllPosts = async (tag) => {
    try {
      const data = await loadMedia(tag);
      setPostArray(data);
    } catch (error) {
      console.error('fetchAllPosts error', error.message);
    }
  };

  const searchItem = async (tag) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = await searchMedia({title: tag, description: tag}, token);
      setPostArray(data);
    } catch (error) {
      console.error('searchItem error', error.message);
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
      {postArray.length === 0 && (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>No post found</Text>
        </View>
      )}
      <FlatList
        data={postArray}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
  },
  notFoundText: {
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
    padding: 10,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
