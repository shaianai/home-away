import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, Dimensions, KeyboardAvoidingView, 
        Modal, TouchableOpacity, Animated, PanResponder, TouchableWithoutFeedback, TextInput, Platform, Easing} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '@/supabaseClient';
import { MainStackParamList } from './types';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('screen');

type HomeDetailsRouteProp = RouteProp<MainStackParamList, 'HomeDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function HomeDetails() {
  const route = useRoute<HomeDetailsRouteProp>();
  const { dorm } = route.params;
  const [dormDetails, setDormDetails] = useState(dorm);
  const [price, setPrice] = useState('');
  const [dorm_name, setDormName] = useState('');
  const [pax, setPax] = useState('');
  const [slots, setSlots] = useState('');
  const [location, setLocation] = useState('');
  const [offerings, setOfferings] = useState('');
  const [rules, setRules] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const modalSlide = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchDormDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('dorms')
          .select('*')
          .eq('id', dorm.id)
          .limit(1)
          .single();

          if (data) {
            setDormName(data.dorm_name);
            setPrice(data.price);
            setPax(data.pax);
            setSlots(data.slots);
            setLocation(data.location);
            setOfferings(data.offerings);
            setRules(data.rules);
          }

        if (error) {
          console.error('Error fetching dorm details:', error.message);
          return;
        }
        setDormDetails(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };
    
    fetchDormDetails();
  }, [dorm.id]);

  const handleSaveChanges = async () => {
    try {
      const { error } = await supabase
        .from('dorms')
        .update({
          dorm_name: dorm_name,
          price: price,
          pax: pax,
          slots: slots,
          location: location,
          offerings: offerings,
          rules: rules,
        })
        .eq('id', dorm.id);

      if (error) {
        Alert.alert('Error', 'Failed to save changes');
        console.error(error);
        return;
      }

      closeEditModal();

      Alert.alert('Success', 'Changes saved successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const openEditModal = () => {
    setIsEditModalVisible(true);
    Animated.timing(modalSlide, {
      toValue: 0, // Slide to the top
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEditModal = () => {
    Animated.timing(modalSlide, {
      toValue: height, // Slide back off-screen
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Ensure the modal is hidden only after the animation completes
      setIsEditModalVisible(false);
      modalSlide.setValue(0); // Reset the slide position
    });
  };
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      modalSlide.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      // If the modal is dragged down by more than a threshold, close it
      if (gestureState.dy > 20) { // Threshold for smooth closing
        Animated.timing(modalSlide, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setIsEditModalVisible(false);
          modalSlide.setValue(0); // Reset position after closing
        });
      } else {
        Animated.spring(modalSlide, {
          toValue: 0, // Snap back to the original position
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  
  if (!dormDetails) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}>
      </View>
      <View style={styles.whitecontainer}>
        <View style={styles.upperPart}>
          <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: dormDetails.image_url }} style={styles.image} />
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{`P ${price}`}</Text>
          </View>
        </View>

        <ScrollView style={styles.details}>
          <Text style={styles.homeName}>{dorm_name}</Text>
          <View style={styles.horizontalLine} />

          <View style={styles.owner}>
            <Image source={require('@/assets/images/default-profile.jpg')} style={styles.ownerImage} />
            <Text style={styles.ownedBy}>Owned by: </Text>
            <Text style={styles.ownerName}>{dormDetails.owner}</Text>
          </View>

          <View style={styles.horizontalLine} />

          <Text style={styles.slots}>Good for: {pax}</Text>
          <Text style={styles.slots}>Available slots: {slots}</Text>

          <View style={styles.location}>
            <Icon name="location-on" size={20} color="#D12E2E" style={styles.icon} />
            <Text style={styles.homeAddress}>{location}</Text>
          </View>

          <Text style={styles.label}>What does this place offers?</Text>
          <View style={styles.bulletList}>
            {offerings?.split(',').map((item: string, index: number) => (
              <Text key={index} style={styles.amenities}>{` ${item}`}</Text>
            ))}
          </View>

          <View style={styles.horizontalLine2} />

          <Text style={styles.label}>Rules and Regulations</Text>
          <View style={styles.bulletList}>
            {rules?.split(',').map((item: string, index: number) => (
              <Text key={index} style={styles.rules}>{`${item}`}</Text>
            ))}
          </View>
        </ScrollView>
      
        <TouchableOpacity 
          style={styles.editButton} onPress={openEditModal}>
          <Icon name="edit" size={30} color="#D12E2E" />
        </TouchableOpacity>
      </View>

    {/* Edit Modal */}  
    {isEditModalVisible && (
    <Modal transparent visible={isEditModalVisible} animationType="none" onRequestClose={closeEditModal}>
    <TouchableWithoutFeedback onPress={closeEditModal}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalSlide }] },]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.dragIndicator}
                {...panResponder.panHandlers}/>
              </View>
              <KeyboardAvoidingView style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={140}>
                <ScrollView style={styles.modalContent}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text style={styles.modalTitle}>Edit Dorm Details</Text>

                  <TextInput style={styles.input} value={dorm_name} onChangeText={setDormName}
                    placeholder="Edit Dorm Name" placeholderTextColor="#909090"/>

                  <TextInput style={styles.input} value={String(price)} onChangeText={setPrice}
                    placeholder="Edit Price" placeholderTextColor="#909090" keyboardType="numeric"/>

                  <TextInput style={styles.input} value={String(pax)} onChangeText={setPax}
                    placeholder="Edit Pax" placeholderTextColor="#909090" keyboardType="numeric"/>

                  <TextInput style={styles.input} value={String(slots)} onChangeText={setSlots}
                    placeholder="Edit Slots" placeholderTextColor="#909090" keyboardType="numeric"/>

                  <TextInput style={styles.input} value={location} onChangeText={setLocation}
                    placeholder="Edit Location" placeholderTextColor="#909090"/>

                  <TextInput style={[styles.input, { height: 100 }]} value={offerings} onChangeText={setOfferings}
                    placeholder="Edit Amenities" placeholderTextColor="#909090" multiline/>

                  <TextInput style={[styles.input, { height: 100 }]} value={rules} onChangeText={setRules}
                    placeholder="Edit Rules & Regulation" placeholderTextColor="#909090" multiline/>

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )}
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
    fontSize: 20,
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
    marginLeft: 40,
    marginTop: 10,
  },

  bulletList: {
    marginLeft: 50,
    marginTop: 5,
    marginBottom: 0,
  },

  amenities: {
    marginVertical: 1,
    fontSize: 14,
  },

  rules: {
    marginVertical: 1,
    fontSize: 14,
    marginBottom: 20,
  },

  reserveButton: {
    backgroundColor: '#D12E2E',
    width: 150,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 12,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 0 },  
    shadowOpacity: 0.35,  
    shadowRadius: 3,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    padding: 8,
    borderRadius: 90,
    backgroundColor: 'rgb(255, 255, 255)',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0,},
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
  },

  modalContent: {
    padding: 20,
  },

  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.7,
    paddingTop: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    zIndex: 10,
    },

  input: { 
    borderWidth: 1, 
    borderRadius: 10,
    height: 50,
    borderColor: '#ccc', 
    marginBottom: 15, 
    fontSize: 16, 
    padding: 10 
  },
  saveButton: { 
    backgroundColor: '#D12E2E', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 30,
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' },
});

