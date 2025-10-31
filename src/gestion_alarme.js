/**
 * Script permettant de définir les alarmes et créer les alertes
 * Auteur : Alan Join
 */

/* Configuration des éléments par défauts sur le site*/
document.getElementById("dateAlarme").valueAsDate = new Date(); // On met par défaut la date d'aujourd'hui dans le selecteur d'alarme

// Paramètres de l'alarme
let btn = document.getElementById("defAlarme");
let musique_alarme = document.getElementById("musique_alarme");

// Icone de l'onglet
let icone_alarme = document.querySelector("link[rel~='icon']");

// Date renseignée pour définir l'alarme
let dateInput = document.getElementById("dateAlarme");
let tInput = document.getElementById("heureAlarme");
let labelInput = document.getElementById("labelAlarme");

// Variables pour afficher les alarmes déjà présentes
let histoAlarme = document.getElementById("listeAlarmes");
let dicTempsAlarme = {};

let interVal; // Interval entre l'alarme et l'heure actuelle


/**
 * Fonction qui trie les alarmes sur la page HTML
 */
function triAlarme(){
    let divAlarme = histoAlarme.children;
    [].slice
    .call(divAlarme)
    .sort(function(a, b) {
        return a.id.localeCompare(b.id);
    })
    .forEach(function(val, index) {
        histoAlarme.appendChild(val);
    });
}

/**
 * Fonction permettant de supprimer une alarme
 */
function suppAlarme(dateSelectionnee){
    let alarmeDiv = document.getElementById(dateSelectionnee.toISOString());
    if (alarmeDiv !== null) {
        alarmeDiv.remove();
    }
    if (dateSelectionnee.toString() in dicTempsAlarme) {
        clearTimeout(dicTempsAlarme[dateSelectionnee.toString()]);
        delete dicTempsAlarme[dateSelectionnee.toString()];
    }
}


/**
 * Fonction permettant d'ajouter une alarme ainsi que de la déclencher si elle est atteinte
 */
function gestionAlarme({est_input=true, date, heure, id_checkbox, label}={}) {
	let now = new Date();

    // Définition de la date d'Alarme si c'est issu d'un input
    let dateSelectionnee;
    let texteReveil;

    if (est_input) {
        dateSelectionnee = new Date(dateInput.value + "T" + tInput.value +"Z");  
        // Vérifie si l'alarme à ajouter n'est pas antérieure ou déjà établie
        if (dateSelectionnee.valueOf() <= now.valueOf()) {
            alert(`Date non valide : veuillez renseigner une date future`);
            return;
        }
        if (dateSelectionnee.toString() in dicTempsAlarme) {
            alert(`Alarme déjà établie`);
            return;
        }
        texteReveil = labelInput.value;
    }

    else {
        dateSelectionnee = new Date(date + "T" + heure +"Z");
        // On vérifie si l'alarme est déjà établie et si le switch est décoché, on la supprime
        let checkboxCochee = document.getElementById(id_checkbox).checked;
        if (!checkboxCochee) {
            suppAlarme(dateSelectionnee);
            return;
        }
        texteReveil = label
        }

    let tempsAvantAlarme = dateSelectionnee - now;

    //Ajout de l'alarme sur le HTML
    let alarmeDiv = document.createElement("div");
    alarmeDiv.classList.add("alarme");
    alarmeDiv.id = dateSelectionnee.toISOString();

    let messageAlarme;
    if (now.toISOString().substring(5, 10)< dateSelectionnee.toISOString().substring(5, 10)) {
        messageAlarme = "Le " + dateSelectionnee.toISOString().substring(8, 10) + "/" + dateSelectionnee.toISOString().substring(5, 7) + " à " + dateSelectionnee.toISOString().substring(11, 16) + " UTC ";
    }
    else {
        messageAlarme = dateSelectionnee.toISOString().substring(11, 16) + " UTC ";
    }

    if (!est_input) {
        if (id_checkbox === "alarme_envoi_TAF") {
            alarmeDiv.classList.add("alarme-envoi");
        }
        if (id_checkbox === "alarme_prepa_TAF") {
            alarmeDiv.classList.add("alarme-prepa");
        }
        if (id_checkbox === "alarme_reveil_vac") {
            alarmeDiv.classList.add("alarme-reveil");
        }
        if (id_checkbox === "alarme_annul_TAF") {
            alarmeDiv.classList.add("alarme-annul");
        }
    }

    alarmeDiv.innerHTML = `
        <span>
        <b>${texteReveil}</b> ${messageAlarme}
        </span>
        <button class="supp-alarme">
        Supprimer
        </button>
    `;
    alarmeDiv
        .querySelector(".supp-alarme")
        .addEventListener("click", function(){suppAlarme(dateSelectionnee);});

    // Met en place le compte à rebours et la popUp à afficher
    interVal = setTimeout(() => {
        icone_alarme.href = "img/sirene_alerte.png";
        musique_alarme.play();
        alert(messageAlarme + " → " + texteReveil);
        musique_alarme.pause();
        musique_alarme.currentTime = 0;
        icone_alarme.href = "img/sirene_ok.png";
        suppAlarme(dateSelectionnee);
    }, tempsAvantAlarme);

    histoAlarme.appendChild(alarmeDiv);
    dicTempsAlarme[dateSelectionnee.toString()] = interVal;
    triAlarme();
}


/**
 * Fonction initialisant les alarmes pour l'envoi des TAFs (soit 20 minutes avant le début des TAFs)
 */
function setAlarmeEnvoiTAF() {
    let now = (new Date()).toISOString().split('T'); // Array [jour, heure]

    let listeAlarme;
    if (now[1] <= "14:40") {
        listeAlarme = ["05:40", "08:40", "11:40", "14:40"];
    }
    else {
        listeAlarme = ["17:40", "23:40"];
    }

    for (const heureAlarme of listeAlarme) {
        if (heureAlarme > now[1]) {
            gestionAlarme({est_input:false, date:now[0], heure:heureAlarme, id_checkbox:"alarme_envoi_TAF", label:"Envoi des TAFs"});
        }
    }
}
/**
 * Fonction initialisant les alarmes pour la préparation des TAFs (soit 20 minutes avant le début des TAFs)
 */
function setAlarmePrepaTAF() {
    let now = (new Date()).toISOString().split('T'); // Array [jour, heure]

    let listeAlarme;
    if (now[1] <= "14:40") {
        listeAlarme = ["04:50", "07:50", "10:50", "13:50"];
    }
    else {
        listeAlarme = ["16:50", "22:50"];
    }

    for (const heureAlarme of listeAlarme) {
        if (heureAlarme > now[1]) {
            gestionAlarme({est_input:false, date:now[0], heure:heureAlarme, id_checkbox:"alarme_prepa_TAF", label:"Préparation des TAFs"});
        }
    }
}
/**
 * Fonction pour renvoyer le prochain reveil (en heure locale) en heure UTC
 */
function getNextReveilUTC(lochour) {
  const timeZone = 'Europe/Paris';
  const now = new Date();

  // Obtenir les composants de la date actuelle en Europe/Paris
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const day = parts.find(p => p.type === 'day').value;
  const month = parts.find(p => p.type === 'month').value;
  const year = parts.find(p => p.type === 'year').value;

  // Obtenir l'offset actuel de Paris par rapport à UTC (en minutes)
  const tzString = now.toLocaleString("en-US", { timeZone, timeZoneName: "short" });
  const match = tzString.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  const offsetHours = parseInt(match[1], 10);
  const offsetMinutes = parseInt(match[2] || "0", 10);
  const totalOffsetMinutes = offsetHours * 60 + (offsetHours >= 0 ? offsetMinutes : -offsetMinutes);

  // Créer une date pour aujourd'hui à 5h Paris
  let dateUTC = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    lochour - (totalOffsetMinutes / 60),
    0, 0, 0
  ));

  // Si déjà passé, passer au lendemain
  if (dateUTC <= now) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const partsTomorrow = formatter.formatToParts(tomorrow);
    const dayT = partsTomorrow.find(p => p.type === 'day').value;
    const monthT = partsTomorrow.find(p => p.type === 'month').value;
    const yearT = partsTomorrow.find(p => p.type === 'year').value;

    dateUTC = new Date(Date.UTC(
      parseInt(yearT),
      parseInt(monthT) - 1,
      parseInt(dayT),
      lochour - (totalOffsetMinutes / 60),
      0, 0, 0
    ));
  }

  return dateUTC;
}

/**
 * Fonction pour définir le reveil à 5 heures du matin
 */
function setReveilMatin(){
    let heureReveil = getNextReveilUTC(5).toISOString().split('T');
    gestionAlarme({est_input:false, date:heureReveil[0], heure:heureReveil[1].substring(0, 5), id_checkbox:"alarme_reveil_vac", label:"Réveil"});
}
/**
 * Fonction pour l'annulation des TAFs pendant la vacation nocturne (soit à 19h et 20h locales)
 */
function setAnnulTAF(){
    let heureAnnul = getNextReveilUTC(19).toISOString().split('T');
    gestionAlarme({est_input:false, date:heureAnnul[0], heure:heureAnnul[1].substring(0, 5), id_checkbox:"alarme_annul_TAF", label:"Annulation des TAFs N°1"});

    heureAnnul = getNextReveilUTC(20).toISOString().split('T');
    gestionAlarme({est_input:false, date:heureAnnul[0], heure:heureAnnul[1].substring(0, 5), id_checkbox:"alarme_annul_TAF", label:"Annulation des TAFs N°2"});
}


/**
 * Changement des musiques et du style de la page
 */
function changeMode(selectObject) {
    let bodyDuHTML = document.body;
    bodyDuHTML.className = '';
    let value = selectObject.value;
    if (value === ""){
        musique_alarme = document.getElementById("musique_alarme");
    }
    else {
        bodyDuHTML.classList.add("mode-"+value);
    }
}

/*Execution des fonctions*/
btn.addEventListener("click", gestionAlarme);