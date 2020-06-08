import mynews

from flask import Flask, jsonify, request
from flask_cors import CORS

from pymongo import MongoClient

import config
import utils

import sys

import bcrypt

import random
import string

import bson

#magazine privé public, liste, lien / article -> récupérer
#links
#topic -> ajouter liste


##passions -> news, technology, sports, business, politics, celebrity news, recipes, science, design, weather, women's news, photography, compuer science, travel, healthy eating, fashion, beauty, mindfulness, world economy, sustainability, street art, music, music festivals, tv, movies, cool stuff, workouts, home, classical music, fortune 500, gaming, electric vehicles, leadership, food & dining, national parks, startups, health, digital photography, breakthroughs, autos, advertising, road trips, books, running, foreign policy, education, new york city, architecture, yoga, dogs, parenting, basketball, entrepreneurship, tiny house movement, middle east, self-improvement, cycling, us congress apps, star wars, personal finance, diy, sleep, green living, nfl, space, coffee, outdoors, gardening, how-to's, writing, crafting, motorsport, weddings, interior design, memes, work-life balance


app = Flask(__name__)
app.config["SECRET_KEY"] = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(128))
CORS(app)

def get_user(header):
    try:
        if 'unique_login' not in header:
            return None
        client = MongoClient(host=config.MONGO_API)
        mydb = client['flipboard']
        users = mydb.users
        return users.find_one({'unique_login': header['unique_login']})
    except:
        return None

def get_username(header):
    try:
        return get_user(header)['username']
    except:
        return None

def is_logged_in(header):
    if get_username(header) is None:
        return False
    return True

@app.route('/', methods=['GET'])
def home():
    return jsonify({'success': True})

@app.route('/about.json', methods=['GET'])
def about():
    return jsonify({'success': True, 'data': {'a': 'b'}})

@app.route('/register', methods=['POST'])
def register():
    if not all(_ in request.json for _ in ('password', 'username')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    existing_user = users.find_one({'username': request.json['username']})
    if existing_user is None:
        hashpass = bcrypt.hashpw(request.json['password'].encode('utf-8'), bcrypt.gensalt())
        users.insert({'username': request.json['username'], 'password': hashpass, 'unique_login': utils.generate_unique_login(), 'veified': False, 'favorites': []})
        return jsonify({'success': True, 'message': 'Registered successfully'})
    return jsonify({'success': False, 'message': 'The username exists'})

@app.route('/login', methods=['POST'])
def login():
    if not all(_ in request.json for _ in ('password', 'username')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    login_user = users.find_one({'username': request.json['username']})
    if login_user:
        if bcrypt.hashpw(request.json['password'].encode('utf-8'), login_user['password']) == login_user['password']:
            return jsonify({'success': True, 'message': 'Successfully logged in', 'username': login_user['username'], 'unique_login': login_user['unique_login']})
    return jsonify({'success': False, 'message': 'Wrong username or password'})

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'success': True, 'message': 'Successfully logged out'})

@app.route('/update_username', methods=['POST'])
def update_username():
    if not all(_ in request.json for _ in ('new_username',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    old_username = get_username(request.headers)
    if old_username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    if old_username == request.json['new_username']:
        return jsonify({'success': False, 'message': 'Same usernames'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users

    login_user = users.find_one({'username': old_username})
    if login_user:
        myquery = {'unique_login': request.headers['unique_login']}
        newvalues = {'$set': {'username': request.json['new_username']}}
        users.update_one(myquery, newvalues)
        return jsonify({'success': True, 'message': 'Successfully updated username'})
    return jsonify({'success': False, 'message': 'Could not update username'})

@app.route('/update_password', methods=['POST'])
def update_password():
    if not all(_ in request.json for _ in ('old_password', 'new_password')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    if request.json['old_password'] == request.json['new_password']:
        return jsonify({'success': False, 'message': 'Same passwords'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    login_user = users.find_one({'username': username})
    if login_user:
        if bcrypt.hashpw(request.json['old_password'].encode('utf-8'), login_user['password']) == login_user['password']:
            hashpass = bcrypt.hashpw(request.json['new_password'].encode('utf-8'), bcrypt.gensalt())
            myquery = {'unique_login': request.headers['unique_login']}
            newvalues = {'$set': {'password': hashpass}}
            users.update_one(myquery, newvalues)
            return jsonify({'success': True, 'message': 'Updated password'})
    return jsonify({'success': False, 'message': 'Could not update password'})

##follow magazine
##follow user

##recup les noms de journaux -> creer un compte avec un mdp admin


##table avec les likes / table avec les follows ou direct dans le users

@app.route('/add_magazine', methods=['POST'])
def add_magazine():
    if not all(_ in request.json for _ in ('title', 'description', 'public')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    print(f"user: {user}", file=sys.stderr)
    ##liked
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    magazines = mydb.magazines
    magazines.insert({'title': request.json['title'], 'description': request.json['description'], 'public': request.json['public'], 'author': user['unique_login']})#####date created
    return jsonify({'success': True, 'message': 'Successfully added new magazine'})

@app.route('/flip_to_magazine', methods=['POST'])
def flip_to_magazine():
    if not all(_ in request.json for _ in ('magazine_id', 'link', 'comment')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    flips = mydb.flips
    magazines = mydb.magazines
    existing_magazine = magazines.find_one({'_id': bson.objectid.ObjectId(request.json['magazine_id'])})
    if existing_magazine is None:
        return jsonify({'success': False, 'message': 'Magazine_id is wrong'})
    flips.insert({'magazine_id': request.json['magazine_id'], 'link': request.json['link'], 'comment': request.json['comment'], 'author': user['unique_login']})##date created
    return jsonify({'success': True, 'message': 'Successfully flipped to magazine'})

@app.route('/get_magazines', methods=['GET'])
def get_magazines():
    ##pas besoin d etre connecte sauf pour avoir les private magazines
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    magazines = mydb.magazines
    flips = mydb.flips
    all_magazines = []
    for doc in magazines.find({'public': True}):
        doc['_id'] = str(doc['_id'])
        users = mydb.users
        doc['author'] = users.find_one({'unique_login': doc['author']})['username']
        doc['flips'] = []
        for d in flips.find({'magazine_id': doc['_id']}):
            d['_id'] = str(d['_id'])
            doc['flips'].append(d)
        #print(doc['flips'], file=sys.stderr)
        all_magazines.append(doc)

    priv_magazines = []
    user = get_user(request.headers)
    if user is not None:
        for doc in magazines.find({'public': False, 'author': user['unique_login']}):
            doc['_id'] = str(doc['_id'])
            users = mydb.users
            doc['author'] = users.find_one({'unique_login': doc['author']})['username']
            doc['flips'] = []
            for d in flips.find({'magazine_id': doc['_id']}):
                d['_id'] = str(d['_id'])
                doc['flips'].append(d)
            #print(doc['flips'], file=sys.stderr)
            priv_magazines.append(doc)
    #print(all_magazines, file=sys.stderr)
    return jsonify({'success': True, 'message': 'Success', 'magazines': all_magazines, 'private_magazines': priv_magazines})

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    if not all(_ in request.json for _ in ('topic',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    favorites = user['favorites']
    if request.json['topic'] in favorites:
        return jsonify({'success': False, 'message': 'Already in favorite'})
    ##verifier que le topic est dans la liste de topics
    favorites.append(request.json['topic'])
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    myquery = {'unique_login': request.headers['unique_login']}
    newvalues = {'$set': {'favorites': favorites}}
    users.update_one(myquery, newvalues)
    return jsonify({'success': True, 'message': 'Successfully added favorite'})

@app.route('/remove_favorite', methods=['POST'])
def remove_favorite():
    if not all(_ in request.json for _ in ('topic',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    favorites = user['favorites']
    if not (request.json['topic'] in favorites):
        return jsonify({'success': False, 'message': 'Favotite not found'})
    favorites.remove(request.json['topic'])
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    myquery = {'unique_login': request.headers['unique_login']}
    newvalues = {'$set': {'favorites': favorites}}
    users.update_one(myquery, newvalues)
    return jsonify({'success': True, 'message': 'Successfully removed favorite'})

@app.route('/get_favorites', methods=['GET'])
def get_favorites():
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    favorites = user['favorites']
    return jsonify({'success': True, 'message': 'ok', 'favorites': favorites})


if __name__ == "__main__":
    app.run(host=config.FLASK_HOST,
            port=config.FLASK_PORT,
            debug=config.FLASK_DEBUG,
            threaded=config.FLASK_THREADED
    )
