import sys
import requests

from config import MONGO_API, NEWSAPI_KEY, FAV_KEYWORDS
import utils

from database import Database

from pymongo import MongoClient
import bcrypt

import datetime

#import html2text
#import requests


#{'general': 41, 'technology': 10, 'business': 7, 'sports': 11, 'entertainment': 8, 'health': 1, 'science': 3}
##https://stackoverflow.com/questions/8897593/how-to-compute-the-similarity-between-two-text-documents
##

def get_articles_from_source(source):
    page = 1
    pageSize = 40#100
    url = (f"https://newsapi.org/v2/everything?sources={source}&pageSize={pageSize}&page={page}&apiKey={NEWSAPI_KEY}")
    response = requests.get(url)
    return response.json()['articles']

def create_user_and_magazine(username, description):
    global mydb
    print(f'username: {username}, description: {description}', file=sys.stderr)
    if not mydb.username_exists(username):
        unique_login = mydb.register_user(username, 'admin', verified=True)
        return mydb.add_magazine(username, description, True, unique_login), unique_login
    return mydb.get_magazine_id(username, description)

def get_articles(source_id, magazine_id, unique_login):
    global mydb
    try:
        articles = get_articles_from_source(source_id)
        for article in articles:
            if mydb.article_exists(magazine_id, unique_login, article['urlToImage'], article['title'], article['description']):
                continue
            print({'magazine_id': magazine_id, 'link': article['url'], 'comment': '', 'author': unique_login, 'image_link': article['urlToImage'], 'title': article['title'], 'description': article['description']}, file=sys.stderr)
            mydb.new_flip(magazine_id, article['url'], '', unique_login, article['urlToImage'], article['title'], article['description'], article['publishedAt'].split('T')[0])
    except Exception as e:
        print(e, file=sys.stderr)

import time
time1 = time.time()
mydb = Database()
url = (f"https://newsapi.org/v2/sources?language=en&apiKey={NEWSAPI_KEY}")
error = True
while error:
    response = requests.get(url)
    error = True if response.json()['status'] != 'ok' else False
    sources = response.json()['sources']
    categories = {}
    for source in sources:
        if source['category'] in categories:
            categories[source['category']] += 1
        else:
            categories[source['category']] = 1
        _id, unique_login = create_user_and_magazine(source['name'], source['description'])
        get_articles(source['id'], _id, unique_login)

time2 = time.time()
print('function took {:.3f} ms'.format((time2-time1)*1000.0), file=sys.stderr)

"""text = 'some super news talking about food'
total_scores = {key: (sum([1 for elem in lst if elem in text]) + 1 if key in text else 0) for key, lst in FAV_KEYWORDS.items()}
#    total_scores[key] = sum([1 for elem in lst if elem in text]) + 1 if key in text else 0

#total_scores = []
#for key, lst in FAV_KEYWORDS.items():
#    total_scores.append({'key': key, 'score': (sum([1 for elem in lst if elem in text]) + 1 if key in text else 0)})

#total_scores = sorted(total_scores, key=lambda k: k['score'], reverse=True)

print(f"total_scores {total_scores}", file=sys.stderr)"""

##import threading
##import mongodb
##import config
##import une classe de news?

##start un thread
##get les journaux
##pour chaque journal:
##    le mettre dans la db si il n'y est pas
##    get les headlines et les mettre dans la db
