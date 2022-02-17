import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback, useContext} from 'react';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import {Card, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';
import {Video} from 'expo-av';

const Add = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [dropDownPickerValue, setDropDownPickerValue] = useState(null);
  const [image, setImage] = useState('https://place-hold.it/300&text=Image');
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const [items, setItems] = useState([
    {label: 'Food', value: 'food'},
    {label: 'Clothing', value: 'clothing'},
    {label: 'Furniture', value: 'furniture'},
    {label: 'Vacation', value: 'vacation'},
  ]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

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

  const reset = () => {
    setImage('https://place-hold.it/300&text=Image');
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
    setType('image');
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  const onSubmit = async (data) => {
    if (!imageSelected) {
      Alert.alert('Please select an image');
      return;
    }

    if (!dropDownPickerValue) {
      Alert.alert('Please select a category for your post');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);

    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, token);
      const postTagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
      );
      const categoryTagResponse = await postTag(
        {file_id: response.file_id, tag: `${appId}_${dropDownPickerValue}`},
        token
      );

      postTagResponse &&
        categoryTagResponse &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              setUpdate(update + 1);
              navigation.navigate('Browse');
            },
          },
        ]);
    } catch (error) {
      console.log('onSubmit upload image problem');
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : ''}
        >
          <Card containerStyle={{width: '100%', margin: 0}}>
            {type === 'image' ? (
              <Card.Image
                source={{uri: image}}
                style={{
                  height: 200,
                  marginHorizontal: 10,
                  marginBottom: 10,
                }}
                onPress={pickImage}
              />
            ) : (
              <Video
                source={{uri: image}}
                style={{height: 200, marginHorizontal: 10, marginBottom: 10}}
                useNativeControls={true}
                resizeMode="cover"
                onError={(err) => {
                  console.error('video', err);
                }}
              />
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Title"
                  inputContainerStyle={styles.titleInput}
                  errorMessage={errors.description && 'This is required.'}
                />
              )}
              name="title"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Description"
                  multiline
                  errorMessage={errors.description && 'This is required.'}
                  inputContainerStyle={styles.descriptionInput}
                />
              )}
              name="description"
            />
            <DropDownPicker
              open={open}
              value={dropDownPickerValue}
              items={items}
              setOpen={setOpen}
              setValue={setDropDownPickerValue}
              setItems={setItems}
              containerStyle={styles.picker}
            />
            <Button
              loading={loading}
              disabled={!imageSelected}
              mode="contained"
              color="#1D3354"
              onPress={handleSubmit(onSubmit)}
              style={{margin: 10, borderRadius: 7}}
            >
              Upload
            </Button>
          </Card>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    padding: 5,
  },

  descriptionInput: {
    height: 100,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },

  picker: {
    paddingTop: 0,
    marginHorizontal: 10,
    width: '93%',
  },
});

Add.propTypes = {
  navigation: PropTypes.object,
};

export default Add;
