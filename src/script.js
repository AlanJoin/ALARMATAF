/**
 * Script permettant de définir des fonctionnalités annexes (son de test, maintient de l'écran en veille....)
 * Auteur : Alan Join
 */

/**Ajout de l'évenement "entrée" à tous les inputs */
function toucheEntreeAppuyee(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btn.click();
    }
}
dateInput.addEventListener("keypress", toucheEntreeAppuyee);
tInput.addEventListener("keypress", toucheEntreeAppuyee);
labelInput.addEventListener("keypress", toucheEntreeAppuyee);

/**
 * Fonction permettant de faire jouer le son de test
 */
function playTestMusic() {
    let son_test = document.getElementById("musique_test");
    son_test.currentTime=0;
    son_test.play();
}

/* Introdcution d'un bout de script permettant de maintenir l'écran en éveil */
screenLock = navigator.wakeLock.request('screen');
document.addEventListener('visibilitychange', async () => {
  if (screenLock !== null && document.visibilityState === 'visible') {
    screenLock = await navigator.wakeLock.request('screen');
  }
});
