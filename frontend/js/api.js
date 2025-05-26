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