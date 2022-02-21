import {View, Alert, StyleSheet} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment} from '../hooks/ApiHooks';
import {TextInput} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';

const CommentPostForm = ({navigation, fileId}) => {
  const {postComment} = useComment(fileId);
  const {commentUpdate, setCommentUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({defaultValues: {comment: ''}});

  const reset = () => {
    setValue('comment', '');
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  const onSubmit = async (comment) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!comment.comment.trim()) {
        return;
      }

      const response = await postComment(
        {file_id: fileId, comment: comment.comment},
        token
      );
      response &&
        Alert.alert('Comment', 'uploaded', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              setCommentUpdate(commentUpdate + 1);
            },
          },
        ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 1,
            message: 'Please write something before sending.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Write a comment"
            right={
              <TextInput.Icon
                name="send"
                onPress={handleSubmit(onSubmit)}
                style={{paddingTop: 7}}
              />
            }
            errorMessage={errors.comment && errors.comment.message}
            style={styles.commentInputBox}
          ></TextInput>
        )}
        name="comment"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentInputBox: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 38,
  },
});

CommentPostForm.propTypes = {
  navigation: PropTypes.object,
};

export default CommentPostForm;
