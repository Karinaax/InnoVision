// Functie om de huiswerk data op te halen
async function getHuiswerkData() {
    try {
        // Haal de ouder_id op uit sessionStorage
        const ouderId = sessionStorage.getItem('ouder_id');
        const selectedKindId = sessionStorage.getItem('active_kind_id');
        
        if (!ouderId) {
            console.error('Geen ouder_id gevonden in sessionStorage');
            return [];
        }

        // Haal de datum uit de URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const dagParam = urlParams.get('dag');
        
        if (!dagParam) {
            console.error('Geen datum parameter gevonden in URL');
            return [];
        }

        // Converteer de datum parameter naar het juiste formaat (YYYY-MM-DD)
        const dag = dagParam.substring(0, 2);
        const maand = dagParam.substring(2, 4);
        const jaar = dagParam.substring(4, 8);
        const datum = `${jaar}-${maand}-${dag}`;

        const response = await fetch(`http://127.0.0.1:5000/api/huiswerk?ouder_id=${ouderId}&datum=${datum}`);
        const data = await response.json();
        
        // Filter op basis van geselecteerd kind als er een is geselecteerd
        const filteredData = selectedKindId 
            ? data.filter(huiswerk => huiswerk.kindid === parseInt(selectedKindId))
            : data;
        
        // Haal de kleurtoewijzing op uit sessionStorage
        const kindColors = JSON.parse(sessionStorage.getItem('kind_colors') || '[]');
        const kindIdToColor = new Map(kindColors);
        
        // Voeg kleuren toe aan de huiswerk items
        filteredData.forEach(huiswerk => {
            if (!kindIdToColor.has(huiswerk.kindid)) {
                kindIdToColor.set(huiswerk.kindid, colors[kindIdToColor.size % colors.length]);
            }
            huiswerk.kleur = kindIdToColor.get(huiswerk.kindid);
        });
        
        console.log('Opgehaalde huiswerk data:', filteredData); // Debug log
        return filteredData;
    } catch (error) {
        console.error('Fout bij ophalen huiswerk:', error);
        return [];
    }
}

// Functie om een event container te maken
function createEventContainer(huiswerk) {
    console.log('Maken van container voor huiswerk:', huiswerk); // Debug log
    const container = document.createElement('div');
    container.className = `event-container ${huiswerk.type === 'toets' ? 'toets' : ''}`;
    container.innerHTML = `
        <div class="event">
            ${huiswerk.vakicoon}
            <div class="event-content">
                <div class="event-header">
                    <h3>${huiswerk.vaknaam} - ${huiswerk.extrauitleg}</h3>
                    ${huiswerk.type === 'toets' ? '<div class="dag-view-toets-mark"><span class="exclamation-mark">!</span> Toets</div>' : ''}
                </div>
                <div class="extra-uitleg">
                    <img class="extra-uitleg-icon" src="./components/icons/info.svg" alt="info">
                    <p>Uitlegvideo over huiswerk</p>
                </div>
                <div class="kind-huiswerk">
                    <p class="kind-naam">${huiswerk.kindnaam}</p>
                    <div class="huiswerk-color-bar" style="background-color: ${huiswerk.kleur}"></div>
                </div>
            </div>
        </div>
        <div class="lower-event-container">
            <div class="huiswerk-beschrijving">
                <h4>${huiswerk.type === 'toets' ? 'Toets stof:' : 'Het Huiswerk:'}</h4>
                <p class="huiswerk-beschrijving-text">${huiswerk.beschrijving}</p>
            </div>
            ${huiswerk.type !== 'toets' ? `
            <div class="huiswerk-status">
                <h4>Huiswerk gemaakt</h4>
                <button class="check-button" data-huiswerk-id="${huiswerk.id}" ${huiswerk.datumafgevinkt ? 'data-checked="true"' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="50" viewBox="0 0 49 50" fill="none">
                    <rect x="2" y="2.76465" width="45" height="45" rx="10" fill="${huiswerk.datumafgevinkt ? '#4CAF50' : 'white'}" stroke="black" stroke-width="4"/>
                    <path d="M20.2282 34.5372L10.8179 26.1245C10.2526 25.619 10.2526 24.7995 10.8179 24.2941L12.8653 22.4637C13.4306 21.9582 14.3473 21.9582 14.9127 22.4637L21.2519 28.1309L34.8297 15.9923C35.3951 15.4869 36.3118 15.4869 36.8771 15.9923L38.9245 17.8227C39.4898 18.3281 39.4898 19.1476 38.9245 19.6531L22.2756 34.5373C21.7102 35.0427 20.7935 35.0427 20.2282 34.5372Z" fill="${huiswerk.datumafgevinkt ? 'white' : 'black'}"/>
                    </svg>
                </button>
            </div>
            ` : ''}
        </div>
    `;

    // Event listener voor de popup
    const extraUitleg = container.querySelector('.extra-uitleg');
    extraUitleg.addEventListener('click', () => {
        console.log('Video URL:', huiswerk.uitlegvideo); // Debug log
        const content = `
            <h2>${huiswerk.vaknaam}</h2>
            <p><strong>Video uitleg:</strong></p>
            <iframe width="100%" height="100%" src="${huiswerk.uitlegvideo}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; allowfullscreen"></iframe>
        `;
        openModal(content);
    });

    // Event listener voor de check-button alleen als het geen toets is
    if (huiswerk.type !== 'toets') {
        const checkButton = container.querySelector('.check-button');
        checkButton.addEventListener('click', async function() {
            const huiswerkId = this.dataset.huiswerkId;
            const isChecked = this.dataset.checked === 'true';
            const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            
            try {
                const response = await fetch('http://127.0.0.1:5000/api/huiswerk/afvinken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        huiswerk_id: huiswerkId,
                        datum_afgevinkt: isChecked ? null : currentDate
                    })
                });
                
                if (response.ok) {
                    const svg = this.querySelector('svg');
                    const rect = svg.querySelector('rect');
                    const path = svg.querySelector('path');
                    
                    if (isChecked) {
                        rect.setAttribute('fill', 'white');
                        path.setAttribute('fill', 'black');
                        this.dataset.checked = 'false';
                    } else {
                        rect.setAttribute('fill', '#4CAF50');
                        path.setAttribute('fill', 'white');
                        this.dataset.checked = 'true';
                    }
                } else {
                    console.error('Fout bij het bijwerken van de status');
                }
            } catch (error) {
                console.error('Fout bij het bijwerken van de status:', error);
            }
        });
    }

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

// Functie om de datum in de header weer te geven
function updateDagHeader() {
    const urlParams = new URLSearchParams(window.location.search);
    const dagParam = urlParams.get('dag');
    
    if (!dagParam) {
        console.error('Geen datum parameter gevonden in URL');
        return;
    }

    // Converteer de datum parameter naar een Date object
    const dag = dagParam.substring(0, 2);
    const maand = dagParam.substring(2, 4);
    const jaar = dagParam.substring(4, 8);
    const datum = new Date(`${jaar}-${maand}-${dag}`);

    // Formatteer de datum
    const dagNamen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    const maandNamen = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    
    const dagNaam = dagNamen[datum.getDay()];
    const maandNaam = maandNamen[datum.getMonth()];
    
    // Update de header
    const rightSection = document.querySelector('.right-section');
    rightSection.innerHTML = `
        <div class="dag-info">
            <span class="dag-naam">${dagNaam}</span>
            <span class="datum">${dag} ${maandNaam} ${jaar}</span>
        </div>
    `;
}

// Laad de huiswerk data wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    updateDagHeader();
    loadHuiswerk();
});
