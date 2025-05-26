from flask import Flask, request, jsonify
from flask_cors import CORS
from db_connect import db_connect

app = Flask(__name__)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login_met_logincode():
    data = request.get_json()
    logincode = data.get("logincode")
    print(f"Ontvangen logincode: {logincode}")

    if not logincode:
        return jsonify({"error": "Geen logincode meegegeven"}), 400

    try:
        conn = db_connect()
        if not conn:
            print("Geen connectie met DB")
            return jsonify({"error": "Kan geen verbinding maken met database"}), 500

        # Cast logincode als tekst en zorg dat Python string doorgeeft
        result = conn.execute(
            "SELECT * FROM ouder WHERE CAST(logincode AS TEXT) = %s", (str(logincode),)
        ).fetchone()
        print(f"Resultaat query: {result}")
        conn.close()

        if result:
            return jsonify(dict(result))
        else:
            return jsonify({"error": "Ongeldige code"}), 401

    except Exception as e:
        print(f"Exception bij login: {e}")
        return jsonify({"error": f"Serverfout: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)