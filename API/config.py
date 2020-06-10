FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000
FLASK_DEBUG = False
FLASK_THREADED = True

import os
MONGO_DATABASE = os.environ['MONGO_DATABASE']
MONGO_ROOT_USERNAME = os.environ['MONGO_ROOT_USERNAME']
MONGO_ROOT_PASSWORD = os.environ['MONGO_ROOT_PASSWORD']
MONGO_API = 'mongodb://{}:{}@db:27017/{}'.format(MONGO_ROOT_USERNAME, MONGO_ROOT_PASSWORD, MONGO_DATABASE)

SALT = 'zmeflzejZEFIlqksjdAOQM3JQDJSJ82'

#NEWSAPI_KEY = '3e2d2a5313cf4208a83cb8c65d1e9677'
NEWSAPI_KEY = 'd39f218034e64188b180840208bc69d6'

FAVORITE_LST = ['news', 'technology', 'sports', 'business', 'politics',
                'celebrity news', 'recipes', 'science', 'design', 'weather',
                "women's news", 'photography', 'compuer science', 'travel',
                'healthy eating', 'fashion', 'beauty', 'mindfulness',
                'world economy', 'sustainability', 'street art', 'music',
                'music festivals', 'tv', 'movies', 'cool stuff', 'workouts',
                'home', 'classical music', 'fortune 500', 'gaming',
                'electric vehicles', 'leadership', 'food & dining',
                'national parks', 'startups', 'health', 'digital photography',
                'breakthroughs', 'autos', 'advertising', 'road trips', 'books',
                'running', 'foreign policy', 'education', 'new york city',
                'architecture', 'yoga', 'dogs', 'parenting', 'basketball',
                'entrepreneurship', 'tiny house movement', 'middle east',
                'self-improvement', 'cycling', 'us congress apps', 'star wars',
                'personal finance', 'diy', 'sleep', 'green living', 'nfl',
                'space', 'coffee', 'outdoors', 'gardening', "how-to's", 'writing',
                'crafting', 'motorsport', 'weddings', 'interior design', 'memes',
                'work-life balance'
]
