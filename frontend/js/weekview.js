import { haalHuiswerkOp } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {
        // Haal ouder ID op en controleer op geldigheid
    const ouderId = sessionStorage.getItem('ouder_id');

    if (!ouderId) {
        alert("Ouder ID niet gevonden. Log opnieuw in.");
        window.location.href = "login.html";
        return;
    }

        // Elementen ophalen uit de DOM
    const daysContainer = document.getElementById("daysContainer");
    const monthTitle = document.getElementById("monthTitle");
    const monthTest = document.getElementById("MonthTest");
    const prevWeekButton = document.getElementById("prevWeek");
    const nextWeekButton = document.getElementById("nextWeek");
    const buttonsContainer = document.querySelector(".buttons");
    const testContainer = document.querySelector(".test-container");

        // Kleuren en avatars voor de kinder knoppen
    const colors = ["#de362a", "#f5a122", "#dede16", "#44c21d", "#2ded8d", "#2d7ded"];
    const generalColor = "#7f32a8";
    const avatarUrl = [
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Nia&scale=50&radius=50",
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Nova&scale=50&radius=50",
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Aria&scale=50&radius=50",
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jade&scale=50&radius=50",
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Aneka&scale=50&radius=50",
        "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Felix&scale=50&radius=50"
    ];

    const today = new Date();
    let currentDate = new Date(today);
        
    // Definieer minimum en maximum data voor navigatie
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    let allHuiswerk = [];

    // Hier halen we de actieve kindid op uit sessionStorage (als die er is)
    let filteredKindId = sessionStorage.getItem('active_kind_id');
    if (filteredKindId !== null) {
        filteredKindId = Number(filteredKindId);
    } else {
        filteredKindId = null;
    }

    const kindIdToColor = new Map();

        // Controleer of twee datums hetzelfde zijn
    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

// Rendert toetsen in de footer
function renderFooter(kindId) {
    testContainer.innerHTML = "";

            // Filter toetsen voor het geselecteerde kind
    const toetsen = allHuiswerk.filter(huiswerk =>
        huiswerk.kindid === kindId && huiswerk.type === "toets"
    );

    // Header toevoegen
    const header = document.createElement("p");
    header.textContent = `Toetsen in ${today.toLocaleString('nl-NL', { month: 'long' })}`;
    header.className = "toetsen-header";
    testContainer.appendChild(header);

    // Hoofdcontainer voor toetsen
    const toetsContainer = document.createElement("div");
    toetsContainer.className = "toets-container";
    testContainer.appendChild(toetsContainer);

    toetsen.forEach(toets => {
        // Container voor een enkele toets
        const toetsItem = document.createElement("div");
        toetsItem.className = "toets-item";

        // Datum
        const dateElement = document.createElement("span");
        dateElement.className = "toets-datum";
        const toetsDate = new Date(toets.deadline);
        dateElement.textContent = toetsDate.getDate().toString().padStart(2, "0");
        toetsItem.appendChild(dateElement);

        // Vak-icoon
        const vakIcon = document.createElement("div");
        vakIcon.className = "vak-icoon";
        vakIcon.innerHTML = toets.vakicoon; // Zorg dat toets.vakicoon valide HTML/SVG bevat
        toetsItem.appendChild(vakIcon);

        // Info-icoon
        const infoIcon = document.createElement("img");
        infoIcon.src = "./components/icons/info.svg";
        infoIcon.alt = "Meer informatie";
        infoIcon.className = "info-icoon";
        toetsItem.appendChild(infoIcon);

        // Voeg toets-item toe aan de toets-container
        toetsContainer.appendChild(toetsItem);
    });
}

    // Rendert knoppen voor kinderen
    function renderButtons(kinderen) {
        buttonsContainer.innerHTML = "";

        kinderen.forEach((kind, index) => {
            const button = document.createElement("button");
            button.className = "child-button";

            const img = document.createElement("img");
            img.src = avatarUrl[index % avatarUrl.length];
            img.alt = `Profielfoto van ${kind.kindnaam}`;
            img.className = "child-avatar";

            img.style.border = `4px solid ${colors[index % colors.length]}`;
            img.style.borderRadius = "50%";
            img.style.boxSizing = "border-box";

            const span = document.createElement("span");
            span.textContent = kind.kindnaam;

            button.appendChild(img);
            button.appendChild(span);

            //kindid opslaan in sessie
            button.addEventListener("click", () => {
                filteredKindId = kind.kindid;
                sessionStorage.setItem('active_kind_id', filteredKindId);
                updateWeekView();
                renderFooter(filteredKindId);
            });

            buttonsContainer.appendChild(button);
        });

        const allButton = document.createElement("button");
        allButton.className = "child-button";
        allButton.style.borderColor = generalColor;

        const allCircle = document.createElement("div");
        allCircle.className = "general-avatar";
        allCircle.style.borderColor = generalColor;

        const allSpan = document.createElement("span");
        allSpan.textContent = "Toon alles";
        allSpan.className = "Toon";

        allButton.appendChild(allCircle);
        allButton.appendChild(allSpan);

        //kindid verwijderen uit sessie als je in algemene weergave zit
        allButton.addEventListener("click", () => {
            filteredKindId = null;
            sessionStorage.removeItem('active_kind_id');
            updateWeekView();
            renderFooter(null);
        });

        buttonsContainer.appendChild(allButton);
    }

        // Update de weergave van de week
function getWeekLabel(currentDate, today) {
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay() + 1);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

    const startOfPreviousWeek = new Date(startOfThisWeek);
    startOfPreviousWeek.setDate(startOfThisWeek.getDate() - 7);

    if (
        currentDate >= startOfThisWeek &&
        currentDate < startOfNextWeek
    ) {
        return "deze week";
    } else if (
        currentDate >= startOfNextWeek &&
        currentDate < startOfNextWeek.setDate(startOfNextWeek.getDate() + 7)
    ) {
        return "volgende week";
    } else if (
        currentDate >= startOfPreviousWeek &&
        currentDate < startOfThisWeek
    ) {
        return "vorige week";
    }

    return "";
}

        // Update de weergave van de week
    async function updateWeekView() {
        daysContainer.innerHTML = "";

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        const huiswerkData = filteredKindId
            ? allHuiswerk.filter(huiswerk => huiswerk.kindid === filteredKindId)
            : allHuiswerk;

        const monthNames = [
            "Januari", "Februari", "Maart", "April", "Mei", "Juni",
            "Juli", "Augustus", "September", "Oktober", "November", "December"
        ];
        monthTitle.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()} ${startOfWeek.getFullYear()}`;
        monthTest.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()}`;

           // Stel de tekst in voor todayButton
    const todayButton = document.getElementById("todayButton");
    todayButton.textContent = getWeekLabel(currentDate, today)


        for (let i = 0; i < 5; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i);

            const dayElement = document.createElement("div");
            dayElement.className = "day";

        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";
        const dayButton = document.createElement("button");
        dayButton.innerText = "Dag overzicht";
        dayButton.className = "day-button";

        dayButton.addEventListener("click", function () {
            const dayId = dateFormatterParam(dayDate);
            window.location=`dagview.html?dag=${dayId}`
        })

            const dayNames = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
            const dayName = document.createElement("span");
            dayName.textContent = dayNames[i];

            const dateSpan = document.createElement("span");
            dateSpan.className = "date";
            if (isSameDate(dayDate, today)) {
                dateSpan.classList.add("today");
            }
            dateSpan.textContent = dayDate.getDate().toString().padStart(2, "0");

            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dateSpan);
            dayElement.appendChild(dayHeader);

            const huiswerkVoorDeDag = huiswerkData.filter(huiswerk =>
                isSameDate(new Date(huiswerk.deadline), dayDate)
            );

            const huiswerkList = document.createElement("ul");
            huiswerkList.className = "huiswerk-list";
            huiswerkVoorDeDag.forEach(huiswerk => {
                const listItem = document.createElement("li");
                listItem.className = "huiswerk-item";

                if (huiswerk.type === "toets") {
                    const exclamationMark = document.createElement("span");
                    exclamationMark.textContent = "!";
                    exclamationMark.className = "exclamation-mark";
                    listItem.appendChild(exclamationMark);
                }

                if (huiswerk.datumafgevinkt !== null) {
                    const checkMark = document.createElement("img");
                    checkMark.src = "./components/icons/check.svg";
                    checkMark.className = "check-mark";
                    listItem.appendChild(checkMark);
                }

                const huiswerkText = document.createElement("div");
                huiswerkText.textContent = huiswerk.vaknaam;

                const huiswerkIconContainer = document.createElement("div");
                huiswerkIconContainer.className = "huiswerk-icon";
                huiswerkIconContainer.innerHTML = huiswerk.vakicoon;

                const colorBar = document.createElement("span");
                colorBar.className = "huiswerk-color-bar";
                colorBar.style.backgroundColor = kindIdToColor.get(huiswerk.kindid) || generalColor;

                listItem.appendChild(huiswerkText);
                huiswerkText.appendChild(colorBar);
                listItem.appendChild(huiswerkIconContainer);


                huiswerkList.appendChild(listItem);
            dayElement.appendChild(huiswerkList);
            dayElement.appendChild(dayButton);

            });

            daysContainer.appendChild(dayElement);
        }
            updateButtonStates();

    }

    // Initialiseert de applicatie
    async function init() {
        allHuiswerk = await haalHuiswerkOp(ouderId);

        if (!allHuiswerk || allHuiswerk.length === 0) {
            daysContainer.textContent = "Geen huiswerk gevonden.";
            return;
        }

        const kinderenMap = new Map();
        allHuiswerk.forEach(h => {
            if (!kinderenMap.has(h.kindid)) {
                kinderenMap.set(h.kindid, { kindid: h.kindid, kindnaam: h.kindnaam });
            }
        });

        const kinderen = Array.from(kinderenMap.values()).sort((a, b) => a.kindid - b.kindid);

        kinderen.forEach((kind, index) => {
            kindIdToColor.set(kind.kindid, colors[index % colors.length]);
        });

        // Sla de kleurtoewijzing op in sessionStorage
        sessionStorage.setItem('kind_colors', JSON.stringify(Array.from(kindIdToColor.entries())));

        renderButtons(kinderen);
        updateWeekView();
        renderFooter(filteredKindId);
    }

    function dateFormatterParam(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}${month}${year}`;
    }

    function updateButtonStates() {
        const isPrevDisabled = currentDate <= minDate;
        const isNextDisabled = currentDate >= maxDate;

        prevWeekButton.disabled = isPrevDisabled;
        nextWeekButton.disabled = isNextDisabled;

        if (isPrevDisabled) {
            prevWeekButton.classList.add('disabled');
        } else {
            prevWeekButton.classList.remove('disabled');
        }

        if (isNextDisabled) {
            nextWeekButton.classList.add('disabled');
        } else {
            nextWeekButton.classList.remove('disabled');
        }
    }

    prevWeekButton.addEventListener("click", () => {
        if (currentDate > minDate) {
            currentDate.setDate(currentDate.getDate() - 7);
            updateWeekView();
        }
    });

    nextWeekButton.addEventListener("click", () => {
        if (currentDate < maxDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            updateWeekView();
        }
    });

    await init();
});
