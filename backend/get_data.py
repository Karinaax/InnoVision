import pandas as pd
from db_connect import db_connect

def get_data():
    # Haal connectie op
    conn = db_connect()

    # Haal data op in een DataFrame
    query = """
    SELECT 
        d.voornaam AS docent, 
        k2.klascode, 
        o.voornaam AS ouder_voornaam, 
        o.achternaam AS ouder_achternaam, 
        o.logincode, 
        k.voornaam, 
        k.achternaam, 
        h.datumgekregen, 
        h.datumingeleverd, 
        h.deadline, 
        v.naam, 
        v.beschrijving 
    FROM kind k 
    JOIN klas k2 ON k2.klasid = k.klasid
    JOIN docent d ON k2.klasid = d.klasid
    JOIN huiswerk h ON k.id = h.kindid 
    JOIN vak v ON h.vakid = v.id
    JOIN ouder o ON k.ouderid = o.id
    WHERE k2.klascode = 'groep 5' and o.voornaam = 'Julia'
    ORDER BY v.naam
    ;
    """
    df_groep5 = pd.read_sql(query, conn)

    # Sluit connectie
    conn.close()
    return df_groep5
print(get_data())