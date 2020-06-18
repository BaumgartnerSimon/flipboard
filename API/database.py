from pymongo import MongoClient, DESCENDING

import bcrypt

import random
import string

import math

import bson

import timeago, datetime

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

    def __del__(self):
        self.client.close()

    def get_user_from_unique_login(self, unique_login):
        return self.users.find_one({'unique_login': unique_login})

    def username_exists(self, username):
        existing_user = self.users.find_one({'username': username})
        return existing_user is not None

    def register_user(self, username, password, verified=False):
        hashpass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        unique_login = utils.generate_unique_login()
        self.users.insert({'username': username, 'password': hashpass, 'unique_login': unique_login, 'veified': verified, 'favorites': []})
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
            self.users.update_one(myquery, newvalues)
            return True
        return False

    def update_password(self, username, old_password, new_password, unique_login):
        login_user = self.users.find_one({'username': username})
        if login_user:
            if bcrypt.hashpw(old_password.encode('utf-8'), login_user['password']) == login_user['password']:
                hashpass = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                myquery = {'unique_login': unique_login}
                newvalues = {'$set': {'password': hashpass}}
                self.users.update_one(myquery, newvalues)
                return True
        return False

    def add_magazine(self, title, description, public, unique_login):
        return str(self.magazines.insert({'title': title, 'description': description, 'public': public, 'author': unique_login}))

    def get_magazine(self, magazine_id):
        return self.magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})

    def get_magazine_id(self, title, description):
        mag = self.magazines.find_one({'title': title, 'description': description, 'public': True})
        print(f'mag: {mag}', file=sys.stderr)
        return str(mag['_id']), mag['author']

    def new_flip(self, magazine_id, link, comment, unique_login, image_link, title, description, date_created=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")):
        dct = { 'magazine_id': magazine_id,
                'link': link,
                'comment': comment,
                'author': unique_login,
                'image_link': image_link,
                'title': title,
                'description': description,
                'date_created': date_created,
                'clicks': [],
                'public': self.get_magazine(magazine_id)['public']
        }
        try:
            myhtml = html2text.HTML2Text()
            myhtml.ignore_links = True
            myresponse = requests.get(link, allow_redirects=False, timeout=10)
            text = myhtml.handle(myresponse.text).lower()
            text = str(f'{text} {title} {title} {description}')
            dct.update({key: (sum([text.count(elem) for elem in lst if elem in text]) + text.count(key) if key in text else 0) for key, lst in config.FAV_KEYWORDS.items()})
        except Exception as e:
            print(e, file=sys.stderr)
        self.flips.insert(dct)

    def article_exists(self, magazine_id, image_link, title, description):
        return self.flips.find_one({
            'magazine_id': magazine_id,
            'comment': '',
            'image_link': image_link,
            'title': title,
            'description': description
        }) is not None

    def get_public_magazines_with_filps(self):
        all_magazines = []
        for magazine in self.magazines.find({'public': True}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            #magazine['flips'] = self.get_flips_from_magazine_id(magazine['_id'])
            all_magazines.append(magazine)
        return all_magazines

    def get_priv_magazines_with_filps(self, unique_login):
        priv_magazines = []
        for magazine in self.magazines.find({'public': False, 'author': unique_login}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            #magazine['flips'] = self.get_flips_from_magazine_id(magazine['_id'])
            priv_magazines.append(magazine)
        return priv_magazines

    def find_magazine_from_magazine_id(self, magazine_id):
        return self.magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})

    def get_flips_from_magazine_id(self, magazine_id):
        pipeline = [{'$match': {'magazine_id': magazine_id}},
                    {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1}}
        ]

        flips = []
        #for flip in self.flips.find({'magazine_id': magazine_id}):
        for flip in list(self.flips.aggregate(pipeline)):
            flip['_id'] = str(flip['_id'])
            flip['author'] = self.users.find_one({'unique_login': flip['author']})['username']
            flip['date_created'] = self.make_date_great_again(flip['date_created'])
            flips.append(flip)
        return flips

    def set_favorites(self, unique_login, favorites):
        myquery = {'unique_login': unique_login}
        newvalues = {'$set': {'favorites': favorites}}
        self.users.update_one(myquery, newvalues)

    def make_date_great_again(self, dt):
        dt = datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
        now = datetime.datetime.now()
        diff = now - dt
        if diff.days < 0 or diff.seconds < 0:
            return 'now'
        return timeago.format(dt, now)

    def get_papers(self, favorite, user_favorites, page, max_paper_nb=99):
        d = 2
        date_check = [{'$eq': [{'$substr': ['$date_created', 0, 10]}, (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")]} for i in range(d)]

        ##get que les publics, pas cliqués, pas de l'utilisateur
        fav_lst = user_favorites if favorite is None else [favorite]
        fav_lst = ['$' + fav for fav in fav_lst]

        pipeline = [{'$match': {'public': True}},
                    {'$addFields': {'total_clicks': {'$size': "$clicks"}}},
                    {'$addFields': {'actual_article': {'$or': date_check}}},##mettre sur une ligne
                    {'$addFields': {'fav_score': {'$sum': fav_lst}}},##mettre sur une ligne
                    {'$sort': bson.son.SON([('actual_article', DESCENDING),
                                            ('fav_score', DESCENDING),
                                            ('total_clicks', DESCENDING),
                                            ('date_created', DESCENDING)
                    ])},
                    {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1}}
        ]

        ##'clicks', DESCENDING)):####################################find que les publics, sans le meme auteur que le username, sans le meme clic

        res = []
        all_flips = list(self.flips.aggregate(pipeline))
        print(f'len: {len(all_flips)}', file=sys.stderr)
        for flip in all_flips[(page-1)*max_paper_nb:page*max_paper_nb]:
            flip['_id'] = str(flip['_id'])
            flip['author'] = self.users.find_one({'unique_login': flip['author']})['username']
            flip['date_created'] = self.make_date_great_again(flip['date_created'])
            res.append(flip)
        page_nb = math.ceil(len(all_flips) / float(max_paper_nb))
        return res, page_nb

    def add_click(self, paper_id, unique_login):
        click_lst = self.flips.find_one({'_id': bson.objectid.ObjectId(paper_id)})['clicks']
        if unique_login in click_lst:
            return False
        click_lst.append(unique_login)
        myquery = {'_id': bson.objectid.ObjectId(paper_id)}
        newvalues = {'$set': {'clicks': click_lst}}
        self.flips.update_one(myquery, newvalues)
        return True
