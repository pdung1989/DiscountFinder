import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Browse from '../views/Browse';
import Add from '../views/Add';
import Favorites from '../views/Favorites';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import {MainContext} from '../contexts/MainContext';
import Login from '../views/Login';
import Register from '../views/Register';
import SuccessfulRegister from '../views/SuccessfulRegister';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      activeColor="#4B88A2"
      barStyle={{backgroundColor: '#FFFFFF'}}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Ionicons name="md-home-outline" color={color} size={26} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Browse"
        component={Browse}
        options={{
          headerShown: false,
          tabBarLabel: 'Browse',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="menu" color={color} size={26} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          headerShown: false,
          tabBarLabel: 'Add',
          tabBarIcon: ({color}) => (
            <Ionicons name="add-circle-outline" color={color} size={26} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerShown: true,
          tabBarLabel: 'Favorite',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="heart-outline"
              color={color}
              size={26}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={26}
            />
          ),
        }}
      ></Tab.Screen>
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
          {/* <Stack.Screen
            name="List"
            component={TabScreen}
            options={{headerTransparent: true, headerShown: false}}
          ></Stack.Screen> */}
          <Stack.Screen
            name="Single"
            component={Single}
            options={{headerShown: false}}
          ></Stack.Screen>
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
