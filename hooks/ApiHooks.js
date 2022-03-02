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

const sortArray = (a, b) => {
  if (a.time_added > b.time_added) {
    return -1;
  }
  if (a.time_added < b.time_added) {
    return 1;
  }

  return 0;
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
  const [loading, setLoading] = useState(false);

  const getMediaById = async (fileId) => {
    return await doFetch(`${baseUrl}media/${fileId}`);
  };

  const loadMedia = async (tag) => {
    setLoading(true);

    try {
      const json = await useTag().getFilesByTag(tag);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + 'media/' + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );

      media.sort((a, b) => sortArray(a, b));
      return media;
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const result = await doFetch(baseUrl + 'media', options);
      result && setLoading(false);

      return result;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
  };

  const putMedia = async (data, token, fileId) => {
    setLoading(true);

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };

    try {
      const result = await doFetch(baseUrl + `media/${fileId}`, options);

      result && setLoading(false);
      return result;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const searchMedia = async (data, token) => {
    let result = [];
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };

    const json = await doFetch(`${baseUrl}media/search`, options);
    await Promise.all(
      json.map(async (item) => {
        const tagArray = await useTag().getAllTagsOfAFile(item.file_id);
        const filteredItem = tagArray.filter((tag) => tag.tag === appId);
        if (filteredItem.length > 0) {
          const response = await getMediaById(item.file_id);
          result.push(response);
        }
      })
    );
    return result;
  };

  return {
    loadMedia,
    postMedia,
    loading,
    deleteMedia,
    putMedia,
    getMediaById,
    searchMedia,
  };
};

const useComment = () => {
  const getCommentsByFileId = async (fileId) => {
    const comment = await doFetch(`${baseUrl}comments/file/${fileId}`);
    comment.sort((a, b) => sortArray(a, b));
    return comment;
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

    return doFetch(baseUrl + 'comments', options);
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };

    return doFetch(`${baseUrl}comments/${commentId}`, options);
  };

  return {getCommentsByFileId, postComment, deleteComment};
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

  const getAllTagsOfAFile = async (fileId) => {
    return await doFetch(`${baseUrl}tags/file/${fileId}`);
  };

  return {postTag, getFilesByTag, getAllTagsOfAFile};
};

const useFavorite = () => {
  const getFavoritesByUserId = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };

    try {
      const json = await doFetch(baseUrl + 'favourites', options);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + 'media/' + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      media.sort((a, b) => sortArray(a, b));
      return media;
    } catch (error) {
      console.error(error);
    }
  };

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

  return {
    getFavoritesByFileId,
    getFavoritesByUserId,
    postFavorite,
    deleteFavorite,
  };
};

export {useLogin, useUser, useMedia, useComment, useTag, useFavorite};
