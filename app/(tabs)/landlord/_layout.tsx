import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import UploadScreen from './upload'; // Landlord-specific Explore screen
import SettingsLScreen from './settingsL';
import PropertiesScreen from './properties';
import { ProfileLScreen } from './profileL';

import HomeDetails from './home-details';
import EditAccount from './edit-account';
import LoginSecurity from './login-security';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ExploreLScreenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="upload" component={UploadScreen} />
    </Stack.Navigator>
  );
}

function PropertiesStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="PropertiesMain" component={PropertiesScreen} />
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
      <Stack.Screen name="SettingsMain" component={SettingsLScreen} />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="LoginSecurity" component={LoginSecurity} />
    </Stack.Navigator>
  );
}

export default function LandlordNavigator() {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string;
              switch (route.name) {
                case 'Upload':
                  iconName = 'add-box';
                  break;
                case 'Properties':
                  iconName = 'apartment';
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
          <Tab.Screen name="Upload" component={UploadScreen} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Upload', {
              screen: 'UploadScreen'
            });
          },
        })} />
          <Tab.Screen name="Properties" component={PropertiesStack} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Properties', {
              screen: 'PropertiesScreen'
            });
          },
        })}/>
          <Tab.Screen name="Profile" component={ProfileLScreen} listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Profile', {
              screen: 'ProfileLScreen'
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