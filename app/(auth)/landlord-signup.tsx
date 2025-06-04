import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign';
import { supabase } from '@/supabaseClient';

const { width, height } = Dimensions.get('screen');

export default function LandlordSignUp() {
  const router = useRouter();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [fb_link, setFbLink] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleSignUp = async () => {
    // Validation
    if (!lastName || !firstName || !email || !number || !address || !fb_link || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isChecked) {
      Alert.alert('Error', 'You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            last_name: lastName,
            first_name: firstName,
            email : email,
            number: number,
            address: address,
            fb_link: fb_link,
            kindofuser: 'landlord',
          });

        if (profileError) {
          Alert.alert('Error', 'Failed to store landlord profile information.');
          return;
        }

        Alert.alert('Success', 'Account created successfully!');
        router.push('/(auth)/login');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign-up. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
      
          <View style={styles.rectangle}>
            <Text style={styles.title}>SIGN UP</Text>
            <Text style={styles.subtitle}>LANDLORD</Text>

            <ScrollView style={styles.rectangle}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 120,
                paddingHorizontal: 20
              }}
              showsVerticalScrollIndicator={true}>

            <TextInput
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="#909090"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="#909090"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Email Address"
              placeholderTextColor="#909090"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Phone Number"
              placeholderTextColor="#909090"
              value={number}
              onChangeText={setNumber}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Home Address"
              placeholderTextColor="#909090"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Facebook Link"
              placeholderTextColor="#909090"
              value={fb_link}
              onChangeText={setFbLink}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#909090"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkBox, isChecked && styles.checkboxChecked]}
                onPress={toggleCheckbox}
              >
                {isChecked && <Icon name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            <View style={styles.rowContainer}>
              <Text style={styles.text}>Have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.login}>Login</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>      
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EE5A24',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  rectangle: {
    height: height * 1,
    width: width * 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 30,
    elevation: 5
  },
  title: {
    color: '#D12E2E',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginTop: 25,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#D12E2E',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginTop: 30,
    alignSelf: 'center',
  },
  inputText: {
    width: '80%',
    padding: 13,
    borderWidth: 1,
    borderColor: '#D12E2E',
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    fontFamily: 'Inter',
    elevation: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 45,
  },
  checkBox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#D12E2E',
    borderRadius: 3,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#D12E2E',
  },
  checkboxLabel: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#D42121',
    fontWeight: 'bold',
  },
  button: {
    width: '35%',
    height: 50,
    backgroundColor: '#D12E2E',
    padding: 13,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    marginTop: '15%',
    marginBottom: 20,
  },

  text: {
    color: '#000000',
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 14,
  },

  login: {
    color:'#D42121',
    fontWeight: 'bold',
    fontFamily: 'Inter',
    fontSize: 14,
  }
});