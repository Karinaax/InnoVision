#Imports voor API, verbinding met database en het verkrijgen van frotend data. 
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import text
from db_connect import db_connect 

#Creërt API
app = Flask(__name__) 
CORS(app)


@app.route('/api/login', methods=['POST'])
def login_met_logincode():
    data = request.get_json()
    logincode = data.get("logincode") #Ontvangt data van frontend
    print(f"Ontvangen logincode: '{logincode}' (type: {type(logincode)}, lengte: {len(str(logincode)) if logincode else 'None'})")

    if not logincode: 
        return jsonify({"error": "Geen logincode meegegeven"}), 400

    try: 
        conn = db_connect() #Connectie met database 
        if not conn:
            print("Geen connectie met DB") 
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500

        #Gaat door tabel logincode en controleert of de ingevoerde code overeenkomt met een code in het tabel
        query_all = text("SELECT logincode FROM ouder") 
        alle_codes = conn.execute(query_all).fetchall()
        alle_codes_str = [str(row[0]) for row in alle_codes] 
        print(f"Alle logincodes in DB: {alle_codes_str}")

        query = text("SELECT * FROM ouder WHERE CAST(logincode AS TEXT) = :logincode")
        result = conn.execute(query, {"logincode": str(logincode)}).mappings().fetchone()

        print(f"Resultaat query login: {result}") 

        conn.close()

        if result:
            return jsonify(dict(result)) #Als de logincode bestaat, hgaat het verder naar de volgende pagina
        else:
            return jsonify({"error": "Ongeldige code"}), 401 #Als het niet bestaat, geeft het een error aan. 

    except Exception as e:
        print(f"Exception bij login: {e}")
        return jsonify({"error": f"Serverfout: {str(e)}"}), 500
    
@app.route('/api/huiswerk', methods=['GET'])
def haal_huiswerk_op_voor_ouder():
    ouder_id = request.args.get("ouder_id")  # Haal ouder_id op uit de request

    if not ouder_id:
        return jsonify({"error": "Geen ouder ID meegegeven"}), 400

    try:
        conn = db_connect()  # Connectie met de database
        if not conn:
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500

        query = text("""
            SELECT huiswerk.id, huiswerk.vakid, vak.naam AS vaknaam, vak.icoon AS vakicoon, huiswerk.kindid, kind.voornaam AS kindnaam, huiswerk.resultaat, huiswerk.datumgekregen, huiswerk.datumafgevinkt, huiswerk.deadline, huiswerk.type
            FROM huiswerk
            JOIN vak ON huiswerk.vakid = vak.id
            JOIN kind ON huiswerk.kindid = kind.id
            WHERE kind.ouderid = :ouder_id
        """)
        huiswerk_data = conn.execute(query, {"ouder_id": ouder_id}).mappings().fetchall()
        conn.close()

        return jsonify([dict(row) for row in huiswerk_data])  # Huiswerkdata in JSON-formaat

    except Exception as e:
        print(f"Exception bij ophalen huiswerk: {e}")
        return jsonify({"error": f"Serverfout: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)
