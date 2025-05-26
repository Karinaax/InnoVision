import { haalHuiswerkOp } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {
    const ouderId = sessionStorage.getItem('ouder_id');

    if (!ouderId) {
        alert("Ouder ID niet gevonden. Log opnieuw in.");
        window.location.href = "login.html";
        return;
    }

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

    async function updateWeekView() {
        daysContainer.innerHTML = ""; // Maak de container leeg

        // Bereken de start van de week (maandag)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        // Haal huiswerkdata op
        const huiswerkData = await haalHuiswerkOp(ouderId);

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

            // Voeg huiswerkdata toe aan de dag
            const huiswerkVoorDeDag = huiswerkData.filter(huiswerk =>
                isSameDate(new Date(huiswerk.deadline), dayDate) || // Controleer deadline
                isSameDate(new Date(huiswerk.datumgekregen), dayDate) // Controleer datumgekregen
            );

            const huiswerkList = document.createElement("ul");
            for (const huiswerk of huiswerkVoorDeDag) {
                const listItem = document.createElement("li");

                // Verwerk vakicoon als SVG
                if (huiswerk.vakicoon) {
                    svgToImage(huiswerk.vakicoon, (imageData) => {
                        const iconImg = document.createElement("img");
                        iconImg.src = imageData;
                        iconImg.alt = huiswerk.vaknaam;
                        iconImg.className = "vak-icoon";
                        listItem.appendChild(iconImg);
                    });
                }

                listItem.textContent = `${huiswerk.type} ${huiswerk.vaknaam}(${huiswerk.kindnaam})`;
                huiswerkList.appendChild(listItem);
            }

             

            dayElement.appendChild(huiswerkList);
            daysContainer.appendChild(dayElement);
        }

        // Update de knoppenstatus
        updateButtonStates();
    }

    function svgToImage(svgText, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;   
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            callback(imageData);
        };
        img.onerror = () => {
            console.error('Fout bij het laden van de SVG als afbeelding');
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

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
