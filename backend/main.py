from flask import Flask, request, render_template, Response
from flask_cors import CORS, cross_origin

import pandas as pd
from sodapy import Socrata

from dotenv import load_dotenv
import os
load_dotenv("./.env")

app = Flask(__name__)

CORS(app)

client = Socrata("data.calgary.ca", os.environ.get("OPEN_API_KEY"))

@app.route("/")
def hello_world():
    return {'data': 'This is the default return content'}

@app.route("/everything")
def everything():
    results = client.get("xeek-u7v8", limit = 3000)

    return {'length': len(results)}