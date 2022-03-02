import {FlatList, StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import LottieView from 'lottie-react-native';

const ListFavorites = ({navigation}) => {
  const [favoritesArray, setFavoritesArray] = useState([]);
  const {getFavoritesByUserId} = useFavorite();
  const {update} = useContext(MainContext);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 5;
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

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
            <LottieView
              source={require('../assets/community-image.json')}
              autoPlay
              style={styles.animation}
            />
            <Text style={styles.notFoundText}>No favorite posts</Text>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 24,
    backgroundColor: '#d8d8d8',
  },
});

export default ListFavorites;
