import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useForm, Controller} from 'react-hook-form';
import {Card, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';

/* This page is for modifying the post */
const ModifyPost = ({navigation, route}) => {
  const {file} = route.params;
  const {loading, putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: file.title,
      description: file.description,
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(data, token, file.file_id);

      response &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Feeds');
            },
          },
        ]);
    } catch (error) {
      console.log('onSubmit modify post problem', error.message);
      Alert.alert('Modyfying post error:', 'Error in uploading post', [
        {
          text: 'OK',
          onPress: () => {
            setValue('title', `${file.title}`);
            setValue('description', `${file.description}`);
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : ''}
        >
          <Card containerStyle={{width: '100%', margin: 0}}>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'This is required'},
                minLength: {
                  value: 3,
                  message: 'Title has to be at least 3 characters.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Title"
                  inputContainerStyle={styles.titleInput}
                  errorMessage={errors.title && errors.title.message}
                />
              )}
              name="title"
            />
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'This is required'},
                minLength: {
                  value: 3,
                  message: 'Description has to be at least 3 characters.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Description"
                  multiline
                  errorMessage={
                    errors.description && errors.description.message
                  }
                  inputContainerStyle={styles.descriptionInput}
                />
              )}
              name="description"
            />
            <Button
              loading={loading}
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

ModifyPost.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyPost;
