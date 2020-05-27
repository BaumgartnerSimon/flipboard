_DOCKER = True

FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000
FLASK_DEBUG = False
FLASK_THREADED = True

#DB_HOST = 'localhost'
#DB_PORT = 3306
#DB_USER = 'root'
#DB_PASSWORD = ''
#DB_NAME = 'trello'

if _DOCKER:
    import os
    import sys
    MONGO_DATABASE = os.environ['MONGO_DATABASE']
    MONGO_ROOT_USERNAME = os.environ['MONGO_ROOT_USERNAME']
    MONGO_ROOT_PASSWORD = os.environ['MONGO_ROOT_PASSWORD']
    MONGO_API = 'mongodb://{}:{}@db:27017/{}'.format(MONGO_ROOT_USERNAME, MONGO_ROOT_PASSWORD, MONGO_DATABASE)
    print('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', file=sys.stderr)
    print(MONGO_DATABASE, file=sys.stderr)
    print(MONGO_ROOT_USERNAME, file=sys.stderr)
    print(MONGO_ROOT_PASSWORD, file=sys.stderr)
    print(MONGO_API, file=sys.stderr)
else:
    MONGO_DATABASE = 'flipboard'
    MONGO_ROOT_USERNAME = 'root'
    MONGO_ROOT_PASSWORD = 'root'
    #print(MONGO_DATABASE)
    #print(MONGO_ROOT_USERNAME)
    #print(MONGO_ROOT_PASSWORD)
    

    #DB_HOST = 'db'
    #DB_PASSWORD = 'root'

SALT = 'zmeflzejZEFIlqksjdAOQM3JQDJSJ82'
