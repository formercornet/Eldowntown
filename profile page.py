from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from datetime import datetime
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_app.db'  # Change this to your DB URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

db = SQLAlchemy(app)

# Models for the user profile and posts
class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.String(300), nullable=False)
    avatar = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'username': self.username,
            'bio': self.bio,
            'avatar': self.avatar or 'https://yourapi.com/avatars/default.png'
        }

class Post(db.Model):
    id = db.Column(db.String, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profile.id'), nullable=False)
    media_type = db.Column(db.String(50), nullable=True)
    media_uri = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'media': {'type': self.media_type, 'uri': self.media_uri} if self.media_uri else None
        }

# Initialize the database
with app.app_context():
    db.create_all()

# Routes

# 1. Fetch the user profile
@app.route('/profile', methods=['GET'])
def get_profile():
    user_profile = UserProfile.query.first()  # Assuming a single profile, modify if multi-user system
    if user_profile:
        return jsonify(user_profile.to_dict())
    return jsonify({"message": "Profile not found"}), 404

# 2. Update the user profile (username, bio, avatar)
@app.route('/profile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    username = data.get('username')
    bio = data.get('bio')

    if not username or not bio:
        return jsonify({"message": "Username and bio are required!"}), 400

    user_profile = UserProfile.query.first()  # Modify as needed for multi-user systems
    if not user_profile:
        return jsonify({"message": "Profile not found"}), 404

    user_profile.username = username
    user_profile.bio = bio

    # Handle avatar upload
    if 'avatar' in request.files:
        avatar_file = request.files['avatar']
        if avatar_file and allowed_file(avatar_file.filename):
            filename = secure_filename(avatar_file.filename)
            avatar_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            avatar_file.save(avatar_path)
            user_profile.avatar = avatar_path  # Save the file path or URL

    db.session.commit()

    return jsonify(user_profile.to_dict())

# 3. Fetch the user's posts
@app.route('/posts', methods=['GET'])
def get_user_posts():
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts])

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# 4. Create a new post
@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    content = data.get('content')
    user_id = 1  
    media = data.get('media') 

    if not content:
        return jsonify({"message": "Content is required"}), 400

    post = Post(
        id=str(datetime.utcnow().timestamp()),  # Unique ID based on timestamp
        content=content,
        timestamp=datetime.utcnow(),
        user_id=user_id,
        media_type=media['type'] if media else None,
        media_uri=media['uri'] if media else None
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
