import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useTime} from '../hooks/helpersHooks';

const ListItem = ({navigation, singleMedia}) => {
  const {convertUTCToLocalTime} = useTime();

  return (
    <Card
      mode="elevated"
      style={styles.row}
      onPress={() => {
        navigation.push('Single', {file: singleMedia});
      }}
    >
      <Card.Cover source={{uri: uploadsUrl + singleMedia.thumbnails.w160}} />
      <Card.Content>
        <Title style={{fontWeight: '900', fontSize: 25}}>
          {singleMedia.title}
        </Title>
        <Paragraph>{convertUTCToLocalTime(singleMedia.time_added)}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#888888',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
