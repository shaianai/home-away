import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Alert, Text, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      console.log('Redirected URL:', url);
      const { queryParams } = Linking.parse(url);
      console.log('Query Params:', queryParams);

      // Do something with the token, like verify session
      // or fetch user info if logged in
      Alert.alert('Success', 'Email confirmed!');
      router.push('/login'); // Redirect to login or home page after confirmation
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Confirming your email...</Text>
    </View>
  );
}
