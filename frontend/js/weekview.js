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
    const buttonsContainer = document.querySelector(".buttons");
    const testContainer = document.querySelector(".test-container");

    const colors = ["#de362a", "#f5a122", "#ede72d", "#5aed2d", "#2ded8d", "#2d7ded"];
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

    let allHuiswerk = [];
    let filteredKindId = null;

    const kindIdToColor = new Map();

    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    function renderFooter(kindId) {
        testContainer.innerHTML = "";

        const toetsen = allHuiswerk.filter(huiswerk =>
            huiswerk.kindid === kindId && huiswerk.type === "toets"
        );


        const header = document.createElement("p");
        header.textContent = `Toetsen in ${today.toLocaleString('nl-NL', { month: 'long' })}`;
        header.className = "toetsen-header";
        testContainer.appendChild(header);

        toetsen.forEach(toets => {
            const toetsContainer = document.createElement("div");
            toetsContainer.className = "tets-container";

            const dateElement = document.createElement("span");
            dateElement.className = "toets-datum";
            const toetsDate = new Date(toets.deadline);
            dateElement.textContent = toetsDate.getDate().toString().padStart(2, "0");
            toetsContainer.appendChild(dateElement);

            const vakIcon = document.createElement("div");
            vakIcon.className = "vak-icoon";
            vakIcon.innerHTML = toets.vakicoon || "<span>(Geen icoon)</span>";
            toetsContainer.appendChild(vakIcon);

            const infoIcon = document.createElement("img");
            infoIcon.src = "./components/icons/info.svg";
            infoIcon.alt = "Meer informatie";
            infoIcon.className = "info-icoon";
            toetsContainer.appendChild(infoIcon);
            header.className = "toetsen-header";

            testContainer.appendChild(toetsContainer);
        });
    }

    function renderButtons(kinderen) {
        buttonsContainer.innerHTML = "";

        kinderen.forEach((kind) => {
            const button = document.createElement("button");
            button.className = "child-button";

            const img = document.createElement("img");
            img.src = avatarUrl[kindIdToColor.size % avatarUrl.length];
            img.alt = `Profielfoto van ${kind.kindnaam}`;
            img.className = "child-avatar";
            img.style.borderColor = kindIdToColor.get(kind.kindid);

            const span = document.createElement("span");
            span.textContent = kind.kindnaam;

            button.appendChild(img);
            button.appendChild(span);

            button.addEventListener("click", () => {
                filteredKindId = kind.kindid;
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
        allCircle.style.backgroundColor = '#a832a8';
        allCircle.style.borderColor = generalColor;

        const allSpan = document.createElement("span");
        allSpan.textContent = "Toon alles";

        allButton.appendChild(allCircle);
        allButton.appendChild(allSpan);

        allButton.addEventListener("click", () => {
            filteredKindId = null;
            updateWeekView();
            renderFooter(null);
        });

        buttonsContainer.appendChild(allButton);
    }

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

        for (let i = 0; i < 5; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i);

            const dayElement = document.createElement("div");
            dayElement.className = "day";

            const dayHeader = document.createElement("div");
            dayHeader.className = "day-header";

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
            });

            dayElement.appendChild(huiswerkList);
            daysContainer.appendChild(dayElement);
        }
    }

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

        renderButtons(kinderen);
        updateWeekView();
        renderFooter(null); // Standaard weergave zonder toetsen
    }

    prevWeekButton.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekView();
    });

    nextWeekButton.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekView();
    });

    await init();
});
