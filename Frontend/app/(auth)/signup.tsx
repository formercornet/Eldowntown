import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useState } from 'react';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    console.log('Sign Up:', { username, email, password });
    Alert.alert('Success', 'Account created successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.title}>Create an Account</Text>
        <View style={styles.inputContainer}>
          <Text>Username:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="username"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="password"
          />
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  rectangle: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
