import {FlatList, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoPostFound from './NoPostFound';
import ToTheTopButton from './ToTheTopButton';
import {appId, CONTENT_OFFSET_THRESHOLD} from '../utils/variables';

const ListFavorites = ({navigation}) => {
  const [favoritesArray, setFavoritesArray] = useState([]);
  const {getFavoritesByUserId} = useFavorite();
  const {loadMedia} = useMedia();
  const {update} = useContext(MainContext);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);

  const fetchFavoritesByUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const favoritesData = await getFavoritesByUserId(token);
      const appMedia = await loadMedia(appId);
      const result = favoritesData.filter(f => appMedia.some(item => item.file_id === f.file_id));
      setFavoritesArray(result);
    } catch (error) {
      console.error('fetchFavoritesByUser error', error.message);
      Alert.alert('Error loading favorite posts');
    }
  };

  useEffect(() => {
    fetchFavoritesByUser();
  }, [update]);

  return (
    <>
      <FlatList
        style={styles.list}
        data={favoritesArray}
        keyExtractor={(item) => item.file_id.toString()}
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

ListFavorites.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fefefe',
    paddingVertical: 15,
  },
});

export default ListFavorites;
