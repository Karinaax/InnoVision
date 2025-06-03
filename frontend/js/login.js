import { loginMetCode } from './api.js';

let code = "";

function updateDisplay() {
  const display = document.getElementById('code-display');
  display.textContent = code.padEnd(4, '_').split('').join(' ');
}

function resetCode() {
  code = "";
  updateDisplay();
}

function handleKeypadInput(value) {
  if (value === '✓') {
    submitCode();
  } else if (value === '←') {
    code = code.slice(0, -1);
    updateDisplay();
  } else if (/^\d$/.test(value) && code.length < 4) {
    code += value;
    updateDisplay();
  }
}

async function submitCode() {
  if (code.length !== 4) {
    showErrorPopup();
    resetCode();
    return;
  }

  const result = await loginMetCode(code);
  console.log('Resultaat van login:', result);

  if (result) {
    const ouderId = result.id;
    sessionStorage.setItem('ouder_id', ouderId);
    window.location.href = "weekView.html";
  } else {
    showErrorPopup();
    resetCode();
  }
}

function showErrorPopup() {
  const popup = document.getElementById('error-popup');
  popup.style.display = 'flex';

  const closeBtn = document.getElementById('popup-ok');
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();

  document.querySelectorAll('#keypad button').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent.trim();
      handleKeypadInput(value);
    });
  });
});
