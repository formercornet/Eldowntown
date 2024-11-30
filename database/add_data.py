from app import db, User, app  # Import your Flask app and models
from werkzeug.security import generate_password_hash

# Use the app context
with app.app_context():
    # Hash the password
    password = "password123"  # Replace with the actual password
    hashed_password = generate_password_hash(password)

    # Add a user with a hashed password
    new_user = User(username="alice", email="alice@example.com", password_hash=hashed_password, role="User")
    db.session.add(new_user)

    # Commit the changes
    db.session.commit()

    print("User added successfully!")