import {Alert, StyleSheet, Keyboard} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment} from '../hooks/ApiHooks';
import {Card, HelperText, TextInput} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';

const CommentPostForm = ({navigation, fileId}) => {
  const {postComment} = useComment(fileId);
  const {commentUpdate, setCommentUpdate} = useContext(MainContext);
  const [comment, setComment] = useState('');

  const hasError = () => {
    return comment.length < 3;
  };

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
              Keyboard.dismiss();
              reset();
              setCommentUpdate(commentUpdate + 1);
            },
          },
        ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error:', 'Uploading comment failed');
    }
  };

  return (
    <Card.Content>
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Comments need to has at least 3 characters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <>
            <TextInput
              mode="flat"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Write a comment"
              right={
                <TextInput.Icon
                  name="send"
                  onPress={handleSubmit(onSubmit)}
                  style={{marginEnd: 0}}
                />
              }
              activeUnderlineColor="#1D3354"
              errorMessage={errors.comment && errors.comment.message}
              style={styles.commentInputBox}
            ></TextInput>
            {errors.comment && (
              <HelperText type="error">{errors.comment.message}</HelperText>
            )}
          </>
        )}
        name="comment"
      />
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  commentInputBox: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 40,
    marginBottom: 5,
    paddingBottom: 3,
  },
});

CommentPostForm.propTypes = {
  navigation: PropTypes.object,
};

export default CommentPostForm;
