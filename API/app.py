from flask import Flask, jsonify, request
from flask_cors import CORS

from pymongo import MongoClient

import config

import sys

import random
import string

app = Flask(__name__)
app.config["SECRET_KEY"] = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(128))
CORS(app)

def get_username(header):
    if 'unique_login' not in header:
        return None
    return db.Database().get_username_from_unique_login(header['unique_login'])

def is_logged_in(header):
    if get_username(header) is None:
        return False
    return True

@app.route('/', methods=['GET'])
def home():
    """client = MongoClient(host=config.MONGO_API,
                         username=config.MONGO_ROOT_USERNAME,
                         password=config.MONGO_ROOT_PASSWORD
    )"""
    client = MongoClient(host=config.MONGO_API)
    dblist = client.list_database_names()
    print('ok', file=sys.stderr)
    print(dblist, file=sys.stderr)
    mydb = client['flipboard']
    mycol = mydb["customers"]
    mydict = { "name": "John", "address": "Highway 37" }
    x = mycol.insert_one(mydict)
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'please log in'})
    return jsonify({'success': True})

"""@app.route('/register', methods=['POST'])
def register():
    if not all(_ in request.json for _ in ('password', 'username', 'email')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    if db.Database().add_user(request.json['username'], request.json['email'], request.json['password']):
        return jsonify({'success': True, 'message': 'Registered successfully'})
    return jsonify({'success': False, 'message': 'The username or the email exists'})

@app.route('/login', methods=['POST'])
def login():
    if not all(_ in request.json for _ in ('password', 'email')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    if db.Database().check_password(request.json['email'], request.json['password']):
        username, unique_login = db.Database().get_username_unique_login_from_email(request.json['email'])
        return jsonify({'success': True, 'message': 'Successfully logged in', 'username': username, 'unique_login': unique_login})
    return jsonify({'success': False, 'message': 'username or password is false'})

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'success': True, 'message': 'Successfully logged out'})

@app.route('/update_username', methods=['POST'])
def update_username():
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    if not all(_ in request.json for _ in ('old_username', 'new_username')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    if username != request.json['old_username']:
        return jsonify({'success': False, 'message': 'Incorrect username'})
    if request.json['old_username'] == request.json['new_username']:
        return jsonify({'success': False, 'message': 'Usernames are the same'})
    if db.Database().update_username(request.json['old_username'], request.json['new_username']):
        return jsonify({'success': True, 'message': 'Successfully updated username'})
    return jsonify({'success': False, 'message': "Could not update username"})

@app.route('/update_password', methods=['POST'])
def update_password():
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    if not all(_ in request.json for _ in ('old_password', 'new_password', 'username')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    if username != request.json['username']:
        return jsonify({'success': False, 'message': 'Incorrect username'})
    if request.json['old_password'] == request.json['new_password']:
        return jsonify({'success': False, 'message': 'Passwords are the same'})
    if db.Database().update_password(request.json['old_password'], request.json['new_password'], request.json['username']):
        return jsonify({'success': True, 'message': 'Successfully updated password'})
    return jsonify({'success': False, 'message': "Could not update password"})

@app.route('/update_email', methods=['POST'])
def update_email():
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    if not all(_ in request.json for _ in ('old_email', 'new_email', 'username')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    if username != request.json['username']:
        return jsonify({'success': False, 'message': 'Incorrect username'})
    if request.json['old_email'] == request.json['new_email']:
        return jsonify({'success': False, 'message': 'Emails are the same'})
    if db.Database().update_email(request.json['old_email'], request.json['new_email'], request.json['username']):
        return jsonify({'success': True, 'message': 'Successfully updated email'})
    return jsonify({'success': False, 'message': "Could not update email"})
"""
if __name__ == "__main__":
    app.run(host=config.FLASK_HOST,
            port=config.FLASK_PORT,
            debug=config.FLASK_DEBUG,
            threaded=config.FLASK_THREADED
    )
