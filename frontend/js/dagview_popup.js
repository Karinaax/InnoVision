
function openModal(contentHtml) {
document.getElementById("modalText").innerHTML = contentHtml;
document.getElementById("myModal").style.display = "block";
}

function closeModal() {
document.getElementById("myModal").style.display = "none";
}

// Sluit modal bij klik buiten de inhoud
window.onclick = function(event) {
const modal = document.getElementById("myModal");
if (event.target == modal) {
    modal.style.display = "none";
}
};

// Voorbeeld: voeg click-event toe aan alle events
document.addEventListener("DOMContentLoaded", function () {
const events = document.querySelectorAll(".event");
events.forEach(function (el) {
    el.addEventListener("click", function () {
    const eventText = el.innerText.trim();
    
    // ✅ HIER bepaal je wat er in de popup komt te staan
    const content = `
        <h2>${eventText}</h2>
        <p><strong>Beschrijving:</strong> ${eventText}</p>
        <p>Dit is extra informatie over het geselecteerde event.</p>
    `;
    
    openModal(content);
    });
});
});
