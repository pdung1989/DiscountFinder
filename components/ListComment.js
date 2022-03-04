import {FlatList, View, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useComment} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';
import {MainContext} from '../contexts/MainContext';
import {Card, Text} from 'react-native-paper';

const ListComment = ({fileId}) => {
  const {getCommentsByFileId} = useComment();
  const [comments, setComments] = useState([]);
  const {commentUpdate, setCommentUpdate} = useContext(MainContext);
  const [error, setError] = useState(false);

  const fetchComments = async () => {
    try {
      const commentsData = await getCommentsByFileId(fileId);
      setComments(commentsData);
    } catch (error) {
      console.error('fetchComments error', error.message);
      setError(true);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [commentUpdate]);

  return (
    <Card.Content>
      {comments.length < 2 ? (
        <Text style={styles.commentTitle}>{comments.length} comment</Text>
      ) : (
        <Text style={styles.commentTitle}>{comments.length} comments</Text>
      )}
      {error ? (
        <Text>Can't load comments</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.comment_id.toString()}
          initialNumToRender={10}
          renderItem={({item}) => <CommentItem singleCommment={item} />}
          removeClippedSubviews={true}
        />
      )}
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  commentTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 10,
    paddingTop: 7,
  },
});

ListComment.propTypes = {
  fileId: PropTypes.number,
};

export default ListComment;
