from flask import Flask

app = Flask(__name__, static_folder='../client/build', static_url_path='/')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/data')
def data():
  return {'test': ['test1', 'test2', 'test3']}
