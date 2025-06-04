import { haalHuiswerkOp } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {
    
    sessionStorage.setItem('ouder_id', 15);

    const ouderId = sessionStorage.getItem('ouder_id');


    // Haal huiswerk op voor deze ouder
    const huiswerkData = await haalHuiswerkOp(ouderId);
    console.log("Ontvangen huiswerkdata:", huiswerkData);
});

document.addEventListener("DOMContentLoaded", async function () {
    const daysContainer = document.getElementById("daysContainer");
    const monthTitle = document.getElementById("monthTitle");
    const monthTest = document.getElementById("MonthTest");
    const prevWeekButton = document.getElementById("prevWeek");
    const nextWeekButton = document.getElementById("nextWeek");

    const today = new Date();
    let currentDate = new Date(today);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    // Ingelogde ouder ID (voor demo hardcoded; vervang door echte inlog-logica)
    const ouderId = 1; // Haal dit uit de login-flow

async function updateWeekView() {
    daysContainer.innerHTML = ""; // Maak de container leeg

    // Bereken de start van de week (maandag)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    // Haal huiswerkdata op (zorg dat de ouder_id is meegegeven!)
    const ouderId = sessionStorage.getItem('ouder_id'); // Of haal het uit de URL-parameters
    const huiswerkData = await haalHuiswerkOp(ouderId);

    const kindIdToColor = new Map();

    // Update de maand en het jaar in de header
    const monthNames = [
        "Januari", "Februari", "Maart", "April", "Mei", "Juni",
        "Juli", "Augustus", "September", "Oktober", "November", "December"
    ];
    monthTitle.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()} ${startOfWeek.getFullYear()}`;
    monthTest.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()}`;

    // Voeg de dagen toe
    for (let i = 0; i < 5; i++) {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i);

        const dayElement = document.createElement("div");
        dayElement.className = "day";

        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";

        const dayName = document.createElement("span");
        const dayNames = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
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
                colorBar.style.backgroundColor = kindIdToColor.get(huiswerk.kindid);

                listItem.appendChild(huiswerkText);
                huiswerkText.appendChild(colorBar);
                listItem.appendChild(huiswerkIconContainer);


                huiswerkList.appendChild(listItem);
            dayElement.appendChild(huiswerkList);

            });

            dayElement.appendChild(huiswerkList);
            daysContainer.appendChild(dayElement);
        }
            updateButtonStates();

    }

    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    function updateButtonStates() {
        prevWeekButton.disabled = currentDate <= minDate;
        nextWeekButton.disabled = currentDate >= maxDate;
    }

    prevWeekButton.addEventListener("click", function () {
        if (currentDate > minDate) {
            currentDate.setDate(currentDate.getDate() - 7);
            updateWeekView();
        }
    });

    nextWeekButton.addEventListener("click", function () {
        if (currentDate < maxDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            updateWeekView();
        }
    });

    await updateWeekView();
});
