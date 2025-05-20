import { fetchHomework } from './api.js';

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

    let homeworkData = [];

    async function updateWeekView() {
        daysContainer.innerHTML = ""; // Reset container

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        const monthNames = [
            "Januari", "Februari", "Maart", "April", "Mei", "Juni",
            "Juli", "Augustus", "September", "Oktober", "November", "December"
        ];
        monthTitle.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()} ${startOfWeek.getFullYear()}`;
        monthTest.textContent = `${monthNames[startOfWeek.getMonth()].toLowerCase()}`;

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

            // Voeg huiswerk toe
            const homeworkList = document.createElement("div");
            homeworkList.className = "homework-list";

            const dailyHomework = homeworkData.filter(hw => isSameDate(new Date(hw.datum), dayDate));
            dailyHomework.forEach(hw => {
                const homeworkItem = document.createElement("div");
                homeworkItem.className = "homework-item";
                homeworkItem.style.borderLeft = `5px solid ${hw.color || "#000"}`;

                const homeworkTitle = document.createElement("span");
                homeworkTitle.textContent = hw.opdracht;

                const homeworkChild = document.createElement("span");
                homeworkChild.className = "homework-child";
                homeworkChild.textContent = hw.kind;

                homeworkItem.appendChild(homeworkTitle);
                homeworkItem.appendChild(homeworkChild);
                homeworkList.appendChild(homeworkItem);
            });

            dayElement.appendChild(homeworkList);
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

    prevWeekButton.addEventListener("click", async function () {
        if (currentDate > minDate) {
            currentDate.setDate(currentDate.getDate() - 7);
            await updateWeekView();
        }
    });

    nextWeekButton.addEventListener("click", async function () {
        if (currentDate < maxDate) {
            currentDate.setDate(currentDate.getDate() + 7);
            await updateWeekView();
        }
    });

    async function fetchHomeworkData() {
        const ouderid = 1; // Dummy ouderid; update dit voor een echte gebruiker
        homeworkData = await fetchHomework(ouderid) || [];
        await updateWeekView();
    }

    await fetchHomeworkData();
});
