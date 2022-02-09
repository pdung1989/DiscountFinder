import {FlatList, View, StyleSheet, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useComment} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

const ListComment = ({fileId}) => {
  const {getCommentsByFileId} = useComment();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const commentsData = await getCommentsByFileId(fileId);
      setComments(commentsData);
    } catch (error) {
      console.error('fetchComments error', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <View style={{height: 190, marginTop: 7}}>
      <Text style={styles.commentTitle}>{comments.length} comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.comment_id.toString()}
        renderItem={({item}) => <CommentItem singleCommment={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentTitle: {fontSize: 16, fontWeight: '700', paddingBottom: 5},
});

ListComment.propTypes = {
  fileId: PropTypes.number,
};

export default ListComment;
