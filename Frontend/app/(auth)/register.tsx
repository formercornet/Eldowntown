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

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.username || !form.age || !form.gender || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (parseInt(form.age) < 13) {
      Alert.alert('Error', 'You must be at least 13 years old');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Form:', form);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
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
            Create your <Text style={{ color: '#075eec' }}>Downtown</Text> account
          </Text>

          <Text style={styles.subtitle}>
            Join our user-friendly social media app
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={username => setForm({ ...form, username })}
              placeholder="johndoe"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.username}
            />
          </View>

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

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              autoCorrect={false}
              onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry
              value={form.confirmPassword}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={age => setForm({ ...form, age })}
              placeholder="Enter your age"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.age}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  form.gender === 'male' && styles.genderSelected,
                ]}
                onPress={() => setForm({ ...form, gender: 'male' })}
              >
                <Text style={[
                  styles.genderText,
                  form.gender === 'male' && styles.genderTextSelected
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  form.gender === 'female' && styles.genderSelected,
                ]}
                onPress={() => setForm({ ...form, gender: 'female' })}
              >
                <Text style={[
                  styles.genderText,
                  form.gender === 'female' && styles.genderTextSelected
                ]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            style={styles.formAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            style={styles.formFooter}
          >
            <Text style={styles.formFooterText}>
              Already have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  genderText: {
    color: '#1d1d1d',
    fontSize: 15,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#fff',
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