import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, RefreshControl} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { supabase } from '@/supabaseClient';

const { width, height } = Dimensions.get('screen');
const { width: screenWidth } = Dimensions.get('screen');

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            *,
            dorms:dorm_id (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setFavorites(data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (dormId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dorm_id', dormId);

        if (error) throw error;
        fetchFavorites();
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.redcontainer}>
        <Text style={styles.page}>Favorites</Text>
      </View>
      <View style={styles.whitecontainer}>
        <FlatList
            key={'two-column'}
            numColumns={2}
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              width: '100%', 
            }}
            columnWrapperStyle={{ justifyContent: 'flex-start', width: '100%' }}
            ListEmptyComponent={() => (
              <View style={styles.emptyFavorites}>
                <Text style={styles.emptyText}>No favorites yet.</Text>
              </View>
            )}
            renderItem={({ item }) => (
            <SafeAreaView style={styles.bodyContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('HomeDetails', { dorm: item.dorms })}
            >
              <TouchableOpacity
                onPress={() => removeFavorite(item.dorm_id)}
                style={styles.xButton}
              >
                <Text style={styles.xText}>×</Text>
              </TouchableOpacity>
              <Image 
                source={{ uri: item.dorms.image_url, headers: { Accept: '*/*' }, cache: 'force-cache'}} 
                style={styles.image} />
              
                <Text style={styles.name}>{item.dorms.dorm_name}</Text>
            </TouchableOpacity>
          </SafeAreaView>
          )}
        />
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
        height: 88,
    },
    
    page:{
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 57,
        fontSize: 16,
    },

    whitecontainer: {
        height: height * 1,
        width: width * 1,
        backgroundColor: 'white',
        padding: 10,
        flex: 1,
    },

  bodyContainer: {
      width: (screenWidth - 40) / 2,
      justifyContent: 'flex-start',
  },

  card: { 
      backgroundColor: '#fff', 
      height: 200,
      flex: 1,
      borderRadius: 20,
      margin: 8,
      shadowColor: '#000',
      shadowOffset: { width:0, height: 3 },  
      shadowOpacity: 0.25,  
      shadowRadius: 1,
  },

    image: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    cardContainer: {
        padding: 10,
        alignItems: 'center',
    },

    name: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center',
        marginTop: 5,
        padding: 5,
    },

    button: {
        backgroundColor: '#D12E2E',
        width: 90,
        height: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },

    textButton: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
    },

    removeButton: {
      backgroundColor: '#D12E2E',
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 5,
    },

    removeText: {
      color: '#fff',
    },

    xButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    xText: {
      color: '#D12E2E',
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 20,
    },

    emptyFavorites: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
      height: '100%', 
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
    }

});


