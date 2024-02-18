import pandas as pd
from sodapy import Socrata

from dotenv import load_dotenv
import os

load_dotenv(".env")

client = Socrata("data.calgary.ca", os.environ.get("MyAppToken"))

def call_calgary_api(**kwargs):
    """
    Queries the calgary data api. Pass in sql arguments, returns a json.
    """
    endpoint = "xeek-u7v8"

    return client.get(endpoint, **kwargs, limit = 3000)

def get_data(indicators):
    """
    Pass a list of indicators in, all caps.

    Returns a pandas dataframe with communities, indicator, and value columns
    """
    where = ""
    for indicator in indicators:
        where += f"INDICATOR='{indicator}' OR "
    
    where = where[:-4]

    data = pd.DataFrame.from_records(call_calgary_api(where = where))

    return data[["communities", "indicator", "status", "quadrant"]]


if __name__ == '__main__':
    #results = call_calgary_api(where = "INDICATOR='LOW INCOME' OR INDICATOR='BIKE SCORE'")
    results = get_data(["BIKE SCORE"])
    print(results)