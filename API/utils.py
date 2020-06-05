import random
import string
import config

from pymongo import MongoClient

def generate_unique_login(size=15):
    unique_login = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(size))
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    existing_user = users.find_one({'unique_login': unique_login})
    while existing_user is not None:
        unique_login = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(size))
        existing_user = users.find_one({'unique_login': unique_login})
    return unique_login
