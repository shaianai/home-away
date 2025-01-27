import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '@/supabaseClient';
import { MainStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('screen');

type HomeDetailsRouteProp = RouteProp<MainStackParamList, 'HomeDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;


export default function HomeDetails() {
  const route = useRoute<HomeDetailsRouteProp>();
  const { dorm } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [dormDetails, setDormDetails] = useState<any>({}); // Default to an empty object to avoid null checks
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchDormDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('dorms')
          .select('*')
          .eq('id', dorm.id)
          .single();
    
        console.log('Dorm details:', data);
        if (data) {
          setDormDetails(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };    
    

    const checkFavoriteStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('dorm_id', dorm.id)
            .maybeSingle();

          setIsFavorite(!!data);
        }
      } catch (error) {
        console.log('Error checking favorite status:', error);
      }
    };

    if (dorm.id) {
      fetchDormDetails();
      checkFavoriteStatus();
    }
  }, [dorm.id]);

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      console.log('Current dorm:', dorm.id);

      if (user) {
        if (isFavorite) {
          const { data, error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('dorm_id', dorm.id);

          console.log('Delete result:', { data, error });

          if (!error) {
            setIsFavorite(false);
          }
        } else {
          const { data, error } = await supabase
            .from('favorites')
            .insert([
              {
                user_id: user.id,
                dorm_id: dorm.id,
                name: dormDetails.dorm_name
              }
            ])
            .select();

          console.log('Insert result:', { data, error });

          if (!error) {
            setIsFavorite(true);
          }
        }
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}></View>
      <View style={styles.whitecontainer}>
        <View style={styles.upperPart}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: dormDetails.image_url}} style={styles.image} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? "favorite" : "favorite-border"}
              size={30}
              color="#D12E2E"
            />
          </TouchableOpacity>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{`P${dormDetails.price?.toFixed(2)}`}</Text>
          </View>
        </View>

        <ScrollView style={styles.details}>
          <Text style={styles.homeName}>{dormDetails.dorm_name}</Text>

          <TouchableOpacity style={styles.owner}
            onPress={() => {
              console.log('Owner ID:', dormDetails.user_id);
              if (dormDetails.user_id) {
                navigation.navigate('LandlordProfile', { landlordId: dormDetails.user_id });
              }
            }}>
          <Image source={require('@/assets/images/default-profile.jpg')} style={styles.ownerImage} />
          
            <Text style={styles.ownedBy}>Owned by: </Text>
            <Text style={styles.ownerName}>{dormDetails.owner}</Text>
          
        </TouchableOpacity>    

          <Text style={styles.slots}>Good for: {dormDetails.pax}</Text>
          <Text style={styles.slots}>Available slots: {dormDetails.slots}</Text>

          <View style={styles.location}>
            <Icon name="location-on" size={20} color="#D12E2E" style={styles.icon} />
            <Text style={styles.homeAddress}>{dormDetails.location}</Text>
          </View>

          <View style={styles.horizontalLine2} />

          <Text style={styles.label}>What does this place offer?</Text>
          <View style={styles.bulletList}>
            {dormDetails.offerings?.split(',').map((item: string, index: number) => (
              <Text key={index} style={styles.amenities}>{`${item}`}</Text>
            ))}
          </View>

          <View style={styles.horizontalLine2} />

          <Text style={styles.label}>Rules and Regulations</Text>
          <View style={styles.bulletList}>
            {dormDetails.rules?.split(',').map((item: string, index: number) => (
              <Text key={index} style={styles.amenities}>{` ${item}`}</Text>
            ))}
          </View>
        </ScrollView>
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
      backgroundColor: '#D12E2E',
      width: width * 1,
      alignItems: 'center',
      height: Platform.select({
          ios: 40,
          android: 80
      }),
  },

    page: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
    },

    whitecontainer: {
        height: height * 1,
        width: width * 1,
        backgroundColor: '#fff',
        padding: 0,
        flex: 1,
        margin:0,
    },

    image: {
      width: width * 1,
      height: 280,
      shadowColor: '#000',
      shadowOffset: { width:0, height: 3 },  
      shadowOpacity: 0.4,  
      shadowRadius: 4,
  },

  upperPart: {
    alignItems: 'center',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 13,
    top: Platform.OS === 'ios' ? 15 : 32,
    padding: 8,
    zIndex: 1,
    backgroundColor: 'rgba(95, 92, 92, 0.2)',  // Semi-transparent white
    borderRadius: 20,  // Makes it circular
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  priceContainer: {
    width: 130,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 2 },  
    shadowOpacity: 0.35,  
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 260,
    position: 'absolute',
    zIndex: 1,
  },

  price: {
    fontWeight: 'bold',
    color: '#D12E2E',
    fontSize: 21,
  },

  details: {
  },

  homeName: {
    fontSize: 22,
    fontWeight: 'bold',
    left: 20,
    marginTop: 40,
    marginBottom: 15,
  },

  horizontalLine: {
    height: 1,
    backgroundColor: '#ADADAD', 
    marginVertical: 10, 
  },

  horizontalLine2: {
    height: 1,
    width: '90%',
    backgroundColor: '#ADADAD', 
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center', 
  },

  owner: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    left: 20,
  },

  ownerImage: {
    width: 60,
    height: 60,
    borderRadius: 180,
    borderWidth: 5,
    borderColor: 'white',
    position: 'absolute',
  },

  ownedBy: {
    fontSize: 16,
    marginLeft:50,
  },

  ownerName: {
    fontWeight: 'bold',
    color: '#D12E2E',
    fontSize: 16,
  },

  slots: {
    color: '#909090',
    textAlign: 'left',
    left: 30,
    marginTop: 5,
  },

  location: {
    flexDirection: 'row',
    left: 30,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },

  icon: {
    marginRight: 5,
  },

  homeAddress: {
    fontWeight: '500',
    fontStyle: 'italic',
  },

  label: {
    color: '#D12E2E',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 30,
    marginTop: 10,
  },

  bulletList: {
    marginLeft: 50,
    marginTop: 5,
    marginBottom: 15,
  },

  amenities: {
    marginVertical: 1,
    fontSize: 14,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

