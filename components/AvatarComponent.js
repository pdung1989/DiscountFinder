import React, {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {Avatar} from 'react-native-paper';
import {uploadsUrl} from '../utils/variables';

const AvatarComponent = ({userId}) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/200/300');

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userId);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error('fetchAvatar error ', error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return <Avatar.Image size={32} source={{uri: avatar}} />;
};

export default AvatarComponent;
