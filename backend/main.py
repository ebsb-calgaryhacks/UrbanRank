import call_calgary
import requests
from flask import Flask, request, render_template, Response, jsonify
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

@app.route("/getCommunityScores", methods=['POST'])
def getCommunityScores():
    """
    Endpoint for the frontend - returns an overall score for each community
    """
    request_data = request.get_json()
    
    indicators_dict = {indicator['indicator_name']: indicator['indicator_score'] for indicator in request_data['indicators']}

    df = call_calgary.get_data(list(indicators_dict.keys()))

    status_mapping = {
        'Between benchmark and target': 50,
        'At or below benchmark': 0,
        'At or above target': 100
    }
    
    df['status'] = df['status'].replace(status_mapping)

    # Calculate highest possible total score
    total_max_score = 0
    length = 0

    for indicator_name, indicator_score in indicators_dict.items():
        total_max_score += (indicator_score * 0.1) * 100
        length +=1

    # Multiply each status number by the corresponding indicator score
    df['weighted_status'] = df.apply(lambda row: row['status'] * indicators_dict[row['indicator']] * 0.1, axis=1)
    
    # Sum up the weighted status numbers by community
    community_weighted_status = df.groupby('communities')['weighted_status'].sum()
     
    # Divide the weighted status number by the total possible number to get a percentage
    community_scores = community_weighted_status / total_max_score * 100
    
    # Ensure no community score exceeds the maximum
    for community, score in community_scores.items():
        if score > 100:
            community_scores[community] = 100
    
    # Return JSON response
    return jsonify(community_scores.to_dict())
