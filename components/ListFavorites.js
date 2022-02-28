import {FlatList, StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';

const ListFavorites = ({navigation}) => {
  const [favoritesArray, setFavoritesArray] = useState([]);
  const {getFavoritesByUserId} = useFavorite();
  const {update} = useContext(MainContext);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 5;

  const fetchFavoritesByUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const favoritesData = await getFavoritesByUserId(token);
      setFavoritesArray(favoritesData);
    } catch (error) {
      console.error('fetchFavoritesByUser error', error.message);
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
        ListEmptyComponent={
          <View style={styles.notFoundContainer}>
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

ListFavorites.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fefefe',
    paddingVertical: 15,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  notFoundText: {
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 24,
    backgroundColor: '#d8d8d8',
  },
});

export default ListFavorites;
