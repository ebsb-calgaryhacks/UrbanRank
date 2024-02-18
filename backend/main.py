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


@app.route("/getCommunityScores", methods=['GET'])
def getCommunityScores():
    """
    Endpoint for the frontend - returns an overall score for each community
    """
    # Retrieve indicators from query parameters
    print(request)
    indicator_keys = request.args.keys()
    
    indicators_dict = {}
    for key in indicator_keys:
        print(key)
        indicators_dict[key] = request.args.getlist(key)


    # Process indicators as needed
    # indicators_dict = {}
    # for indicator in indicators:
    #     indicator_name, indicator_score = indicator.split(':')
    #     indicators_dict[indicator_name] = float(indicator_score)

    # Assuming the rest of your logic remains the same...
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
        print(f"Score: {indicator_score}")
        total_max_score += (int(indicator_score[0]) * 0.1) * 100
        length +=1

    print(df)
    print(indicators_dict["WALK SCORE"])
    # Multiply each status number by the corresponding indicator score
    df['weighted_status'] = df.apply(lambda row: row['status'] * int(indicators_dict[row['indicator']][0]) * 0.1, axis=1)
    
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
  
@app.route("/boundaries")
def boundaries():
    """
    returns 1 value, boundaries. The value is a dictionary of neighbourhoods, which has a list of latitude and longitude points for a polygon.
    """

    points = call_calgary.get_community_geometry()

    return {"boundaries": points}

