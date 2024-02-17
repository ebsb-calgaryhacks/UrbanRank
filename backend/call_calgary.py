import pandas as pd
from sodapy import Socrata

from dotenv import load_dotenv
import os

load_dotenv("./.env")

client = Socrata("data.calgary.ca", os.environ.get("MyAppToken"))

def call_calgary_api():
    endpoint = "xeek-u7v8"

    query = endpoint

    return client.get(query, limit = 3000)