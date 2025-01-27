import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image,
        KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/supabaseClient';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('screen');

export default function UploadScreen() {
  const [formData, setFormData] = useState({
    dormName: '',
    price: '',
    owner: '',
    pax: '',
    slots: '',
    location: '',
    offerings: '',
    rules: '',
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const formKeys = ['dormName', 'price', 'owner', 'pax', 'slots', 'location', 'offerings', 'rules'];

  const handleImagePick = async () => {
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      // Simple image selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setUploadedImageUrl(result.assets[0].uri); // Enable the upload button
        console.log('Image selected successfully');
      }
    } catch (error) {
      console.log('Image selection error:', error);
    }
  };
  
  

  const handleUpload = async () => {
    if (!formData.dormName || !formData.price || !formData.owner || !formData.pax || !formData.slots || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (!uploadedImageUrl) {
      alert('Please upload an image first');
      return;
    }

    try {
      const { error: dbError } = await supabase.from('dorms').insert([
        {
          dorm_name: formData.dormName,
          price: parseFloat(formData.price),
          owner: formData.owner,
          pax: parseInt(formData.pax),
          slots: parseInt(formData.slots),
          location: formData.location,
          offerings: formData.offerings,
          rules: formData.rules,
          image_url: uploadedImageUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id
        },
      ]);

      if (dbError) throw dbError;

      alert('Dorm uploaded successfully!');
      setFormData({
        dormName: '',
        price: '',
        owner: '',
        pax: '',
        slots: '',
        location: '',
        offerings: '',
        rules: '',
      });
      setImageUri(null);
      setUploadedImageUrl(null);
    } catch (err) {
      console.error('Error uploading dorm:', err);
      alert('Failed to upload dorm');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redcontainer}>
        <Text style={styles.headerText}>Upload Your Dorm</Text>
      </View>

      <KeyboardAvoidingView 
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}>
        <ScrollView 
          style={styles.whitecontainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.formContainer}>
            {formKeys.map((key) => (
              <TextInput
                key={key}
                style={key === 'offerings' || key === 'rules' ? styles.textArea : styles.input}
                placeholder={
                  key === 'dormName' ? 'Dorm Name' :
                  key === 'price' ? 'Price' :
                  key === 'owner' ? 'Owner Name' :
                  key === 'pax' ? 'Good for (Pax)' :
                  key === 'slots' ? 'Available Slots' :
                  key === 'location' ? 'Location' :
                  key === 'offerings' ? 'What this place offers? (List)' :
                  'Rules and Regulations'
                }
                placeholderTextColor="#909090"
                keyboardType={['price', 'pax', 'slots'].includes(key) ? 'numeric' : 'default'}
                multiline={key === 'offerings' || key === 'rules'}
                numberOfLines={key === 'offerings' || key === 'rules' ? 4 : 1}
                value={formData[key as keyof typeof formData]}
                onChangeText={(text) => setFormData({ ...formData, [key]: text })}
              />
            ))}

            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>
                {imageUri ? 'Change Image' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                !uploadedImageUrl && styles.disabledButton
              ]}
              onPress={handleUpload}
              disabled={!uploadedImageUrl}
            >
              <Text style={styles.submitButtonText}>Upload Dorm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D12E2E',
  },
  redcontainer: {
    backgroundColor: '#D12E2E',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whitecontainer: {
    height: height * 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  formContainer: {
    padding: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D12E2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D12E2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#D12E2E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#D12E2E',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  previewImage: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  uploadImageButton: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    alignItems: 'center',
  },
});