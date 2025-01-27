import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, Modal} from 'react-native';
import { supabase } from '@/supabaseClient';
import { MainStackParamList } from './types';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';


const { width, height } = Dimensions.get('screen');
const { width: screenWidth } = Dimensions.get('screen');

interface Dorm {
    id: string;
    dorm_name: string;
    price: number;
    owner: string;
    pax: number;
    slots: number;
    location: string;
    image_url: string;
    offerings: string;
    rules: string;
    user_id: string;
  }  
  
  export default function PropertiesScreen() {
    const navigation =  useNavigation<NavigationProp<MainStackParamList>>();
    const [dorms, setDorms] = useState<Dorm[]>([]);
    const [selectedDorm, setSelectedDorm] = useState<Dorm | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
    useFocusEffect(
      React.useCallback(() => {
          fetchDorms();
      }, [])
  );
  
    const fetchDorms = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          const { data, error } = await supabase
            .from('dorms')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });
      
          if (error) {
            console.log('Fetch error:', error.message);
            return;
          }
      
          console.log('Fetched dorms:', data);
          setDorms(data || []);
        } catch (error) {
          console.log('Error:', error);
        }
    }; 

    const handleAddDorm = async (newDormData: Dorm) => {
      try {
        const { data, error } = await supabase
          .from('dorms')
          .insert([newDormData])
          .select('*')
          .single();
    
        if (error) throw error;
    
        // Update the local state immediately with the new dorm
        setDorms(prevDorms => [data, ...prevDorms]);
        
      } catch (error) {
        console.error('Error adding dorm:', error);
      }
    };    
    
    const handleDelete = async () => {
      if (!selectedDorm) return;
  
      try {
        const { error } = await supabase
          .from('dorms')
          .delete()
          .eq('id', selectedDorm.id);
  
        if (error) throw error;
  
        // Refresh the dorms list
        fetchDorms();
        setShowDeleteModal(false);
        setSelectedDorm(null);
      } catch (error) {
        console.error('Error deleting dorm:', error);
      }
    };

    const renderItem = ({ item }: { item: Dorm }) => (
    <SafeAreaView style={styles.bodyContainer}>
      <View style={styles.card}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('HomeDetails', { dorm: item })}
        >
          <Image 
            source={{ uri: item.image_url }} 
            style={styles.image}
            defaultSource={require('@/assets/images/room.jpg')}
          />
          <View style={styles.cardContainer}>
            <Text style={styles.name}>{item.dorm_name}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => {
            setSelectedDorm(item);
            setShowDeleteModal(true);
          }}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.redcontainer}>
          <Text style={styles.page}>Properties</Text>
        </View>
        <View style={styles.whitecontainer}>
          <FlatList
            data={dorms}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={renderItem}
          />
        </View>

      {/* Delete Confirmation Modal */}
        <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove this property?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      height: 40,
  },
  
  page:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },

    whitecontainer: {
        height: height * 1,
        width: width * 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        flex: 1,
    },

    bodyContainer: {
        width: (screenWidth - 40) / 2,
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
    },

    removeButton: {
      backgroundColor: '#D12E2E',
      padding: 8,
      borderRadius: 10,
      marginHorizontal: 30,
      marginBottom: 10,
    },
  
    removeButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 12,
      fontWeight: 'bold',
    },
  
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
  
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  
    modalText: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
  
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  
    modalButton: {
      padding: 10,
      borderRadius: 10,
      width: '45%',
      alignItems: 'center',
    },
  
    cancelButton: {
      backgroundColor: '#E0E0E0',
    },

    deleteButton: {
      backgroundColor: '#D12E2E',
    },
  
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
});



