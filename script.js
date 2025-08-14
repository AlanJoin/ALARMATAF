// On met par défaut la date d'aujourd'hui dans le selecteur d'alarme
document.getElementById("alarmDate").valueAsDate = new Date();


let time = document.getElementById("time");
let dateInput = document.getElementById("alarmDate");
let tInput = document.getElementById("alarmTime");
let btn = document.getElementById("setAlarm");
let contan = document.getElementById("alarms");
let interVal;
let almTimesArray = [];
let musique_alarme = document.getElementById("musique_alarme");

function timeChangeFunction() {
	let curr = new Date();
	let hrs = String(curr.getUTCHours()).padStart(2, "0");
	let min = String(curr.getUTCMinutes()).padStart(2, "0");
	let sec = String(curr.getUTCSeconds()).padStart(2, "0");
	time.textContent = `Temps actuel \n ${hrs}:${min}:${sec} UTC`;
}


function alarmSetFunction() {
	let now = new Date();
	let selectedDate = new Date(dateInput.value + "T" + tInput.value+"Z");
	if (selectedDate.valueOf() <= now.valueOf()) {
		alert(`Date non valide : veuillez renseigner une date future` + now.valueOf() + selectedDate.valueOf());
		return;
	}
	if (almTimesArray.includes(selectedDate.toString())) {
		alert(`Alarme déjà établie`);
		return;
	}

    let timeUntilAlarm = selectedDate - now;
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.innerHTML = `
        <span>
        ${selectedDate.toUTCString()}
        </span>
        <button class="delete-alarm">
        Delete
        </button>
    `;
    alarmDiv
        .querySelector(".delete-alarm")
        .addEventListener("click", () => {
            alarmDiv.remove();
            clearTimeout(interVal);
            const idx = almTimesArray.indexOf(selectedDate.toString());
            if (idx !== -1) {
                almTimesArray.splice(idx, 1);
            }
        });
    interVal = setTimeout(() => {
        musique_alarme.play();
        alert("Il est l'heure d'envoyer les TAFs !");
        musique_alarme.pause();
        musique_alarme.currentTime = 0;
        alarmDiv.remove();
        const alarmIndex = almTimesArray.indexOf(selectedDate.toString());
        if (alarmIndex !== -1) {
            almTimesArray.splice(alarmIndex, 1);
        }
    }, timeUntilAlarm);
    contan.appendChild(alarmDiv);
    almTimesArray.push(selectedDate.toString());
}

function showAlarmFunction() {
	let alarms = contan.querySelectorAll(".alarm");
	alarms.forEach((alarm) => {
		let deleteButton = alarm.querySelector(".delete-alarm");

		deleteButton.addEventListener("click", () => {
			alarmDiv.remove();
			clearTimeout(interVal);
			const alarmIndex = almTimesArray.indexOf(selectedDate.toString());
			if (alarmIndex !== -1) {
				almTimesArray.splice(alarmIndex, 1);
			}
		});

	});
}

function madonnaMode() {
  var element = document.body;
  var checkMadonna = document.getElementById("checkMadonna");
  element.classList.toggle("madonna-mode");


  if (checkMadonna.checked == true) {
	musique_alarme = document.getElementById("musique_alarme_madonna");
  }
  else {
	musique_alarme = document.getElementById("musique_alarme");
  }
} 


showAlarmFunction();
setInterval(timeChangeFunction, 1000);
btn.addEventListener("click", alarmSetFunction);
timeChangeFunction();
// Penser à trier la lise des dates à chaque input