export async function loginMetCode(logincode) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logincode })
        });

        const data = await response.json();

        console.log('API response:', data);  // Debug log

        if (!response.ok) {
            console.error("Login fout:", data.error);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Netwerkfout:", err);
        return null;
    }
}

export async function haalHuiswerkOp(ouderId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/huiswerk?ouder_id=${ouderId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.error("Fout bij ophalen huiswerk:", data.error);
            return null;
        }

        return data; // Huiswerkdata als JSON-object
    } catch (err) {
        console.error("Netwerkfout:", err);
        return null;
    }
}

export async function haalDocentOp(kind_id) {
    try {
        const response = await fetch(`http://localhost:5000/api/docent?kind_id=${kind_id}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Fout bij het ophalen van docent:", data.error);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Netwerkfout:", err);
        return null;
    }
}



