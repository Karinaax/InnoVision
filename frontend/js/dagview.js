// Functie om de huiswerk data op te halen
async function getHuiswerkData() {
    try {
        // Haal de ouder_id op uit sessionStorage
        const ouderId = sessionStorage.getItem('ouder_id');
        
        if (!ouderId) {
            console.error('Geen ouder_id gevonden in sessionStorage');
            return [];
        }

        const response = await fetch(`http://127.0.0.1:5000/api/huiswerk?ouder_id=${ouderId}`);
        const data = await response.json();
        console.log('Opgehaalde huiswerk data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Fout bij ophalen huiswerk:', error);
        return [];
    }
}

// Functie om een event container te maken
function createEventContainer(huiswerk) {
    console.log('Maken van container voor huiswerk:', huiswerk); // Debug log
    const container = document.createElement('div');
    container.className = 'event-container';
    container.innerHTML = `
        <div class="event-header">
            <h3>${huiswerk.naam}</h3>
            <button class="check-button ${huiswerk.status === 'Gemaakt' ? 'checked' : ''}">
                ${huiswerk.status === 'Gemaakt' ? '✓' : '○'}
            </button>
        </div>
        <p>${huiswerk.beschrijving}</p>
        <p class="kind-naam">${huiswerk.kind_naam}</p>
    `;

    // Event listener toevoegen voor de check button
    const checkButton = container.querySelector('.check-button');
    checkButton.addEventListener('click', () => updateHuiswerkStatus(huiswerk.id));

    return container;
}

// Functie om de huiswerk status bij te werken
async function updateHuiswerkStatus(huiswerkId) {
    try {
        const response = await fetch(`/api/huiswerk/${huiswerkId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Ververs de pagina om de nieuwe status te tonen
            loadHuiswerk();
        }
    } catch (error) {
        console.error('Fout bij updaten huiswerk status:', error);
    }
}

// Functie om alle huiswerk te laden
async function loadHuiswerk() {
    const eventsContainer = document.querySelector('.events');
    if (!eventsContainer) {
        console.error('Geen .events container gevonden in de DOM'); // Debug log
        return;
    }
    
    eventsContainer.innerHTML = ''; // Leeg de container eerst
    console.log('Events container geleegd'); // Debug log

    const huiswerkData = await getHuiswerkData();
    console.log('Aantal huiswerk items:', huiswerkData.length); // Debug log
    
    huiswerkData.forEach(huiswerk => {
        const eventContainer = createEventContainer(huiswerk);
        eventsContainer.appendChild(eventContainer);
    });
}

// Laad de huiswerk data wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', loadHuiswerk);
