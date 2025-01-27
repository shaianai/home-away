import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Tab screens
import ExploreScreen from './explore';
import FavoritesScreen from './favorites';
import ProfileScreen from './profile';
import SettingsScreen from './settings';

// Shared screens
import LandlordProfile from './landlord-profile';
import HomeDetails from './home-details';
import EditAccount from './edit-account';
import LoginSecurity from './login-security';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ExploreStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen name="HomeDetails" component={HomeDetails} />
      <Stack.Screen name="LandlordProfile" component={LandlordProfile} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="HomeDetails" component={HomeDetails} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="HomeDetails" component={HomeDetails} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="LoginSecurity" component={LoginSecurity} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Explore':
              iconName = 'search';
              break;
            case 'Favorites':
              iconName = 'favorite-border';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'home';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D12E2E',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explore" component={ExploreStack} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Explore', {
              screen: 'ExploreScreen'
            });
          },
        })} />
      <Tab.Screen name="Favorites" component={FavoritesStack} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Favorites', {
              screen: 'FavoritesScreen'
            });
          },
        })} />
      <Tab.Screen name="Profile" component={ProfileStack} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Profile', {
              screen: 'ProfileScreen'
            });
          },
        })}/>
      <Tab.Screen name="Settings" component={SettingsStack} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Settings', {
              screen: 'SettingsScreen'
            });
          },
        })}/>
    </Tab.Navigator>
  );
}



