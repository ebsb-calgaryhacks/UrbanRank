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

@app.route("/boundaries")
def boundaries():
    """
    returns 1 value, boundaries. The value is a dictionary of neighbourhoods, which has a list of latitude and longitude points for a polygon.
    """

    points = call_calgary.get_community_geometry()

    return {"boundaries": points}