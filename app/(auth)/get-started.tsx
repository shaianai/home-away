import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#EE5A24', '#D12E2E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}  
      style={styles.container}
    >
      <Image source={require('@/assets/images/logo.png')} style={styles.image}/>
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={() => router.push('/(auth)/login')} // Navigate to Explore screen
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D12E2E',
    alignItems: 'center',
  },

  image: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    marginTop: '30%',
    marginBottom: '70%',
  },

  button: {
    width: '60%',
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#D12E2E',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
