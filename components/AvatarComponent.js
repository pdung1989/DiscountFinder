import React, {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {Avatar} from 'react-native-paper';
import {uploadsUrl} from '../utils/variables';
import {TouchableOpacity} from 'react-native';

const AvatarComponent = ({navigation, userId}) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg');

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
