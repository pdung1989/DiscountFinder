import {FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFavorite, useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray}
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
