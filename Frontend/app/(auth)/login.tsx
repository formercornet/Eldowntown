import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      // Add your login logic here
      console.log('Login:', form);
      router.replace('/(tabs)/home'); // Changed from '../(tabs)' to '/(tabs)/home'
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            // source={{ uri: 'https://assets.withfra.me/SignIn.2.png' }}
          />

          <Text style={styles.title}>
            Sign in to <Text style={{ color: '#075eec' }}>Downtown</Text>
          </Text>

          <Text style={styles.subtitle}>
            Get access to your user-friendly social media app
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry
              value={form.password}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={styles.formAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign in</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('./register')} // Changed from './register' to '/register'
            style={styles.formFooter}
          >
            <Text style={styles.formFooterText}>
              Don't have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1d1d1d',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#1d1d1d',
  },
  formAction: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#075eec',
    borderRadius: 12,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  formFooter: {
    marginTop: 24,
  },
  formFooterText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1d1d1d',
    textAlign: 'center',
  },
});