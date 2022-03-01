import {FlatList, Text, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appId, baseUrl} from '../utils/variables';
import {FAB} from 'react-native-paper';
import LottieView from 'lottie-react-native';

const List = ({navigation, route}) => {
  const {category} = route.params;
  console.log('category here', category.split('_').pop());
  const {loadMedia, searchMedia} = useMedia();
  const [postArray, setPostArray] = useState([]);
  const {update, setUpdate} = useContext(MainContext);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 5;

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
        ListEmptyComponent={
          <View style={styles.notFoundContainer}>
            <LottieView
              source={require('../assets/not-found-animation.json')}
              autoPlay
              speed={2}
              style={styles.animation}
            />
            <Text style={styles.notFoundText}>No post found</Text>
          </View>
        }
      />
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <FAB
          style={styles.fab}
          small={false}
          icon="arrow-up"
          onPress={() =>
            listRef.current.scrollToOffset({offset: 0, animated: true})
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
  },
  notFoundText: {
    marginVertical: 50,
    color: '#808080',
    fontWeight: '700',
    fontSize: 16,
    padding: 10,
  },
  animation: {
    marginVertical: 50,
    width: 200,
    height: 200,
  },
  list: {
    backgroundColor: '#fefefe',
    paddingTop: 15,
    paddingBottom: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 24,
    backgroundColor: '#d8d8d8',
  },
});

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
