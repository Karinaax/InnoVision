import { loginMetCode } from './api.js';

let code = "";

function updateDisplay() {
    const display = document.getElementById('code-display');
    display.textContent = code.padEnd(6, '_').split('').join(' ');
}

function resetCode() {
    code = "";
    updateDisplay();
}

function handleKeypadInput(value) {
    if (value === '✓') {
        submitCode();
    } else if (value === '✕') {
        resetCode();
    } else if (/^\d$/.test(value) && code.length < 6) {
        code += value;
        updateDisplay();
    }
}

async function submitCode() {
    if (code.length !== 6) {
        alert("Voer een 6-cijferige code in.");
        return;
    }

    const result = await loginMetCode(code);

    console.log('Resultaat van login:', result);  // Debug log

    if (result) {
        console.log("Login geslaagd:", result);
        window.location.href = "weekView.html";
    } else {
        alert("Ongeldige code. Probeer opnieuw.");
        resetCode();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();

    document.querySelectorAll('#keypad button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent.trim();
            handleKeypadInput(value);
        });
    });

    document.getElementById('confirm-btn').addEventListener('click', submitCode);
});
