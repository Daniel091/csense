import flask
from flask import Flask
from flask import request
app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods = ['POST', 'GET', 'PUT', 'DELETE'])
@app.route('/<path:path>', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def catch_all(path):
        return 'You want path: %s, %s' % (path, request.method)

if __name__ == '__main__':
        app.run()
