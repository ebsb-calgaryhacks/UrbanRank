from flask import Flask, request, render_template, Response
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app)


@app.route("/")
def hello_world():
    return {'data': 'This is the default return content'}