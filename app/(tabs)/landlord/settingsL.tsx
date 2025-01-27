import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { supabase } from '@/supabaseClient';
import { RootStackParamList } from "./types";
import { NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get('screen');

export default function SettingsLScreen() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.whitecontainer}>
        <View style={styles.settingContent}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EditAccount')}>
            <Text style={styles.cardName}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LoginSecurity')}>
            <Text style={styles.cardName}>Login & Security</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => setShowLogoutModal(true)}>
            <Text style={styles.cardName}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
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
  whitecontainer: {
    height: height * 1,
    width: width * 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    width: 340,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },  
    shadowOpacity: 0.25,  
    shadowRadius: 1,
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
  },
  cardName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  settingContent: {
    marginTop: 10,
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
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
  },
  logoutButton: {
    backgroundColor: '#D12E2E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'white',
  }
});
