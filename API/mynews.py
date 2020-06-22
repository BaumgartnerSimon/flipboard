import sys
import requests

from config import MONGO_API, NEWSAPI_KEY_LST, FAV_KEYWORDS
import utils

from database import Database

from pymongo import MongoClient
import bcrypt

import datetime

import multiprocessing

#{'general': 41, 'technology': 10, 'business': 7, 'sports': 11, 'entertainment': 8, 'health': 1, 'science': 3}
##https://stackoverflow.com/questions/8897593/how-to-compute-the-similarity-between-two-text-documents
##

def get_articles_from_source(source, idx):
    page = 1
    pageSize = 5#100
    url = (f"https://newsapi.org/v2/everything?language=en&sources={source}&pageSize={pageSize}&page={page}&apiKey={NEWSAPI_KEY_LST[idx]}")
    response = requests.get(url)
    articles = []
    try:
        articles = response.json()['articles']
    except:
        idx += 1
        if idx >= len(NEWSAPI_KEY_LST):
            print('ERROR! You made to much requests with every API KEYS')
            return []
        return get_articles_from_source(source, idx)
    return articles

def create_user_and_magazine(username, description, mydb):
    if not mydb.username_exists(username):
        unique_login = mydb.register_user(username, 'admin', verified=True)
        return mydb.add_magazine(username, description, True, unique_login), unique_login
    return mydb.get_magazine_id(username, description)

def get_articles(source_id, magazine_id, unique_login, idx, mydb):
    try:
        articles = get_articles_from_source(source_id, idx)
        for article in articles:
            if mydb.article_exists(magazine_id, article['urlToImage'], article['title'], article['description']):
                continue
            print({'magazine_id': magazine_id,
                   'link': article['url'],
                   'comment': '',
                   'author': unique_login,
                   'image_link': article['urlToImage'],
                   'title': article['title'],
                   'description': article['description']
            }, file=sys.stderr)
            mydb.new_flip(magazine_id, article['url'], '', unique_login, article['urlToImage'], article['title'], article['description'], article['publishedAt'].split('Z')[0])
    except Exception as e:
        print(e, file=sys.stderr)

def process_url(input_queue):
    mydb = Database()
    while True:
        source = input_queue.get()
        if source is None:
            break
        _id, unique_login = create_user_and_magazine(source['name'], source['description'], mydb)
        get_articles(source['id'], _id, unique_login, idx, mydb)

import time
time1 = time.time()
mydb = Database()
idx = 0
error = True
input_queue = multiprocessing.Queue()
workers = []

# Create workers.
for i in range(multiprocessing.cpu_count()):
    p = multiprocessing.Process(target=process_url, args=(input_queue,))
    workers.append(p)
    p.start()

while error:
    url = (f"https://newsapi.org/v2/sources?language=en&apiKey={NEWSAPI_KEY_LST[idx]}")
    response = requests.get(url)
    error = True if response.json()['status'] != 'ok' else False
    sources = []
    try:
        sources = response.json()['sources']
    except:
        idx += 1
        if idx >= len(NEWSAPI_KEY_LST):
            print('ERROR! You made to much requests with every API KEYS')
            break
        error = True
        continue
    for source in sources:
        input_queue.put(source)

for w in workers:
    input_queue.put(None)

for w in workers:
    w.join()

time2 = time.time()
print('function took {:.3f} ms'.format((time2-time1)*1000.0), file=sys.stderr)
