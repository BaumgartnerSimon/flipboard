from pymongo import MongoClient, DESCENDING

import bcrypt

import random
import string

import bson

import datetime

import sys

import config
import utils

import html2text
import requests


class Database:
    def __init__(self):
        self.client = MongoClient(host=config.MONGO_API)
        self.mydb = self.client['flipboard']
        self.users = self.mydb.users
        self.magazines = self.mydb.magazines
        self.flips = self.mydb.flips

    def get_user_from_unique_login(self, unique_login):
        return self.users.find_one({'unique_login': unique_login})

    def username_exists(self, username):
        existing_user = self.users.find_one({'username': username})
        return existing_user is not None

    def register_user(self, username, password, verified=False):
        hashpass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        unique_login = utils.generate_unique_login()
        self.users.insert({'username': username, 'password': hashpass, 'unique_login': utils.generate_unique_login(), 'veified': verified, 'favorites': []})
        return unique_login

    def login(self, username, password):
        login_user = self.users.find_one({'username': username})
        if login_user:
            if bcrypt.hashpw(password.encode('utf-8'), login_user['password']) == login_user['password']:
                return {'success': True, 'message': 'Successfully logged in', 'username': login_user['username'], 'unique_login': login_user['unique_login']}
        return {'success': False, 'message': 'Wrong username or password'}

    def update_username(self, old_username, new_username, unique_login):
        login_user = self.users.find_one({'username': old_username})
        if login_user:
            myquery = {'unique_login': unique_login}
            newvalues = {'$set': {'username': new_username}}
            users.update_one(myquery, newvalues)
            return True
        return False

    def update_password(self, username, old_password, new_password, unique_login):
        login_user = self.users.find_one({'username': username})
        if login_user:
            if bcrypt.hashpw(old_password.encode('utf-8'), login_user['password']) == login_user['password']:
                hashpass = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                myquery = {'unique_login': unique_login}
                newvalues = {'$set': {'password': hashpass}}
                users.update_one(myquery, newvalues)
                return True
        return False

    def add_magazine(self, title, description, public, unique_login):
        return str(self.magazines.insert({'title': title, 'description': description, 'public': public, 'author': unique_login}))

    def get_magazine(self, magazine_id):
        return self.magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})

    def get_magazine_id(self, title, description):
        mag = self.magazines.find_one({'title': title, 'description': description, 'public': True})
        return str(mag['_id']), mag['author']

    def new_flip(self, magazine_id, link, comment, unique_login, image_link, title, description, date_created=datetime.datetime.now().strftime("%Y-%m-%d")):
        dct = { 'magazine_id': magazine_id,
                'link': link,
                'comment': comment,
                'author': unique_login,
                'image_link': image_link,
                'title': title,
                'description': description,
                'date_created': date_created,
                'clicks': []
        }
        try:
            myhtml = html2text.HTML2Text()
            myhtml.ignore_links = True
            myresponse = requests.get(link)
            text = myhtml.handle(myresponse.text).lower()
            dct.update({key: (sum([1 for elem in lst if elem in text]) + 1 if key in text else 0) for key, lst in config.FAV_KEYWORDS.items()})
        except Exception as e:
            print(e, file=sys.stderr)
        self.flips.insert(dct)

    def article_exists(self, magazine_id, unique_login, image_link, title, description):
        return self.flips.find_one({
            'magazine_id': magazine_id,
            'comment': '',
            'author': unique_login,
            'image_link': image_link,
            'title': title,
            'description': description
        }) is not None

    def get_public_magazines_with_filps(self):
        all_magazines = []
        for magazine in self.magazines.find({'public': True}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            magazine['flips'] = self.get_flips_from_magazine_id(magazine['_id'])
            all_magazines.append(magazine)
        return all_magazines

    def get_priv_magazines_with_filps(self, unique_login):
        priv_magazines = []
        for magazine in self.magazines.find({'public': False, 'author': unique_login}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            magazine['flips'] = self.get_flips_from_magazine_id(magazine['_id'])
            priv_magazines.append(magazine)
        return priv_magazines

    def find_magazine_from_magazine_id(self, magazine_id):
        return self.magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})

    def get_flips_from_magazine_id(self, magazine_id):
        flips = []
        for flip in self.flips.find({'magazine_id': magazine_id}):
            flip['_id'] = str(flip['_id'])
            flips.append(flip)
        return flips

    def set_favorites(self, unique_login, favorites):
        myquery = {'unique_login': unique_login}
        newvalues = {'$set': {'favorites': favorites}}
        self.users.update_one(myquery, newvalues)

    def get_papers(self, favorite, user_favorites, max_paper_nb=99):
        d = 2
        date_check = [{'$eq': ['$date_created', (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")]} for i in range(d)]


        ##si favorite is None
        ##    get les favorites du user,

        ##get que les publics, pas cliqués, pas de l'utilisateur
        fav_lst = user_favorites if favorite is None else [favorite]
        fav_lst = ['$' + fav for fav in fav_lst]

        pipeline = [{'$match': {}},##public
                    {'$addFields': {'total_clicks': {'$size': "$clicks"}}},
                    {'$addFields': {'actual_article': {'$or': date_check}}},##mettre sur une ligne
                    {'$addFields': {'fav_score': {'$sum': fav_lst}}},##mettre sur une ligne
                    {'$sort': bson.son.SON([('actual_article', DESCENDING),
                                            ('fav_score', DESCENDING),
                                            ('total_clicks', DESCENDING),
                                            ('date_created', DESCENDING)
                    ])}
        ]

        res = []
        for i, flip in enumerate(self.flips.aggregate(pipeline)):#{'actual_article': DESCENDING, 'total_clicks': DESCENDING, 'date_created': DESCENDING}}])):
                #'clicks', DESCENDING)):####################################find que les publics, sans le meme auteur que le username, sans le meme clic
            if i > (max_paper_nb - 1):
                break
            flip['_id'] = str(flip['_id'])
            flip['author'] = self.users.find_one({'unique_login': flip['author']})['username']
            res.append(flip)
        return res

    def add_click(self, paper_id, unique_login):
        click_lst = self.flips.find_one({'_id': bson.objectid.ObjectId(paper_id)})['clicks']
        if unique_login in click_lst:
            return False
        click_lst.append(unique_login)
        myquery = {'_id': bson.objectid.ObjectId(paper_id)}
        newvalues = {'$set': {'clicks': click_lst}}
        self.flips.update_one(myquery, newvalues)
        return True
