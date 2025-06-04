export const defaultSettings = {
  contrast: 'normal',
};

export function getSettings() {
  const saved = localStorage.getItem('userSettings');
  return saved ? JSON.parse(saved) : defaultSettings;
}

export function saveSettings(newSettings) {
  localStorage.setItem('userSettings', JSON.stringify(newSettings));
}

export function applySettings(settings) {
  document.body.classList.remove('contrast-normal', 'contrast-dark');
  document.body.classList.add(`contrast-${settings.contrast}`);
}

export async function loadSettingsPanel() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  const res = await fetch('./settings.html');
  const html = await res.text();
  container.innerHTML = html;

  const settings = getSettings();
  applySettings(settings);

  const settingsPanel = document.getElementById('settings-panel');
  const icon = document.getElementById('settings-button');
  const closeButton = document.getElementById('close-settings');
  const logoutButton = document.getElementById('logout-button');

  if (icon && settingsPanel) {
    icon.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display === 'block';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
      icon.classList.toggle('active', !isVisible);

      const themeButtons = settingsPanel.querySelectorAll('.theme-button');
      themeButtons.forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        btn.style.display = theme === settings.contrast ? 'none' : 'block';
      });
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      settingsPanel.style.display = 'none';
      if (icon) icon.classList.remove('active');
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.clear();
      localStorage.removeItem('userSettings');
      window.location.href = 'login.html';
    });
  }

  const themeButtons = container.querySelectorAll('.theme-button');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      settings.contrast = theme;
      saveSettings(settings);
      applySettings(settings);
      settingsPanel.style.display = 'none';
      if (icon) icon.classList.remove('active');
    });
  });
}

