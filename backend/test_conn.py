from pymongo import MongoClient
import sys

uri = "mongodb+srv://Shubh:Shubh1096@cluster0.txlysp7.mongodb.net/cleantrack?retryWrites=true&w=majority"

try:
    print(f"Testing connection to: {uri.split('@')[-1]}")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("Connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")
finally:
    client.close()
