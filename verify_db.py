import sqlite3

# Path to your database file
db_path = "social_app.db"

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Fetch the list of tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables in the database:")
for table in tables:
    print(table[0])

# Verify the structure of each table
for table in tables:
    print(f"\nStructure of table {table[0]}:")
    cursor.execute(f"PRAGMA table_info({table[0]});")
    columns = cursor.fetchall()
    for column in columns:
        print(f"{column[1]} ({column[2]})")  # Column name and type

# Close the connection
conn.close()
