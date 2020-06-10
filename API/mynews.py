import sys
import requests

from config import MONGO_API, NEWSAPI_KEY
import utils

from pymongo import MongoClient
import bcrypt

import datetime

#{'general': 41, 'technology': 10, 'business': 7, 'sports': 11, 'entertainment': 8, 'health': 1, 'science': 3}
##https://stackoverflow.com/questions/8897593/how-to-compute-the-similarity-between-two-text-documents
##

def get_articles_from_source(source):
    page = 1
    pageSize = 100
    url = (f"https://newsapi.org/v2/everything?sources={source}&pageSize={pageSize}&page={page}&apiKey={NEWSAPI_KEY}")
    print(f"url: {url}", file=sys.stderr)
    response = requests.get(url)
    #error = True if response.json()['status'] != 'ok' else False
    print(f"results: {response.json()}")#, file=sys.stderr)
    return response.json()['articles']
    """error = True
    while error:
        url = (f"https://newsapi.org/v2/everything?sources={source}&pageSize={pageSize}&page={page}&apiKey={NEWSAPI_KEY}")
        response = requests.get(url)
        error = True if response.json()['status'] != 'ok' else False
        print(f"results: {response.json()}")#, file=sys.stderr)"""

"""
##pas possible il faut un compte payant

def get_articles_from_source(source):
    page = 1
    pageSize = 100
    totalResults = 99999
    error = True
    while error == True or totalResults > (page*pageSize):
        print('starting')
        url = (f"https://newsapi.org/v2/everything?sources={source}&pageSize={pageSize}&page={page}&apiKey={NEWSAPI_KEY}")
        print(f"url: {url}")
        response = requests.get(url)
        error = True if response.json()['status'] != 'ok' else False
        print(f"results: {response.json()}")#, file=sys.stderr)
        if error:
            continue
        totalResults = response.json()['totalResults']
        page += 1
"""

url = (f"https://newsapi.org/v2/sources?language=en&apiKey={NEWSAPI_KEY}")
error = True
client = MongoClient(host=MONGO_API)
mydb = client['flipboard']
while error:
    response = requests.get(url)
    error = True if response.json()['status'] != 'ok' else False
    sources = response.json()['sources']
    categories = {}
    #print(sources, file=sys.stderr)
    for source in sources:
        #print(source, file=sys.stderr)
        print(f"name: {source['name']}", file=sys.stderr)
        print(f"id: {source['id']}", file=sys.stderr)##pour get les headlines
        print(f"description: {source['description']}", file=sys.stderr)
        print(f"url: {source['url']}", file=sys.stderr)
        print(f"category: {source['category']}", file=sys.stderr)
        print("\n", file=sys.stderr)
        if source['category'] in categories:
            categories[source['category']] += 1
        else:
            categories[source['category']] = 1
        users = mydb.users
        existing_user = users.find_one({'username': source['name']})
        if existing_user is None:
            hashpass = bcrypt.hashpw('admin'.encode('utf-8'), bcrypt.gensalt())
            unique_login = utils.generate_unique_login()
            users.insert({'username': source['name'], 'password': hashpass, 'unique_login': unique_login, 'verified': True, 'favorites': []})
            magazines = mydb.magazines
            _id = str(magazines.insert({'title': source['name'], 'description': source['description'], 'public': True, 'author': unique_login}))#####date created
            try:
                articles = get_articles_from_source(source['id'])
                flips = mydb.flips
                for article in articles:
                    print({'magazine_id': _id,
                           'link': article['url'],
                           'comment': '',
                           'author': unique_login,
                           'image_link': article['urlToImage'],
                           'title': article['title'],
                           'description': article['description']
                    }, file=sys.stderr)
                    flips.insert({'magazine_id': _id,
                                  'link': article['url'],
                                  'comment': '',
                                  'author': unique_login,
                                  'image_link': article['urlToImage'],
                                  'title': article['title'],
                                  'description': article['description'],
                                  'date_created': datetime.datetime.strptime(article['publishedAt'].split('T')[0], "%Y-%m-%d").strftime("%d:%m:%Y"),
                                  'clicks': 0
                    })

            except Exception as e:
                print(e, file=sys.stderr)
                continue
            #print(f'_id: {_id}')
            """source id, name
            author
            title
            description
            url
            urlToImage
            publishedAt
            content"""
            ###flip les articles
    print(categories, file=sys.stderr)



##import threading
##import mongodb
##import config
##import une classe de news?

##start un thread
##get les journaux
##pour chaque journal:
##    le mettre dans la db si il n'y est pas
##    get les headlines et les mettre dans la db




"""
import summary

links = ['http://stackoverflow.com/users/76701/ram-rachum',
          'https://flipboard.com/@nationalgeographic/a-new-era-of-human-spaceflight-has-begun-adkgjdo8oakgl1l0',
          'https://www.youtube.com/watch?v=z9uAN6YNkP0',
          'https://en.wikipedia.org/wiki/Osmia_calaminthae'
]

print("Imported mynews!", file=sys.stderr)

for link in links:
    print(f"link: {link}", file=sys.stderr)
    s = summary.Summary(link)
    s.extract()
    print(f"Title: {s.title}", file=sys.stderr)
    print(f"Description: {s.description}", file=sys.stderr)
    print(f"Image: {s.image}", file=sys.stderr)
"""
