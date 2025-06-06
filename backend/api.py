#Imports voor API, verbinding met database en het verkrijgen van frotend data. 
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import text
from db_connect import db_connect 


#Creërt API
app = Flask(__name__) 
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5500", "http://127.0.0.1:5500"]}})



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
    datum = request.args.get("datum")  # Haal datum op uit de request

    if not ouder_id:
        return jsonify({"error": "Geen ouder ID meegegeven"}), 400

    try:
        conn = db_connect()  # Connectie met de database
        if not conn:
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500

        # Basis query
        query = text("""
            SELECT huiswerk.id, huiswerk.vakid, vak.beschrijving AS beschrijving, 
                   vak.naam AS vaknaam, vak.icoon AS vakicoon, huiswerk.kindid, 
                   kind.voornaam AS kindnaam, huiswerk.resultaat, huiswerk.datumgekregen, 
                   huiswerk.datumafgevinkt, huiswerk.deadline, huiswerk.type,
                   vak.uitlegvideo
            FROM huiswerk
            JOIN vak ON huiswerk.vakid = vak.id
            JOIN kind ON huiswerk.kindid = kind.id
            WHERE kind.ouderid = :ouder_id
        """)

        # Voeg datum filter toe als datum is meegegeven
        if datum:
            query = text("""
                SELECT huiswerk.id, huiswerk.vakid, vak.beschrijving AS beschrijving, 
                       vak.naam AS vaknaam, vak.icoon AS vakicoon, huiswerk.kindid, 
                       kind.voornaam AS kindnaam, huiswerk.resultaat, huiswerk.datumgekregen, 
                       huiswerk.datumafgevinkt, huiswerk.deadline, huiswerk.type,
                       vak.uitlegvideo, vak.extrauitleg
                FROM huiswerk
                JOIN vak ON huiswerk.vakid = vak.id
                JOIN kind ON huiswerk.kindid = kind.id
                WHERE kind.ouderid = :ouder_id
                AND DATE(huiswerk.deadline) = :datum
            """)
            huiswerk_data = conn.execute(query, {"ouder_id": ouder_id, "datum": datum}).mappings().fetchall()
        else:
            huiswerk_data = conn.execute(query, {"ouder_id": ouder_id}).mappings().fetchall()

        conn.close()

        return jsonify([dict(row) for row in huiswerk_data])  # Huiswerkdata in JSON-formaat

    except Exception as e:
        print(f"Exception bij ophalen huiswerk: {e}")
        return jsonify({"error": f"Serverfout: {str(e)}"}), 500
@app.route('/api/docent', methods=['GET'])
def haal_docent_op():
    kind_id = request.args.get("kind_id")  # Gebruik kind_id als parameter

    if not kind_id:
        return jsonify({"error": "Geen kind ID meegegeven"}), 400

    try:
        conn = db_connect()  # Connectie met de database
        if not conn:
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500

        # Query om de juiste docent op te halen via de klas van het kind
        query = text("""
            SELECT docent.id, docent.klasid, docent.voornaam, docent.achternaam, docent.geslacht
            FROM docent
            JOIN klas ON docent.klasid = klas.klasid
            JOIN kind ON klas.klasid = kind.klasid
            WHERE kind.id = :kind_id
        """)
        docent_data = conn.execute(query, {"kind_id": kind_id}).mappings().fetchall()
        conn.close()

        if not docent_data:
            return jsonify({"error": "Geen docent gevonden voor het gegeven kind ID"}), 404

        return jsonify([dict(row) for row in docent_data])  # Docentdata in JSON-formaat

    except Exception as e:
        print(f"Exception bij ophalen docent: {e}")
        return jsonify({"error": f"Serverfout: {str(e)}"}), 500

@app.route('/api/huiswerk/afvinken', methods=['POST'])
def huiswerk_afvinken():
    try:
        data = request.get_json()
        huiswerk_id = data.get('huiswerk_id')
        datum_afgevinkt = data.get('datum_afgevinkt')  # Kan null zijn
        
        if not huiswerk_id:
            return jsonify({'error': 'huiswerk_id is verplicht'}), 400
            
        conn = db_connect()
        if not conn:
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500
            
        query = text("""
            UPDATE huiswerk 
            SET datumafgevinkt = :datum_afgevinkt 
            WHERE id = :huiswerk_id
        """)
        conn.execute(query, {"datum_afgevinkt": datum_afgevinkt, "huiswerk_id": huiswerk_id})
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)