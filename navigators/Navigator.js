import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Browse from '../views/Browse';
import AddPost from '../views/AddPost';
import Favorites from '../views/Favorites';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentPosts from '../views/RecentPosts';
import {MainContext} from '../contexts/MainContext';
import Login from '../views/Login';
import Register from '../views/Register';
import SuccessfulRegister from '../views/SuccessfulRegister';
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({color}) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Browse':
            iconName = 'menu-outline';
            break;
          case 'Add':
            iconName = 'add-circle-outline';
            break;
          case 'Favorites':
            iconName = 'heart-outline';
            break;
          case 'Profile':
            iconName = 'person-circle-outline';
            break;
        }
        return <Ionicons name={iconName} size={30} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}}></Tab.Screen>
      <Tab.Screen name="Browse" component={Browse}></Tab.Screen>
      <Tab.Screen name="Add" component={AddPost}></Tab.Screen>
      <Tab.Screen name="Favorites" component={Favorites}></Tab.Screen>
      <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}}></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="MainPage"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RecentPosts"
            component={RecentPosts}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="SuccessfulRegister"
            component={SuccessfulRegister}
          />
        </>
      )}
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
