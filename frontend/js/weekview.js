document.addEventListener("DOMContentLoaded", function () {
    const daysContainer = document.getElementById("daysContainer");
    const monthTitle = document.getElementById("monthTitle");
    const monthTest = document.getElementById("MonthTest");
    const prevWeekButton = document.getElementById("prevWeek");
    const nextWeekButton = document.getElementById("nextWeek");

    // Startdatum (huidige datum)
    const today = new Date();
    let currentDate = new Date(today);

    // Bereken de grenzen: begin en einde van toegestane periode
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    // Functie om de weekweergave te updaten
    function updateWeekView() {
        daysContainer.innerHTML = ""; // Maak de container leeg

        // Bereken de start van de week (maandag)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

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
                dateSpan.classList.add("today"); // Markeer de huidige dag
            }
            dateSpan.textContent = dayDate.getDate().toString().padStart(2, "0");

            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dateSpan);
            dayElement.appendChild(dayHeader);

            daysContainer.appendChild(dayElement);
        }

        // Update de knoppenstatus
        updateButtonStates();
    }

    // Helperfunctie om te controleren of twee datums gelijk zijn
    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    // Functie om de status van de knoppen te updaten
    function updateButtonStates() {
        if (currentDate <= minDate) {
            prevWeekButton.disabled = true;
            prevWeekButton.classList.add("disabled");
        } else {
            prevWeekButton.disabled = false;
            prevWeekButton.classList.remove("disabled");
        }

        if (currentDate >= maxDate) {
            nextWeekButton.disabled = true;
            nextWeekButton.classList.add("disabled");
        } else {
            nextWeekButton.disabled = false;
            nextWeekButton.classList.remove("disabled");
        }
    }

    // Eventlisteners voor de navigatieknoppen
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

    // Initialiseer de weergave
    updateWeekView();
});
