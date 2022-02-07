import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Browse from '../views/Browse';
import AddPost from '../views/AddPost';
import Favorites from '../views/Favorites';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentPosts from '../views/RecentPosts';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen name="Browse" component={Browse}></Tab.Screen>
      <Tab.Screen name="Add" component={AddPost}></Tab.Screen>
      <Tab.Screen name="Favorites" component={Favorites}></Tab.Screen>
      <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainPage"
        component={TabScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RecentPosts"
        component={RecentPosts}
        options={{headerShown: false}}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
