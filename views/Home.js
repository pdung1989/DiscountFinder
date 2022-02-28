import React, {useContext, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import RecentButton from '../components/RecentButton';
import CategoryBox from '../components/CategoryBox';
import {MainContext} from '../contexts/MainContext';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {useMedia, useTag} from '../hooks/ApiHooks';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {uploadsUrl} from '../utils/variables';

const Home = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const onChangeSearch = (query) => setSearchQuery(query);

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View>
              <Text style={styles.headerTitle}>Welcome back,</Text>
              <Text
                style={styles.headerUser}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {user.username}
              </Text>
            </View>
            <Image
              source={{
                uri: avatar,
              }}
              style={styles.profilePic}
            />
          </View>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onIconPress={() => {
              navigation.navigate('Search', {
                category: `search_${searchQuery}`,
              });
              setUpdate(update + 1);
              setSearchQuery('');
            }}
          />
        </View>
        <ScrollView>
          <RecentButton navigation={navigation}></RecentButton>
          <Text style={styles.title}>Categories</Text>
          <View style={styles.categories}>
            <CategoryBox
              icon={require('../assets/salad.png')}
              color={'#E74F54'}
              title={'Food'}
              side={'left'}
              navigation={navigation}
            ></CategoryBox>
            <CategoryBox
              icon={require('../assets/clothes.png')}
              color={'#62BFC3'}
              title={'Clothing'}
              side={'right'}
              navigation={navigation}
            ></CategoryBox>
            <CategoryBox
              icon={require('../assets/furniture.png')}
              color={'#467599'}
              title={'Furniture'}
              side={'left'}
              navigation={navigation}
            ></CategoryBox>
            <CategoryBox
              icon={require('../assets/vacations.png')}
              color={'#F8B148'}
              title={'Vacation'}
              side={'right'}
              navigation={navigation}
            ></CategoryBox>
          </View>
        </ScrollView>
      </View>
      <FocusAwareStatusBar barStyle="dark-content" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  header: {
    paddingTop: 37,
    paddingBottom: 30,
    paddingLeft: 17,
    paddingRight: 17,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: '#efefef',
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#1D3354',
    fontSize: 28,
  },
  headerUser: {
    color: '#1D3354',
    fontWeight: '600',
    alignSelf: 'stretch',
    fontSize: 28,
    width: Dimensions.get('window').width - 90 - 17 - 17,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar: {
    marginTop: 20,
    borderRadius: 15,
    shadowOpacity: 0.1,
  },
  title: {
    marginLeft: 17,
    fontSize: 24,
    color: '#1D3354',
    fontWeight: '600',
  },
  categories: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginLeft: 17,
    marginRight: 17,
    marginTop: 12,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
