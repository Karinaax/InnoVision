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
        <div class="event">
            ${huiswerk.vakicoon}
            <div class="event-content">
                <h3>${huiswerk.vaknaam}</h3>
                <div class="extra-uitleg">
                    <img class="extra-uitleg-icon" src="./components/icons/info.svg" alt="info">
                    <p>Uitlegvideo over huiswerk</p>
                </div>
            </div>
        </div>
        <div class="lower-event-container">
            <div class="huiswerk-beschrijving">
                <h4>Het Huiswerk:</h4>
                <p class="huiswerk-beschrijving-text">${huiswerk.beschrijving}</p>
            </div>
            <div class="huiswerk-status">
                <h4>Huiswerk gemaakt</h4>
                <button class="check-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="50" viewBox="0 0 49 50" fill="none">
                    <rect x="2" y="2.76465" width="45" height="45" rx="10" fill="white" stroke="black" stroke-width="4"/>
                    <path d="M20.2282 34.5372L10.8179 26.1245C10.2526 25.619 10.2526 24.7995 10.8179 24.2941L12.8653 22.4637C13.4306 21.9582 14.3473 21.9582 14.9127 22.4637L21.2519 28.1309L34.8297 15.9923C35.3951 15.4869 36.3118 15.4869 36.8771 15.9923L38.9245 17.8227C39.4898 18.3281 39.4898 19.1476 38.9245 19.6531L22.2756 34.5373C21.7102 35.0427 20.7935 35.0427 20.2282 34.5372Z" fill="black"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Event listener voor de popup
    const extraUitleg = container.querySelector('.extra-uitleg');
    extraUitleg.addEventListener('click', () => {
        const content = `
            <h2>${huiswerk.vaknaam}</h2>
            <p><strong>Video uitleg:</strong></p>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/h8j6CT4LVQo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        `;
        openModal(content);
    });

    // Event listener voor de check-button
    const checkButton = container.querySelector('.check-button');
    checkButton.addEventListener('click', function() {
        toggleCheckButton(this);
    });

    return container;
}

// Functie om alle huiswerk te laden
async function loadHuiswerk() {
    const eventsContainer = document.querySelector('.events');
    if (!eventsContainer) {
        console.error('Geen .events container gevonden in de DOM'); // Debug log
        return;
    }
    


    const huiswerkData = await getHuiswerkData();
    console.log('Aantal huiswerk items:', huiswerkData.length); // Debug log
    
    huiswerkData.forEach(huiswerk => {
        const eventContainer = createEventContainer(huiswerk);
        eventsContainer.appendChild(eventContainer);
    });
}

// Laad de huiswerk data wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', loadHuiswerk);
