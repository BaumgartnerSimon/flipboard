import mynews

from flask import Flask, jsonify, request
from flask_cors import CORS

import config
import utils
import summary

import sys

import bcrypt

import random
import string

from database import Database


app = Flask(__name__)
app.config["SECRET_KEY"] = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(128))
CORS(app)

def get_user(header):
    try:
        if 'unique_login' not in header:
            return None
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
    if update_password(self, username, request.json['old_password'], request.json['new_password'], request.headers['unique_login']):
        return jsonify({'success': True, 'message': 'Updated password'})
    return jsonify({'success': False, 'message': 'Could not update password'})

##follow magazine
##follow user
##table avec les likes / table avec les follows ou direct dans le users

@app.route('/add_magazine', methods=['POST'])
def add_magazine():
    if not all(_ in request.json for _ in ('title', 'description', 'public')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    Database().add_magazine(request.json['title'], request.json['description'], request.json['public'], user['unique_login'])
    return jsonify({'success': True, 'message': 'Successfully added new magazine'})

@app.route('/flip_to_magazine', methods=['POST'])
def flip_to_magazine():
    if not all(_ in request.json for _ in ('magazine_id', 'link', 'comment')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    existing_magazine = Database().get_magazine(request.json['magazine_id'])
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

    Database().new_flip(request.json['magazine_id'], request.json['link'], request.json['comment'], user['unique_login'], image_link, title, description)
    return jsonify({'success': True, 'message': 'Successfully flipped to magazine'})

@app.route('/get_magazines', methods=['GET'])
def get_magazines():
    all_magazines = Database().get_public_magazines_with_filps()

    user = get_user(request.headers)
    priv_magazines = []
    if user is not None:
        priv_magazines = Database().get_priv_magazines_with_filps(user['unique_login'])
    return jsonify({'success': True, 'message': 'Success', 'magazines': all_magazines, 'private_magazines': priv_magazines})

@app.route('/get_flips_from_magazines', methods=['GET'])
def get_flips_from_magazines():
    magazine_id = request.args.get('magazine_id')
    if magazine_id is None:
        return jsonify({'success': False, 'message': 'Please add a magazine_id'})
    magazine = Database().find_magazine_from_magazine_id(magazine_id)
    if magazine is None:
        return jsonify({'success': False, 'message': 'Verify that the magazine_id exist'})
    user = get_user(request.headers)
    if (not magazine['public']) and (user is None or magazine['author'] != user['unique_login']):
        return jsonify({'success': False, 'message': 'Access denied'})
    flips = Database().get_flips_from_magazine_id(magazine_id)
    return jsonify({'success': True, 'message': 'Success', 'flips': flips})

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
    Database().set_favorites(request.headers['unique_login'], favorites)
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
    Database().set_favorites(request.headers['unique_login'], request.json['favorites'])
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
        return jsonify({'success': False, 'message': 'Favorite not found'})
    favorites.remove(request.json['topic'])
    Database().set_favorites(request.headers['unique_login'], favorites)
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
    if not all(_ in request.args for _ in ('page',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    user_favorites = [] if user is None else user['favorites']
    favorite = request.args.get('favorite')
    page = 1
    try:
        page = int(request.args['page'])
        if page < 1:
            raise Exception('AAAA')
    except:
        return jsonify({'success': True, 'message': 'Please enter a page number'})
    res, nb_pages = Database().get_papers(favorite, user_favorites, page, topic=False, unique_login=request.headers.get('unique_login'))
    return jsonify({'success': True, 'message': 'ok', 'papers': res, 'nb_pages': nb_pages})

@app.route('/get_papers_from_topic', methods=['GET'])
def get_papers_from_topic():
    if not all(_ in request.args for _ in ('favorite', 'page')):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    page = 1
    try:
        page = int(request.args['page'])
        if page < 1:
            raise Exception('AAAA')
    except:
        return jsonify({'success': True, 'message': 'Please enter a page number'})
    res, nb_pages = Database().get_papers(request.args['favorite'], [], page, topic=True, unique_login=request.headers.get('unique_login'))
    return jsonify({'success': True, 'message': 'ok', 'papers': res, 'nb_pages': nb_pages})

@app.route('/paper_click', methods=['POST'])
def paper_click():
    if not all(_ in request.json for _ in ('paper_id',)):
        return jsonify({'success': False, 'message': 'please provide all informations'})
    user = get_user(request.headers)
    if user is None:
        return jsonify({'success': False, 'message': 'Please log in'})
    success = Database().add_click(request.json['paper_id'], request.headers['unique_login'])
    return jsonify({'success': success, 'message': 'ok' if success else 'Already clicked'})


if __name__ == "__main__":
    app.run(host=config.FLASK_HOST,
            port=config.FLASK_PORT,
            debug=config.FLASK_DEBUG,
            threaded=config.FLASK_THREADED
    )
