import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { supabase } from '@/supabaseClient';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useMemo } from 'react';

const { width, height } = Dimensions.get('screen');

export default function ExploreScreen() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [dorms, setDorms] = useState<any[]>([]);

  const filteredDorms = useMemo(() => 
    dorms.filter(dorm => 
      dorm.dorm_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dorm.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dorm.price.toString().includes(searchQuery)
    ), 
    [dorms, searchQuery]
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // This prevents the back action
    });

    const fetchDorms = async () => {
      try {
        const { data, error } = await supabase.from('dorms').select('*');
        if (error) {
          console.error('Error fetching dorms:', error.message);
          return;
        }
        setDorms(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchDorms();

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search your home" 
          placeholderTextColor="#909090" 
          value={searchQuery} 
          onChangeText={setSearchQuery}
        />
      </View>
      <SafeAreaView style={styles.whitecontainer}>
        <View style={styles.listContainer}>
          <FlatList
            data={filteredDorms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('HomeDetails', { dorm: item })}
              >
                <Image source={{uri: item.image_url}} style={styles.image} />
                <View style={styles.cardContainer}>
                  <Text style={styles.name}>{item.dorm_name}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.pax}>Good for: {item.pax}</Text>
                  <Text style={styles.slots}>Available slots: {item.slots}</Text>
                  <Text style={styles.price}>{`P${item.price.toFixed(2)}`}</Text>
                </View>
              </TouchableOpacity>
            )}

        // shows no results found
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )}

            ListFooterComponent={<View style={styles.footerSpace} />}
          />
        </View>
      </SafeAreaView>
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
        height: 70,
       },
       android: {
        backgroundColor: '#D12E2E',
        width: width * 1,
        alignItems: 'center',
        height: 110,
        paddingTop: 20,
       },
     })
    
  },

  whitecontainer: {
    height: height * 1,
    width: width * 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },

  searchBar: {
    backgroundColor: '#fff',
    width: '70%',
    height: '50%',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 0,
    paddingLeft: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  listContainer: {
    flex: 1,
  },

  card: {
    backgroundColor: '#fff',
    width: 300,
    height: 250,
    marginBottom: 5,
    marginTop: 20,
    marginHorizontal: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    paddingBottom: 5,
  },

  image: {
    width: '100%',
    height: '60%',
  },

  cardContainer: {
    padding: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    position: 'absolute',
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    right: 10,
    bottom: 10,
  },

  location: {
    fontSize: 12,
    color: 'black',
    fontStyle: 'italic',
  },

  pax: {
    fontSize: 10,
    color: 'gray',
    marginTop: 15,
  },

  slots: {
    fontSize: 10,
    color: 'gray',
  },

  footerSpace: {
    height: 20,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
