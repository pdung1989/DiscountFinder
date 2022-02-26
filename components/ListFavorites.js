import {FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListFavorites = ({navigation}) => {
  const [favoritesArray, setFavoritesArray] = useState([]);
  const {getFavoritesByUserId} = useFavorite();
  const {update} = useContext(MainContext);

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
    <FlatList
      style={styles.list}
      data={favoritesArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
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
