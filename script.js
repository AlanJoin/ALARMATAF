/**
 * Script permettant d'afficher l'heure sur le site, ainsi que de définir les alarmes et créer les alertes
 * Auteur : Alan Join
 * 
 */

/* Configuration des éléments par défauts sur le site*/
document.getElementById("dateAlarme").valueAsDate = new Date(); // On met par défaut la date d'aujourd'hui dans le selecteur d'alarme

/* Variables du script */
let temps = document.getElementById("temps"); // Horloge à afficher

// Paramètres de l'alarme
let btn = document.getElementById("setAlarm");
let musique_alarme = document.getElementById("musique_alarme");

// Date renseignée pour définir l'alarme
let dateInput = document.getElementById("dateAlarme");
let tInput = document.getElementById("alarmTime");

// Variables pour afficher les alarmes déjà présentes
let histoAlarme = document.getElementById("alarms");
let listeTempsAlarme = [];

let interVal; // Interval entre l'alarme et l'heure actuelle

/** 
 * Fonction permettant d'afficher l'heure en temps réel sur le HTML
*/
function afficherHeure() {
	let now = new Date();
	let hrs = String(now.getUTCHours()).padStart(2, "0");
	let min = String(now.getUTCMinutes()).padStart(2, "0");
	let sec = String(now.getUTCSeconds()).padStart(2, "0");
	temps.textContent = `Temps actuel \n ${hrs}:${min}:${sec} UTC`;
}

/**
 * Fonction permettant d'ajouter une alarme ainsi que de la déclencher si elle est atteinte
 */
function gestionAlarme() {
	let now = new Date();
	let dateSelectionnee = new Date(dateInput.value + "T" + tInput.value+"Z");
    let tempsAvantAlarme = dateSelectionnee - now;

    // Vérifie si l'alarme à ajouter n'est pas antérieure ou déjà établie
	if (dateSelectionnee.valueOf() <= now.valueOf()) {
		alert(`Date non valide : veuillez renseigner une date future`);
		return;
	}
	if (listeTempsAlarme.includes(dateSelectionnee.toString())) {
		alert(`Alarme déjà établie`);
		return;
	}

    //Ajout de l'alarme sur le HTML
    let alarmeDiv = document.createElement("div");
    alarmeDiv.classList.add("alarm");
    alarmeDiv.innerHTML = `
        <span>
        ${dateSelectionnee.toUTCString()}
        </span>
        <button class="delete-alarm">
        Delete
        </button>
    `;
    alarmeDiv
        .querySelector(".delete-alarm")
        .addEventListener("click", () => {
            alarmeDiv.remove();
            clearTimeout(interVal);
            const idx = listeTempsAlarme.indexOf(dateSelectionnee.toString());
            if (idx !== -1) {
                listeTempsAlarme.splice(idx, 1);
            }
        });

    // Met en place le compte à rebours et la popUp à afficher
    interVal = setTimeout(() => {
        musique_alarme.play();
        alert("Il est l'heure d'envoyer les TAFs !");
        musique_alarme.pause();
        musique_alarme.currentTime = 0;
        alarmeDiv.remove();
        const alarmIndex = listeTempsAlarme.indexOf(dateSelectionnee.toString());
        if (alarmIndex !== -1) {
            listeTempsAlarme.splice(alarmIndex, 1);
        }
    }, tempsAvantAlarme);
    histoAlarme.appendChild(alarmeDiv);
    listeTempsAlarme.push(dateSelectionnee.toString());
}

/**
 * Activation du mode Madonna (pour plus de plaisir)
 */
function madonnaMode() {
  var bodyDuHTML = document.body;
  var checkMadonna = document.getElementById("checkMadonna");

  bodyDuHTML.classList.toggle("madonna-mode"); // Changement de style

  // Changement de musique
  if (checkMadonna.checked == true) {
	musique_alarme = document.getElementById("musique_alarme_madonna");
  }
  else {
	musique_alarme = document.getElementById("musique_alarme");
  }
} 

afficherHeure();
setInterval(afficherHeure, 1000);
btn.addEventListener("click", gestionAlarme);
// Penser à trier la liste des dates à chaque input