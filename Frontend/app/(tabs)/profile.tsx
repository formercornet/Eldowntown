import React, { useState } from 'react';
import { 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  Alert,
  FlatList,
  Modal,
  Image
} from 'react-native';

interface UserProfile {
  username: string;
  bio: string;
  avatar?: string;
}

interface Post {
  id: string;
  content: string;
  timestamp: Date;
  media?: {
    type: 'image' | 'video';
    uri: string;
  };
}

const ProfileScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: 'John Doe',
    bio: 'Software Developer | React Native Enthusiast',
    avatar: 'https://yourapi.com/avatars/default.png'
  });
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEditProfile = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (!editedProfile.username || !editedProfile.bio) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postDate}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.media && (
        <Image 
          source={{ uri: item.media.uri }} 
          style={styles.postImage}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        {profile.avatar && (
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
          />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>My Posts</Text>
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsContainer}
      />

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.username}
              onChangeText={username => setEditedProfile({...editedProfile, username})}
              placeholder="Username"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editedProfile.bio}
              onChangeText={bio => setEditedProfile({...editedProfile, bio})}
              placeholder="Bio"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  bio: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#075eec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    margin: 20,
  },
  postsContainer: {
    padding: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: '#4b5563',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#075eec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;