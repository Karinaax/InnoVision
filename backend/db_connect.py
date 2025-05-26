import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

def db_connect():
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    try:
        engine = create_engine(f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}")
        connection = engine.connect()
        return connection
    except Exception as e:
        print(f"Failed to connect: {e}")
        return "Failed to connect"
 
# =======
# >>>>>>> 9a9d1c9091e718e965f7153019a148714ae07c4c


def db_connect():
    # Fetch variables
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    # Connect to the database
    try:
        engine = create_engine(f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}")
        connection = engine.connect()

        return connection

    except Exception as e:
        print(f"Failed to connect: {e}")
        return "Failed to connect"
