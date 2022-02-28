import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Button, Overlay, Icon} from 'react-native-elements';
import {Card} from 'react-native-paper';

const PostDescription = ({text}) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Card.Content>
      <Text numberOfLines={2}>{text}</Text>

      {text.length > 100 && (
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
          accessibilityRole="button"
        >
          <Text style={{color: '#949494', fontWeight: '500'}}>Show more</Text>
        </TouchableOpacity>
      )}

      {visible && (
        <View>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Text style={styles.textSecondary}>{text}</Text>
            <Button
              title="Close"
              onPress={toggleOverlay}
              buttonStyle={{backgroundColor: '#1d3354'}}
            />
          </Overlay>
        </View>
      )}
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});

export default PostDescription;
