export async function loginMetCode(logincode) {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
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

export async function haalHuiswerkOp() {
    try {
        const response = await fetch('http://localhost:5000/api/huiswerk', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
            console.log(data)
        if (!response.ok) {
            console.error("Fout bij ophalen huiswerk:", data.error);
            return null;
        }

        return data;  // Huiswerkdata als JSON-object
    } catch (err) {
        console.error("Netwerkfout:", err);
        return null;
    }
}
