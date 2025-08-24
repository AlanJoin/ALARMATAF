/**
 * Script permettant d'afficher l'heure sur le site
 * 
 */

/* Variables du script */
let temps = document.getElementById("temps-reel"); // Horloge à afficher


/** 
 * Fonction permettant d'afficher l'heure en temps réel sur le HTML
*/
function afficherHeure() {
	let now = new Date();
	let hrs = String(now.getUTCHours()).padStart(2, "0");
	let min = String(now.getUTCMinutes()).padStart(2, "0");
	let sec = String(now.getUTCSeconds()).padStart(2, "0");
	temps.textContent = `${hrs}:${min}:${sec}`;
}

// Appel de la fonction + actualisation régulière
afficherHeure();
setInterval(afficherHeure, 1000);