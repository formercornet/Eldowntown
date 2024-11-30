import React, { useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  Modal, TextInput, StyleSheet, RefreshControl,
  SafeAreaView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

interface Media {
  type: 'image' | 'video';
  uri: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

interface Post {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
  comments: Comment[];
  media?: Media;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedMedia({
        type: asset.type === 'video' ? 'video' : 'image',
        uri: asset.uri
      });
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      author: 'Current User',
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date(),
      comments: [],
      media: selectedMedia || undefined
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedMedia(null);
    setModalVisible(false);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
            downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes,
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'Current User',
      timestamp: new Date()
    };

    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [comment, ...post.comments] }
          : post
      )
    );

    setNewComment('');
    setCommentModalVisible(false);
  };

  const renderMedia = (media: Media) => {
    if (media.type === 'image') {
      return (
        <Image 
          source={{ uri: media.uri }} 
          style={styles.postMedia} 
          resizeMode="cover"
        />
      );
    }
    return (
      <Video
        source={{ uri: media.uri }}
        style={styles.postMedia}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.voteContainer}>
        <TouchableOpacity 
          style={styles.voteButton} 
          onPress={() => handleVote(item.id, 'up')}
        >
          <Text style={styles.voteArrow}>▲</Text>
          <Text style={styles.voteCount}>{item.upvotes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.voteButton} 
          onPress={() => handleVote(item.id, 'down')}
        >
          <Text style={styles.voteArrow}>▼</Text>
          <Text style={styles.voteCount}>{item.downvotes}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        
        <Text style={styles.content}>{item.content}</Text>
        
        {item.media && renderMedia(item.media)}
        
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={() => {
            setSelectedPost(item);
            setCommentModalVisible(true);
          }}
        >
          <Text style={styles.commentButtonText}>
            {item.comments.length} Comments
          </Text>
        </TouchableOpacity>

        {item.comments.length > 0 && (
          <View style={styles.commentsSection}>
            {item.comments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Downtown</Text>
          <Text style={styles.subtitle}>Your Social Feed</Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Create New Post</Text>
        </TouchableOpacity>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
          }
          contentContainerStyle={styles.feedContainer}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TextInput
                style={styles.input}
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="What's on your mind?"
                placeholderTextColor="#6b7280"
                multiline
              />

              {selectedMedia && (
                <View style={styles.mediaPreview}>
                  {selectedMedia.type === 'image' ? (
                    <Image 
                      source={{ uri: selectedMedia.uri }} 
                      style={styles.mediaPreviewContent} 
                    />
                  ) : (
                    <Video
                      source={{ uri: selectedMedia.uri }}
                      style={styles.mediaPreviewContent}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                    />
                  )}
                  <TouchableOpacity 
                    style={styles.removeMediaButton}
                    onPress={() => setSelectedMedia(null)}
                  >
                    <Text style={styles.removeMediaText}>×</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={pickMedia}
              >
                <Text style={styles.mediaButtonText}>Add Photo/Video</Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedMedia(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.postButton}
                  onPress={handleCreatePost}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={commentModalVisible}
          onRequestClose={() => setCommentModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Comment</Text>
              <TextInput
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                placeholderTextColor="#6b7280"
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  onPress={() => setCommentModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.postButton}
                  onPress={() => handleComment(selectedPost?.id || '')}
                >
                  <Text style={styles.postButtonText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e8ecf4',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  postMedia: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
  },
  postButton: {
    backgroundColor: '#075eec',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  postContent: {
    marginTop: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  voteArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  voteCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  commentButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  commentButtonText: {
    color: '#075eec',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaButton: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  mediaButtonText: {
    color: '#075eec',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaPreview: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaPreviewContent: {
    width: '100%',
    height: 200,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMediaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentsSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentItem: {
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#075eec',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  feedContainer: {
    paddingBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#333',
  },
});