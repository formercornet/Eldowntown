import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  const handleSaveProfile = () => {
    if (!name || !bio) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    // Simulate the save action (e.g., saving to a server)
    console.log('Profile saved:', { name, bio });
    Alert.alert('Success', 'Your profile has been updated!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          placeholder="Enter your bio"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
