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

import numpy as np

from difflib import SequenceMatcher


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
        user_exists = self.users.find_one({'username': new_username})
        if user_exists:
            return False
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

    def get_labels_items(self, dct):
        labels, items = [], []
        for key, val in dct.items():
            labels.append(key)
            items.append(val)
        items = list(np.exp(items) / np.sum(np.exp(items))*100)
        return dict(zip(labels, items))

    def new_flip(self, magazine_id, link, comment, unique_login, image_link, title, description, date_created=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"), verified=False):
        dct = { 'magazine_id': magazine_id,
                'link': link,
                'comment': comment,
                'author': unique_login,
                'image_link': image_link,
                'title': title,
                'description': description,
                'date_created': date_created,
                'clicks': [],
                'verified': verified,
                'public': self.get_magazine(magazine_id)['public']
        }
        try:
            myhtml = html2text.HTML2Text()
            myhtml.ignore_links = True
            myresponse = requests.get(link, allow_redirects=False, timeout=10)
            text = myhtml.handle(myresponse.text).lower()
            text = str(f'{text} {title} {title} {description}')
            tmp = {key: (sum([text.count(elem) for elem in lst if elem in text]) + text.count(key) if key in text else 0) for key, lst in config.FAV_KEYWORDS.items()}
            tmp = self.get_labels_items(tmp)
            dct.update(tmp)
        except Exception as e:
            print(e, file=sys.stderr)
        self.flips.insert(dct)

    def article_exists(self, image_link, title, description):
        return (self.flips.find_one({
            'image_link': image_link,
            'title': title,
            'description': description
        }) is not None)

    def get_public_magazines_with_filps(self):
        all_magazines = []
        for magazine in self.magazines.find({'public': True}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            all_magazines.append(magazine)
        return all_magazines

    def get_priv_magazines_with_filps(self, unique_login):
        priv_magazines = []
        for magazine in self.magazines.find({'public': False, 'author': unique_login}):
            magazine['_id'] = str(magazine['_id'])
            magazine['author'] = self.users.find_one({'unique_login': magazine['author']})['username']
            priv_magazines.append(magazine)
        return priv_magazines

    def find_magazine_from_magazine_id(self, magazine_id):
        return self.magazines.find_one({'_id': bson.objectid.ObjectId(magazine_id)})

    def get_flips_from_magazine_id(self, magazine_id):
        pipeline = [{'$match': {'magazine_id': magazine_id}},
                    {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1, 'verified': 1}}
        ]

        flips = []
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

    def get_papers(self, favorite, user_favorites, page, topic, unique_login, max_paper_nb=99):
        d = 2
        date_check = [{'$eq': [{'$substr': ['$date_created', 0, 10]}, (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")]} for i in range(d)]

        try:
            user_favorites.remove()
        except:
            pass
        fav_lst =  [favorite] if topic else ([favorite] if favorite else []) + user_favorites
        fav_lst = [{'$multiply': ['$' + fav, 2/(i+1)]} for i, fav in enumerate(fav_lst)]
        if (fav_lst == [] or favorite is None) and (unique_login is not None):
            print('getting results from clicked', file=sys.stderr)
            return self.find_clicked(unique_login, page, max_paper_nb)
        print('getting results', file=sys.stderr)

        pipeline = [{'$match': {'public': True, 'not_same_author': {'$ne': ['$author', unique_login]}}},
                    {'$addFields': {'total_clicks': {'$size': "$clicks"},
                                    'actual_article': {'$or': date_check},
                                    'fav_score': {'$sum': fav_lst}}}
        ] + ([] if fav_lst == [] else [{'$match': {'fav_score': {'$gte': 1}}}]) + [{'$sort': bson.son.SON([('actual_article', DESCENDING),
                                                                                                           ('fav_score', DESCENDING),
                                                                                                           ('total_clicks', DESCENDING),
                                                                                                           ('date_created', DESCENDING)
        ])}, {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1, 'fav_score': 1, 'verified': 1}}]

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

    def find_not_clicked(self, unique_login):
        d = 2
        date_check = [{'$eq': [{'$substr': ['$date_created', 0, 10]}, (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")]} for i in range(d)]

        pipeline = [{'$match': {'public': True, 'not_same_author': {'$ne': ['$author', unique_login]}}},
                    {'$addFields': {'total_clicks': {'$size': "$clicks"},
                                    'actual_article': {'$or': date_check},
                                    'user_has_clicked': {'$in': [unique_login, '$clicks']}}},
                    {'$match': {'actual_article': True,
                                'user_has_clicked': False}},
                    {'$sort': bson.son.SON([('total_clicks', DESCENDING),
                                            ('date_created', DESCENDING)
                    ])},
                    {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1, 'verified': 1}}
        ]
        not_clicked_articles = list(self.flips.aggregate(pipeline))
        return not_clicked_articles

    def find_clicked(self, unique_login, page, max_paper_nb=99):
        not_clicked_articles = self.find_not_clicked(unique_login)
        d = 2
        date_check = [{'$eq': [{'$substr': ['$date_created', 0, 10]}, (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")]} for i in range(d)]

        pipeline = [{'$match': {'public': True, 'not_same_author': {'$ne': ['$author', unique_login]}}},
                    {'$addFields': {'total_clicks': {'$size': "$clicks"},
                                    'actual_article': {'$or': date_check},
                                    'user_has_clicked': {'$in': [unique_login, '$clicks']}}},
                    {'$match': {'actual_article': True,
                                'user_has_clicked': True}},
                    {'$sort': bson.son.SON([('total_clicks', DESCENDING),
                                            ('date_created', DESCENDING)
                    ])},
                    {'$project': {'author': 1, 'comment': 1, 'date_created': 1, 'description': 1, 'image_link': 1, 'link': 1, 'magazine_id': 1, 'title': 1, 'verified': 1}}
        ]

        res = []
        clicked_articles = list(self.flips.aggregate(pipeline))
        print(f'len: {len(clicked_articles)}', file=sys.stderr)
        for unclicked in not_clicked_articles:
            unclicked['score'] = sum(SequenceMatcher(None, unclicked['title'], clicked['title']).ratio() for clicked in clicked_articles)
        not_clicked_articles = sorted(not_clicked_articles, key=lambda k: k['score'], reverse=True)

        for article in not_clicked_articles[(page-1)*max_paper_nb:page*max_paper_nb]:
            article['_id'] = str(article['_id'])
            article['author'] = self.users.find_one({'unique_login': article['author']})['username']
            article['date_created'] = self.make_date_great_again(article['date_created'])
            res.append(article)
        page_nb = math.ceil(len(not_clicked_articles) / float(max_paper_nb))
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
