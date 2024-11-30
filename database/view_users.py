from app import db, User, app  # Import your Flask app and models

with app.app_context():
    users = User.query.all()  # Query all users
    for user in users:
        print(f"ID: {user.user_id}, Username: {user.username}, Email: {user.email}, Role: {user.role}")
