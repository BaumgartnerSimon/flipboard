import mynews

from flask import Flask, jsonify, request
from flask_cors import CORS

from pymongo import MongoClient, DESCENDING

import config
import utils
import summary

import sys

import bcrypt

import random
import string

import bson

import datetime

from database import Database


app = Flask(__name__)
app.config["SECRET_KEY"] = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(128))
CORS(app)

def get_user(header):
    try:
        if 'unique_login' not in header:
            return None
        """client = MongoClient(host=config.MONGO_API)
        mydb = client['flipboard']
        users = mydb.users
        return users.find_one({'unique_login': header['unique_login']})"""
        return Database().get_user_from_unique_login(header['unique_login'])
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
    return jsonify({
        'success': True,
        'favorites': config.FAVORITE_LST
    })

@app.route('/register', methods=['POST'])
def register():
    if not all(_ in request.json for _ in ('password', 'username')):
        return jsonify({'success': False, 'message': 'Please provide all informations'})
    """client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    existing_user = users.find_one({'username': request.json['username']})
    if existing_user is None:
        hashpass = bcrypt.hashpw(request.json['password'].encode('utf-8'), bcrypt.gensalt())
        users.insert({'username': request.json['username'], 'password': hashpass, 'unique_login': utils.generate_unique_login(), 'veified': False, 'favorites': []})
        return jsonify({'success': True, 'message': 'Registered successfully'})"""
    try:
        if Database().username_exists(request.json['username']):
            return jsonify({'success': False, 'message': 'The username exists'})
        Database().register_user(request.json['username'], request.json['password'])
        return jsonify({'success': True, 'message': 'Registered successfully'})
    except:
        return jsonify({'success': False, 'message': 'The username exists'})

@app.route('/login', methods=['POST'])
def login():
    if not all(_ in request.json for _ in ('password', 'username')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    """client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    login_user = users.find_one({'username': request.json['username']})
    if login_user:
        if bcrypt.hashpw(request.json['password'].encode('utf-8'), login_user['password']) == login_user['password']:
            return jsonify({'success': True, 'message': 'Successfully logged in', 'username': login_user['username'], 'unique_login': login_user['unique_login']})"""
    try:
        return jsonify(Database().login(request.json['username'], request.json['password']))
    except:
        return jsonify({'success': False, 'message': 'Wrong username or password'})

@app.route('/get_username', methods=['GET'])
def get_usernamee():
    username = get_username(request.headers)
    if username is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    return jsonify({'success': True, 'message': 'Got username', 'username': username})

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
    ##check si le new_username existe
    """client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users

    login_user = users.find_one({'username': old_username})
    if login_user:
        myquery = {'unique_login': request.headers['unique_login']}
        newvalues = {'$set': {'username': request.json['new_username']}}
        users.update_one(myquery, newvalues)
        return jsonify({'success': True, 'message': 'Successfully updated username'})"""
    if Database().update_username(old_username, request.json['new_username'], request.headers['unique_login']):
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
    """client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    login_user = users.find_one({'username': username})
    if login_user:
        if bcrypt.hashpw(request.json['old_password'].encode('utf-8'), login_user['password']) == login_user['password']:
            hashpass = bcrypt.hashpw(request.json['new_password'].encode('utf-8'), bcrypt.gensalt())
            myquery = {'unique_login': request.headers['unique_login']}
            newvalues = {'$set': {'password': hashpass}}
            users.update_one(myquery, newvalues)
            return jsonify({'success': True, 'message': 'Updated password'})"""
    if update_password(self, username, request.json['old_password'], request.json['new_password'], request.headers['unique_login']):
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

    image_link = ''
    title = ''
    description = ''
    try:
        s = summary.Summary(request.json['link'])
        s.extract()
        image_link = str(s.image)
        title = str(s.title)
        description = str(s.description)
        print(f"Title: {s.title}", file=sys.stderr)
        print(f"Description: {s.description}", file=sys.stderr)
        print(f"Image: {s.image}", file=sys.stderr)
    except:
        pass

    flips.insert({
        'magazine_id': request.json['magazine_id'],
        'link': request.json['link'],
        'comment': request.json['comment'],
        'author': user['unique_login'],
        'image_link': image_link,
        'title': title,
        'description': description,
        'date_created': datetime.datetime.now().strftime("%Y-%m-%d"),
        'clicks': []
    })
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

@app.route('/get_flips_from_magazines', methods=['GET'])
def get_flips_from_magazines():
    ##pas besoin d etre connecte sauf pour avoir les private magazines
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    magazines = mydb.magazines
    flips = mydb.flips
    magazine_id = request.args.get('magazine_id')
    if magazine_id is None:
        return jsonify({'success': False, 'message': 'Please add a magazine_id'})
    magazine = magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})
    if magazine is None:
        return jsonify({'success': False, 'message': 'Verify that the magazine_id exist'})
    user = get_user(request.headers)
    if (not magazine['public']) and (user is None or magazine['author'] != user['unique_login']):
        return jsonify({'success': False, 'message': 'Access denied'})
    res = []
    for flip in flips.find({'magazine_id': magazine_id}):
        flip['_id'] = str(flip['_id'])
        res.append(flip)
    return jsonify({'success': True, 'message': 'Success', 'flips': res})

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    if not all(_ in request.json for _ in ('topic',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    favorites = user['favorites']
    if request.json['topic'] not in config.FAVORITE_LST:
        return jsonify({'success': False, 'message': 'Please add an existing favorite'})
    if request.json['topic'] in favorites:
        return jsonify({'success': False, 'message': 'Already in favorite'})
    favorites.append(request.json['topic'])
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    myquery = {'unique_login': request.headers['unique_login']}
    newvalues = {'$set': {'favorites': favorites}}
    users.update_one(myquery, newvalues)
    return jsonify({'success': True, 'message': 'Successfully added favorite'})

@app.route('/set_favlist', methods=['POST'])
def set_favlist():
    if not all(_ in request.json for _ in ('favorites',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    favorites = user['favorites']
    if len(favorites) != len(request.json['favorites']):
        return jsonify({'success': False, 'message': 'Favorites length changed'})
    if set(favorites) != set(request.json['favorites']):
        return jsonify({'success': False, 'message': 'Favorites changed'})
    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    users = mydb.users
    myquery = {'unique_login': request.headers['unique_login']}
    newvalues = {'$set': {'favorites': request.json['favorites']}}
    users.update_one(myquery, newvalues)
    return jsonify({'success': True, 'message': 'Successfully changed favorites order'})

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

@app.route('/get_papers', methods=['GET'])
def get_papers():
    user = get_user(request.headers)
    #if user is None:
    #    return jsonify({'success': False, 'message': 'Please log in'})
    #favorites = user['favorites']
    favorite = request.args.get('favorite')

    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    flips = mydb.flips
    users = mydb.users
    res = []
    ##[('field1', DESCENDING), ('field2', DESCENDING)]
    ##trier par date
    ##https://stackoverflow.com/questions/36566166/sort-the-result-from-a-pymongo-query
    #for i, flip in enumerate(flips.find({}).sort('clicks', DESCENDING)):####################################find que les publics, sans le meme auteur que le username, sans le meme clic
    for i, flip in enumerate(flips.aggregate([
            {'$match': {}},##public et privés du compte
            {'$addFields': {'total_clicks': {'$size': "$clicks"}}},
            {'$sort': {'date_created': DESCENDING, 'total_clicks': DESCENDING}}])):
            #'clicks', DESCENDING)):####################################find que les publics, sans le meme auteur que le username, sans le meme clic
        if i > 98:
            break
        flip['_id'] = str(flip['_id'])
        flip['author'] = users.find_one({'unique_login': flip['author']})['username']
        res.append(flip)
    return jsonify({'success': True, 'message': 'ok', 'papers': res})

@app.route('/paper_click', methods=['POST'])
def paper_click():###############################################################################mettre le nom de la personne qui a cliquer
    if not all(_ in request.json for _ in ('paper_id',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})

    client = MongoClient(host=config.MONGO_API)
    mydb = client['flipboard']
    flips = mydb.flips
    #myquery = {'_id': bson.objectid.ObjectId(request.json['paper_id'])}
    #newvalues = {'$inc': {'clicks': 1}}
    #flips.update_one(myquery, newvalues)
    #print(f'flips: {flips}', file=sys.stderr)
    #print(f'flips.clicks: {flips.clicks}', file=sys.stderr)
    click_lst = flips.find_one({'_id': bson.objectid.ObjectId(request.json['paper_id'])})['clicks']
    if request.headers['unique_login'] in click_lst:
        return jsonify({'success': False, 'message': 'Already clicked'})
    click_lst.append(request.headers['unique_login'])
    myquery = {'_id': bson.objectid.ObjectId(request.json['paper_id'])}
    newvalues = {'$set': {'clicks': click_lst}}
    flips.update_one(myquery, newvalues)
    return jsonify({'success': True, 'message': 'ok'})



if __name__ == "__main__":
    app.run(host=config.FLASK_HOST,
            port=config.FLASK_PORT,
            debug=config.FLASK_DEBUG,
            threaded=config.FLASK_THREADED
    )
