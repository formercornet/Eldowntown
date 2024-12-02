from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_app.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)

# Database Models
class Post(db.Model):
    id = db.Column(db.String, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    comments = db.relationship('Comment', backref='post', lazy=True)
    media_type = db.Column(db.String(50), nullable=True)
    media_uri = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'author': self.author,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'timestamp': self.timestamp.isoformat(),
            'comments': [comment.to_dict() for comment in self.comments],
            'media': {'type': self.media_type, 'uri': self.media_uri} if self.media_uri else None
        }

class Comment(db.Model):
    id = db.Column(db.String, primary_key=True)
    content = db.Column(db.String(300), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    post_id = db.Column(db.String, db.ForeignKey('post.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'author': self.author,
            'timestamp': self.timestamp.isoformat()
        }

# Initialize database
with app.app_context():
    db.create_all()

# API Routes

# 1. Fetch all posts
@app.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts])

# 2. Create a new post
@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    content = data.get('content')
    author = data.get('author')
    media = data.get('media')  # Media should be passed as a dictionary containing type and uri

    if not content or not author:
        return jsonify({"message": "Content and author are required"}), 400

    post = Post(
        id=str(datetime.utcnow().timestamp()),  # Unique ID based on timestamp
        content=content,
        author=author,
        media_type=media['type'] if media else None,
        media_uri=media['uri'] if media else None
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201

# 3. Edit a post
@app.route('/posts/<post_id>', methods=['PUT'])
def edit_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    data = request.get_json()
    post.content = data.get('content', post.content)

    db.session.commit()

    return jsonify(post.to_dict())

# 4. Add a comment to a post
@app.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    data = request.get_json()
    comment_content = data.get('content')
    comment_author = data.get('author')

    if not comment_content or not comment_author:
        return jsonify({"message": "Content and author are required"}), 400

    comment = Comment(
        id=str(datetime.utcnow().timestamp()),
        content=comment_content,
        author=comment_author,
        post_id=post_id
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201

# 5. Vote on a post (upvote or downvote)
@app.route('/posts/<post_id>/vote', methods=['POST'])
def vote_on_post(post_id):
    data = request.get_json()
    vote_type = data.get('vote_type')  # "up" or "down"

    if vote_type not in ['up', 'down']:
        return jsonify({"message": "Invalid vote type"}), 400

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    if vote_type == 'up':
        post.upvotes += 1
    elif vote_type == 'down':
        post.downvotes += 1

    db.session.commit()

    return jsonify(post.to_dict())

# 6. Upload media (image/video)
@app.route('/media/upload', methods=['POST'])
def upload_media():
    file = request.files['file']
    file_type = request.form.get('type')  # 'image' or 'video'
    
    if not file or file_type not in ['image', 'video']:
        return jsonify({"message": "Invalid file or type"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    return jsonify({"message": "Media uploaded successfully", "uri": file_path, "type": file_type})

if __name__ == '__main__':
    app.run(debug=True)
