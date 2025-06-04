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
       
    `;
    
    openModal(content);
    });
});
});

// function toggleEventButton(button) {
//     button.classList.toggle('active');
    
//     const mascot = document.querySelector('.mascot');
//     if (button.classList.contains('active')) {
//         // Verander de mascot naar video
//         mascot.outerHTML = `
//             <video class="mascot" autoplay loop muted>
//                 <source src="./components/mascot/pandaWave.mp4" type="video/mp4">
//             </video>
//         `;
//     } else {
//         // Verander terug naar de originele afbeelding
//         mascot.outerHTML = `
//             <img class="mascot" src="./components/mascot/kai.png">
//         `;
//     }
// }

function toggleCheckButton(button) {
    const svg = button.querySelector('svg');
    const rect = svg.querySelector('rect');
    const path = svg.querySelector('path');
    
    if (rect.getAttribute('fill') === 'white') {
        rect.setAttribute('fill', '#4CAF50'); // Groene kleur
        path.setAttribute('fill', 'white');
    } else {
        rect.setAttribute('fill', 'white');
        path.setAttribute('fill', 'black');
    }
}

// Event listeners toevoegen aan alle check-buttons
document.addEventListener('DOMContentLoaded', function() {
    const checkButtons = document.querySelectorAll('.check-button');
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleCheckButton(this);
        });
    });
});
