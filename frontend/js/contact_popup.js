import {haalDocentOp } from './api.js';

function openModal(contentHtml) {
  document.getElementById("modalText").innerHTML = contentHtml;
  document.getElementById("myModal").style.display = "block";
  document.body.classList.add("contact-modal-active"); // Alleen contact-modal-active class
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  document.body.classList.remove("contact-modal-active"); // Alleen contact-modal-active class verwijderen
}

// Maak de functie beschikbaar op de globale scope
window.closeModal = closeModal;

// Sluit modal bij klik buiten de inhoud
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove("contact-modal-active"); // Verwijder de class wanneer modal wordt gesloten
    }
};

// Voorbeeld: voeg click-event toe aan alle events
document.addEventListener("DOMContentLoaded", function () {
    const events = document.querySelectorAll(".event");

    events.forEach(function (el) {
        el.addEventListener("click", async function () {
            // Lees bij elk klik de huidige kind_id uit sessionStorage
            const kind_id = sessionStorage.getItem('active_kind_id') // fallback

            // Haal docentgegevens op voor het actuele kind
            const docentGegevens = await haalDocentOp(kind_id);

            if (docentGegevens && docentGegevens.length > 0) {
                const docent = docentGegevens[0];
                const eventText = el.innerText.trim();
                const docentTitel = docent.geslacht === 'V' ? 'juf' : 'meester';

                const content = `
                    <h2>${eventText}</h2>
                    <p><strong> Naam ${docentTitel}: </strong>${docent.voornaam} ${docent.achternaam}</p>
                    <p><strong>Telefoonnummer: </strong>06 12 34 56 78</p>
                `;

                openModal(content);
            } else {
                openModal(`<h2>Contact</h2>
                    <p>Klik op één van uw kinderen om de informatie van de docent van dat kind te zien.</p>
                    <br>
                    <p><strong>Algemeen telefoonnummer: </strong>010 1234567 </p>`);
            }
        });
    });
});


