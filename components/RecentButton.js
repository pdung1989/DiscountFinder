import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {EvilIcons} from '@expo/vector-icons';
import {MainContext} from '../contexts/MainContext';

const RecentButton = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        navigation.navigate('Browse', {category: 'all'});
        setUpdate(update + 1);
      }}
    >
      <Text style={styles.recentText}>Newest posts</Text>
      <EvilIcons name="arrow-right" size={40} color="#fdfdfd" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#467599',
    height: 70,
    borderRadius: 15,
    marginTop: 20,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  recentText: {
    color: '#fdfdfd',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default RecentButton;
