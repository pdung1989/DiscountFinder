import {StyleSheet} from 'react-native';
import React from 'react';
import {FAB} from 'react-native-paper';

const ToTheTopButton = ({listRef}) => {
  return (
    <FAB
      style={styles.fab}
      small={false}
      icon="arrow-up"
      onPress={() =>
        listRef.current.scrollToOffset({offset: 0, animated: true})
      }
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 24,
    backgroundColor: '#9ed8db',
  },
});

export default ToTheTopButton;
