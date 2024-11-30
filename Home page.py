from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os
import random
import string
import datetime
from werkzeug.exceptions import BadRequest

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configuring the MySQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/database_name'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  

# Initialize database and JWT
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Database Models

# User model
class User(db.Model):
    user_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.String(200), nullable=True)
    photo = db.Column(db.String(200), nullable=True)

    def __init__(self, user_id, name, bio, photo=None):
        self.user_id = user_id
        self.name = name
        self.bio = bio
        self.photo = photo

# Post model
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('user.user_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    image = db.Column(db.String(200), nullable=True)
    video = db.Column(db.String(200), nullable=True)
    posted_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    comments = db.relationship('Comment', backref='post', lazy=True)

    def __init__(self, user_id, name, content, image=None, video=None):
        self.user_id = user_id
        self.name = name
        self.content = content
        self.image = image
        self.video = video

# Comment model
class Comment(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.post_id'), nullable=False)
    user_id = db.Column(db.String(50), nullable=False)
    comment_text = db.Column(db.String(500), nullable=False)
    commented_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __init__(self, post_id, user_id, comment_text):
        self.post_id = post_id
        self.user_id = user_id
        self.comment_text = comment_text

# Initialize database
with app.app_context():
    db.create_all()

# Utility function for validating file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/login_validation', methods=['POST'])
def login_validation():
    user_id = request.form.get('user_id')
    user = User.query.filter_by(user_id=user_id).first()  # Check if user exists in DB
    if user:
        access_token = create_access_token(identity=user.user_id)  # Generate JWT token
        return jsonify(access_token=access_token), 200  # Return the token
    else:
        return jsonify({"message": "Invalid login credentials!"}), 401  # Error: Invalid credentials

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()  # Get the user_id from JWT token
    user = User.query.filter_by(user_id=user_id).first()
    if user:
        return jsonify({
            "user_id": user.user_id,
            "name": user.name,
            "bio": user.bio,
            "photo": user.photo
        }), 200
    return jsonify({"message": "User not found!"}), 404

@app.route('/update_profile', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()  # Get the user_id from JWT token
    user = User.query.filter_by(user_id=user_id).first()
    
    if not user:
        return jsonify({"message": "User not found!"}), 404

    name = request.form.get('name')
    bio = request.form.get('bio')
    file = request.files.get('profile_picture')  # Handle profile picture upload
    photo_filename = None

    if not name or not bio:
        raise BadRequest('Name and Bio are required.')

    # If there's an image, save it
    if file and allowed_file(file.filename):
        filename = os.path.join('static/uploads', ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)) + secure_filename(file.filename))
        file.save(filename)
        photo_filename = filename

    user.name = name
    user.bio = bio
    if photo_filename:
        user.photo = photo_filename

    db.session.commit()  # Update the database
    return jsonify({"message": "Profile updated successfully!"}), 200

@app.route('/new_post', methods=['POST'])
@jwt_required()
def new_post():
    user_id = get_jwt_identity()  # Get the user_id from JWT token
    post_data = request.form.get('post_data')
    file = request.files.get('image')  # Handle image upload
    video = request.files.get('video')  # Handle video upload
    image_filename = None
    video_filename = None

    # Validate post content
    if not post_data:
        raise BadRequest('Post content cannot be empty.')

    # Handle image upload
    if file and allowed_file(file.filename):
        filename = os.path.join('static/uploads', ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)) + secure_filename(file.filename))
        file.save(filename)
        image_filename = filename
    elif file:
        raise BadRequest('Invalid file type. Only PNG, JPG, JPEG, GIF allowed.')

    # Handle video upload
    if video and allowed_file(video.filename):
        filename = os.path.join('static/uploads', ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)) + secure_filename(video.filename))
        video.save(filename)
        video_filename = filename
    elif video:
        raise BadRequest('Invalid file type. Only MP4 allowed.')

    post = Post(user_id=user_id, name="John Doe", content=post_data, image=image_filename, video=video_filename)
    db.session.add(post)
    db.session.commit()  # Save to the database
    return jsonify({"message": "Post created successfully!"}), 200

@app.route('/get_posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    user_id = get_jwt_identity()  # Get the user_id from JWT token
    posts = Post.query.filter_by(user_id=user_id).all()
    posts_list = [{"post_id": post.post_id, "user_id": post.user_id, "name": post.name, "content": post.content, "image": post.image, "video": post.video, "posted_at": post.posted_at, "upvotes": post.upvotes, "downvotes": post.downvotes, "comments": [{"user_id": comment.user_id, "comment_text": comment.comment_text, "commented_at": comment.commented_at} for comment in post.comments]} for post in posts]

    return jsonify(posts_list), 200  # Return posts as JSON

@app.route('/upvote_post/<int:post_id>', methods=['POST'])
@jwt_required()
def upvote_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found!"}), 404

    post.upvotes += 1  # Increment upvote count
    db.session.commit()
    return jsonify({"message": "Upvoted successfully!", "upvotes": post.upvotes}), 200

@app.route('/downvote_post/<int:post_id>', methods=['POST'])
@jwt_required()
def downvote_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found!"}), 404

    post.downvotes += 1  # Increment downvote count
    db.session.commit()
    return jsonify({"message": "Downvoted successfully!", "downvotes": post.downvotes}), 200

@app.route('/comment_post/<int:post_id>', methods=['POST'])
@jwt_required()
def comment_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found!"}), 404

    comment_text = request.form.get('comment_text')
    if not comment_text:
        return jsonify({"message": "Comment text cannot be empty!"}), 400  # Error: Empty comment

    # Get the user_id from the JWT token
    user_id = get_jwt_identity()  # This retrieves the 'identity' from the JWT token, which is the user_id

    # Append the comment to the post
    comment = Comment(post_id=post_id, user_id=user_id, comment_text=comment_text)
    db.session.add(comment)
    db.session.commit()  # Save to the database
    return jsonify({"message": "Comment added successfully!"}), 200

@app.route('/logout', methods=['GET'])
def logout():
    return jsonify({"message": "Logged out successfully!"}), 200  # Invalidate the token on frontend

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
