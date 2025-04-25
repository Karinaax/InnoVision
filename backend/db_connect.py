import psycopg2
import os
from dotenv import load_dotenv

# Laad de .env variabelen in het os.environ dictionary
load_dotenv()
# Maak connectie
def db_connect():
    conn = psycopg2.connect(
        dbname="innovision",
        user= os.environ.get("DB_USERNAME"),
        password= os.environ.get("DB_PASSWORD"),
        host="localhost",
        port="5432"
    )
    return conn

