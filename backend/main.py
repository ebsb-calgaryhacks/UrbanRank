import call_calgary

from flask import Flask, request, render_template, Response
from flask_cors import CORS, cross_origin

import pandas as pd
from sodapy import Socrata

from dotenv import load_dotenv
import os

app = Flask(__name__)

CORS(app)

@app.route("/")
def hello_world():
    return {'data': 'This is the default return content'}

@app.route("/everything")
def everything():
    """
    Test, returns total records returned
    """
    results = call_calgary.call_calgary_api()

    return {'length': len(results)}