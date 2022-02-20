import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl} from '../utils/variables';

// fetch data from endpoint
const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// create useLogin hook for handling login
const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    return await doFetch(baseUrl + 'login', options);
  };

  return {postLogin};
};

// useUser hook to handle user token
const useUser = () => {
  // get user token when login
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'users/user', options);
  };

  // add new user
  const postUser = async (data) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'users', options);
  };

  // check user name if it is already used
  const checkUsername = async (username) => {
    const result = await doFetch(baseUrl + 'users/username/' + username);
    return result.available;
  };

  const getUserById = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}users/${userId}`, options);
  };

  // edit user
  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(`${baseUrl}users`, options);
  };

  // edit password
  const putPassword = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(`${baseUrl}users`, options);
  };

  return {
    getUserByToken,
    postUser,
    checkUsername,
    getUserById,
    putUser,
    putPassword,
  };
};

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update} = useContext(MainContext);
  const loadMedia = async (start = 0, limit = 10) => {
    try {
      const json = await useTag().getFilesByTag(appId);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + 'media/' + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );

      setMediaArray(media);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);

  const postMedia = async (formData, token) => {
    setLoading(true);

    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };

    const result = await doFetch(baseUrl + 'media', options);
    result && setLoading(false);

    return result;
  };

  // delete post
  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + `media/${fileId}`, options);
  }

  return {mediaArray, postMedia, loading, deleteMedia};
};

const useComment = () => {
  const getCommentsByFileId = async (fileId) => {
    return await doFetch(`${baseUrl}comments/file/${fileId}`);
  };

  const postComment = async (comment, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(comment),
    };
    console.log('comment body', options.body);
    return doFetch(baseUrl + 'comments', options);
  };

  return {getCommentsByFileId, postComment};
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(tagData),
    };
    return await doFetch(baseUrl + 'tags/', options);
  };

  const getFilesByTag = async (tag) => {
    return await doFetch(baseUrl + 'tags/' + tag);
  };
  return {postTag, getFilesByTag};
};

const useFavorite = () => {
  const getFavoritesByFileId = async (fileId) => {
    return await doFetch(`${baseUrl}favourites/file/${fileId}`);
  };

  const postFavorite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    return await doFetch(`${baseUrl}favourites`, options);
  };

  const deleteFavorite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}favourites/file/${fileId}`, options);
  };

  return {getFavoritesByFileId, postFavorite, deleteFavorite};
};

export {useLogin, useUser, useMedia, useComment, useTag, useFavorite};
