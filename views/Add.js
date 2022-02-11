import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {IconButton, TextInput, Title} from 'react-native-paper';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import {Card} from 'react-native-elements';

const Add = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [image, setImage] = useState('https://place-hold.it/300&text=Image');
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const [items, setItems] = useState([
    {label: 'Food', value: 'food'},
    {label: 'Clothing', value: 'clothing'},
    {label: 'Furniture', value: 'furniture'},
    {label: 'Vacation', value: 'vacation'},
  ]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  return (
    <SafeAreaView>
      <Card style={styles.container}>
        <View style={styles.title}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              navigation.navigate('Browse');
            }}
          />
          <Title>Add a new post</Title>
        </View>
        <Card.Image source={{uri: image}} onPress={pickImage} />
        <TextInput label="title" mode="outlined" style={styles.textInput} />
        <TextInput
          label="description"
          mode="outlined"
          multiline={true}
          style={styles.textInput}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={{
            marginTop: 10,
            borderRadius: 3,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        />
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
  },
});

Add.propTypes = {
  navigation: PropTypes.object,
};

export default Add;
