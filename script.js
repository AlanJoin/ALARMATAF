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
function gestionAlarme({est_input=true, date, heure}={}) {
	let now = new Date();

    // Définition de la date d'Alarme si c'est issu d'un input
    let dateSelectionnee;
    if (est_input) {
        dateSelectionnee = new Date(dateInput.value + "T" + tInput.value +"Z");  
        // Vérifie si l'alarme à ajouter n'est pas antérieure ou déjà établie
        if (dateSelectionnee.valueOf() <= now.valueOf()) {
            alert(`Date non valide : veuillez renseigner une date future`);
            return;
        }
        if (listeTempsAlarme.includes(dateSelectionnee.toString())) {
            alert(`Alarme déjà établie`);
            return;
        }
    }
    else {
        dateSelectionnee = new Date(date + "T" + heure +"Z");
    }

    let tempsAvantAlarme = dateSelectionnee - now;

    //Ajout de l'alarme sur le HTML
    let alarmeDiv = document.createElement("div");
    alarmeDiv.classList.add("alarm");

    let messageAlarme;
    if (now.toDateString() < dateSelectionnee.toDateString()) {
        messageAlarme = "Le " + dateSelectionnee.toISOString().substring(8, 10) + "/" + dateSelectionnee.toISOString().substring(5, 7) + " à " + dateSelectionnee.toISOString().substring(11, 16) + " UTC";
    }
    else {
        messageAlarme = dateSelectionnee.toISOString().substring(11, 16) + " UTC";
    }
    alarmeDiv.innerHTML = `
        <span>
        ${messageAlarme}
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
  let bodyDuHTML = document.body;
  let checkMadonna = document.getElementById("checkMadonna");

  bodyDuHTML.classList.toggle("madonna-mode"); // Changement de style

  // Changement de musique
  if (checkMadonna.checked == true) {
	musique_alarme = document.getElementById("musique_alarme_madonna");
  }
  else {
	musique_alarme = document.getElementById("musique_alarme");
  }
} 

/**
 * Fonction initialisant les alarmes par défaut sur le site (soit 15 minutes avant le début des TAFs)
 */
function setAlarmeDefaut() {
    let now = (new Date()).toISOString().split('T'); // Array [jour, heure]

    let listeAlarme;
    if (now[1] <= "14:45") {
        listeAlarme = ["05:45", "08:45", "11:45", "14:45"];
    }
    else {
        listeAlarme = ["17:45", "23:45"];
    }

    for (const heureAlarme of listeAlarme) {
        if (heureAlarme > now[1]) {
            gestionAlarme({est_input:false, date:now[0], heure:heureAlarme});
        }
    }
}


/*Execution des fonctions*/
afficherHeure();
setInterval(afficherHeure, 1000);
setAlarmeDefaut()
btn.addEventListener("click", gestionAlarme);
// Penser à trier la liste des dates à chaque input