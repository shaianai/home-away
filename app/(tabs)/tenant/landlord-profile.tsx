import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image, ImageBackground, TouchableOpacity, Platform, Linking} from 'react-native';
import { supabase } from '@/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from './types';

const { width, height } = Dimensions.get('screen');

type LandlordProfileRouteProp = RouteProp<MainStackParamList, 'LandlordProfile'>;

export default function LandlordProfile() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [fb_link, setFbLink] = useState('');
    const navigation = useNavigation();
    const route = useRoute<LandlordProfileRouteProp>();
    const { landlordId } = route.params;

  const fetchLandlordProfile = async () => {
    try {
        console.log('Fetching with landlordId:', landlordId);
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                first_name,
                last_name,
                email,
                number,
                address,
                fb_link,
                kindofuser
            `)
            .eq('id', landlordId)
            .eq('kindofuser', 'landlord')
            .single();

        console.log('Fetched data:', data);

        if (data) {
            const fullName = `${data.first_name} ${data.last_name}`;
            setFullName(fullName);
            setPhoneNumber(data.number);
            setAddress(data.address);
            setEmail(data.email);
            setFbLink(data.fb_link);
        }
    } catch (error) {
        console.log('Error fetching landlord profile:', error);
    }
};



useEffect(() => {
    fetchLandlordProfile();

    const subscription = supabase
        .channel('profile-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'profiles'
            },
            (payload) => {
                fetchLandlordProfile();
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}, []);

  const openFacebookLink = () => {
            if (fb_link) {
                Linking.openURL(fb_link);
            }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.page}>Profile</Text>
      </View>
      <View style={styles.whitecontainer}>
        <ImageBackground source={require('@/assets/images/default-profile.jpg')} blurRadius={10} style={styles.imageBlur} />
        <Image source={require('@/assets/images/default-profile.jpg')} style={styles.profilePicture} />
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.role}>Landlord</Text>

        <View style={styles.landlordInfo}>
          <View style={styles.rowInfo}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.infoText}>{phoneNumber}</Text>
          </View>

          <View style={styles.horizontalLine2} />

          <View style={styles.rowInfo}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.infoText}>{address}</Text>
          </View>

          <View style={styles.horizontalLine2} />

          <View style={styles.rowInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.infoText}>{email}</Text>
          </View>
          <View style={styles.horizontalLine2} />

          <TouchableOpacity onPress={openFacebookLink} style={styles.rowInfo}>
              <Text style={styles.label}>Facebook: </Text>
                  <Text style={[styles.infoText, { color: '#4267B2', textDecorationLine: 'underline' }]}>
                        {fb_link || 'Not linked'}
                  </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D12E2E',
  },
  redcontainer: {
    ...Platform.select({
      ios: {
        backgroundColor: '#D12E2E',
        width: width * 1,
        alignItems: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
      },
      android: {
        backgroundColor: '#D12E2E',
        width: width * 1,
        alignItems: 'center',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
      },
    })
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'ios' ? 0 : 25,
    padding: 8,
    zIndex: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 25,
    fontSize: 16,
  },
  whitecontainer: {
    height: height * 1,
    width: width * 1,
    backgroundColor: '#fff',
    padding: 0,
    flex: 1,
    margin: 0,
  },
  imageBlur: {
    width: width * 1,
    height: 270,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 180,
    borderWidth: 5,
    borderColor: 'white',
    position: 'absolute',
    marginTop: 210,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D12E2E',
    marginTop: 60,
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
  horizontalLine2: {
    height: 1,
    width: '100%',
    backgroundColor: '#ADADAD',
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
  landlordInfo: {
    width: width * 0.9,
    alignSelf: 'center',
    marginTop: 20,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
