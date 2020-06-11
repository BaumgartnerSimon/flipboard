from pymongo import MongoClient, DESCENDING

import bcrypt

import random
import string

import bson

import datetime

import sys

import config
import utils


class Database:
    def __init__(self):
        self.client = MongoClient(host=config.MONGO_API)
        self.mydb = self.client['flipboard']
        self.users = self.mydb.users

    def get_user_from_unique_login(self, unique_login):
        return self.users.find_one({'unique_login': unique_login})

    def username_exists(self, username):
        #mydb = client['flipboard']
        #users = mydb.users
        existing_user = self.users.find_one({'username': username})
        return existing_user is not None

    def register_user(self, username, password, verified=False):
        hashpass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.users.insert({'username': username, 'password': hashpass, 'unique_login': utils.generate_unique_login(), 'veified': verified, 'favorites': []})

    def login(self, username, password):
        #client = MongoClient(host=config.MONGO_API)
        #mydb = client['flipboard']
        #users = mydb.users
        login_user = self.users.find_one({'username': username})
        if login_user:
            if bcrypt.hashpw(password.encode('utf-8'), login_user['password']) == login_user['password']:
                return {'success': True, 'message': 'Successfully logged in', 'username': login_user['username'], 'unique_login': login_user['unique_login']}
                #return jsonify({'success': True, 'message': 'Successfully logged in', 'username': login_user['username'], 'unique_login': login_user['unique_login']})
        return {'success': False, 'message': 'Wrong username or password'}

    def update_username(self, old_username, new_username, unique_login):
        #client = MongoClient(host=config.MONGO_API)
        #mydb = client['flipboard']
        #users = mydb.users

        login_user = self.users.find_one({'username': old_username})
        if login_user:
            myquery = {'unique_login': unique_login}
            newvalues = {'$set': {'username': new_username}}
            users.update_one(myquery, newvalues)
            return True#jsonify({'success': True, 'message': 'Successfully updated username'})
        return False

    def update_password(self, username, old_password, new_password, unique_login):
        #client = MongoClient(host=config.MONGO_API)
        #mydb = client['flipboard']
        #users = mydb.users
        login_user = self.users.find_one({'username': username})
        if login_user:
            if bcrypt.hashpw(old_password.encode('utf-8'), login_user['password']) == login_user['password']:
                hashpass = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                myquery = {'unique_login': unique_login}
                newvalues = {'$set': {'password': hashpass}}
                users.update_one(myquery, newvalues)
                return True#jsonify({'success': True, 'message': 'Updated password'})
        return False
