import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '@/supabaseClient';
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

const { width, height } = Dimensions.get('screen');

export default function EditAccount() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [fb_link, setFbLink] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, number, address, fb_link')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setPhoneNumber(data.number);
          setAddress(data.address);
          setFbLink(data.fb_link);
        }
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    number: phoneNumber,
                    address: address,
                    fb_link: fb_link,
                    email: email
                })
                .eq('id', user.id);

            if (error) throw error;

            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        }
    } catch (error) {
        console.log('Error:', error);
        Alert.alert('Error', 'Failed to update profile');
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.redcontainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Account Information</Text>
      </View>
      <View style={styles.whitecontainer}>
        <Text style={styles.subtitle}>Edit Information</Text>
        <View style={styles.editContainer}>
          <View style={styles.edit}>
            <Text style={styles.editLabel}>First Name</Text>
            <TextInput style={styles.editInfo} value={firstName} onChangeText={setFirstName} 
              placeholder='Edit First Name' placeholderTextColor="#909090"/>
                <Text style={styles.editLabel}>Last Name</Text>
            <TextInput style={styles.editInfo} value={lastName} onChangeText={setLastName}
              placeholder='Edit Last Name' placeholderTextColor="#909090"/>
                <Text style={styles.editLabel}>Email</Text>
            <TextInput style={styles.editInfo} value={email} onChangeText={setEmail}
              placeholder='Edit Email' placeholderTextColor="#909090"/>
              <Text style={styles.editLabel}>Phone Number</Text>
            <TextInput style={styles.editInfo} value={phoneNumber} onChangeText={setPhoneNumber}
              placeholder='Edit Phone Number' placeholderTextColor="#909090"/>
              <Text style={styles.editLabel}>Address</Text>
            <TextInput style={styles.editInfo} value={address} onChangeText={setAddress}
              placeholder='Edit Address' placeholderTextColor="#909090"/>
              <Text style={styles.editLabel}>Facebook Link</Text>
            <TextInput style={styles.editInfo} value={fb_link} onChangeText={setFbLink}
              placeholder='Edit Facebook Link' placeholderTextColor="#909090"/>
        <TouchableOpacity 
            style={styles.updateButton} 
            onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    backgroundColor: '#D12E2E',
  },

  redcontainer: {
    backgroundColor: '#D12E2E',
    width: width * 1,
    alignItems: 'center',
    height: 87,
    flexDirection: 'row', 
    justifyContent: 'center',
  },

  whitecontainer: {
    height: height * 1,
    width: width * 1,
    backgroundColor: '#fff',
    padding: 10,
    flex: 1,
  },

  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginTop: 45,
    textAlign: 'center',
    flex: 1,
  },

  backButton: {
    left: 30,
    marginTop: 45,
    zIndex: 10,
  },

  subtitle: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },

  editContainer: {
    alignItems: 'center'
  },

  edit: {
    marginBottom: 10,
  },

  editLabel: {
    fontSize: 14,
    left: 5,
    marginTop: 20,
    color: '#909090',
  },

  editInfo: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ADADAD',
    width: 330,
    height: 45,
    padding: 10,
    marginTop: 5,
  },

  updateButton: {
    backgroundColor: '#D12E2E',
    borderRadius: 20,
    width: 130,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 25,
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  
});
