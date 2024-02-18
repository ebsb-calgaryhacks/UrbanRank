import pandas as pd
from sodapy import Socrata

import haversine as hs

from dotenv import load_dotenv
import os

load_dotenv("./backend/.env")

client = Socrata("data.calgary.ca", os.environ.get("MyAppToken"))

def call_calgary_api(database, **kwargs):
    """
    Queries the calgary data api. Database is the id of the database in the calgary data portal. kwargs is the sql arguments, returns a json.
    """
    return client.get(database, **kwargs, limit = 3000)

def get_data(indicators):
    """
    Pass a list of indicators in, all caps.

    Returns a pandas dataframe with communities, indicator, and value columns
    """
    where = ""
    for indicator in indicators:
        where += f"INDICATOR='{indicator}' OR "
    
    where = where[:-4]

    data = pd.DataFrame.from_records(call_calgary_api("xeek-u7v8", where = where))

    return data[["communities", "indicator", "value"]]

def get_community_points():
    """
    Returns community_name, longitude, and latitude of points
    """

    data = pd.DataFrame.from_records(call_calgary_api("j9ps-fyst"))

    return data[["name", "longitude", "latitude"]]

def get_schools():
    """
    Returns school name, boolean whether it's elementary, juniour high, or senior high, and the longitude and latitude
    """

    data = pd.DataFrame.from_records(call_calgary_api("fd9t-tdn2"))

    data["longitude"] = data["point"].apply(lambda x: x['coordinates'][0])
    data["latitude"] = data["point"].apply(lambda x: x['coordinates'][1])
    
    return data[["name", "elem", "junior_h", "senior_h", "longitude", "latitude"]]

def close_schools(point, schools, grade):

    closest = []

    for index, row in schools.iterrows():
        if row[grade] != "Y": continue

        school_point = (row['latitude'], row['longitude'])

        closest.append( (row, hs.haversine(point, school_point)) )

        if len(closest) > 3: 
            closest.sort(key=lambda x: x[1])
            closest.pop()

    return closest

if __name__ == '__main__':
    # results = call_calgary_api(where = "INDICATOR='LOW INCOME' OR INDICATOR='BIKE SCORE'")
    # results = get_data(["BIKE SCORE"])
    # print(results)

    points = get_community_points()
    # print(points)

    schools = get_schools()
    # print(schools)

    community_point = (float(points['latitude'].values[0]), float(points['longitude'].values[0]))

    closest = close_schools(community_point, schools, "senior_h")

    print(community_point)
    print(closest)