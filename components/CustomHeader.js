import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {IconButton} from 'react-native-paper';

const CustomHeader = ({navigation, header}) => {
  return (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        color="#fdfdfd"
        size={25}
        onPress={() => {
          navigation.goBack();
        }}
        style={{alignSelf: 'flex-start'}}
      />
      <Text style={styles.title}>{header}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  title: {
    alignSelf: 'center',
    fontSize: 26,
    color: '#fdfdfd',
    fontWeight: 'bold',
  },
});

export default CustomHeader;
