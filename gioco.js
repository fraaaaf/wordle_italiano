// 1. Carico il file dove scrivo le parole segrete
let parole_segrete = [];    //creo un array per ora vuoto che si chiama "parole_segrete"

fetch("parole_segrete.txt")
  .then(response => response.text())
  .then(text => {
    parole_segrete = text     //prendo una riga di testo dal file parole_segrete.txt, divido ogni riga e controllo che sia tutto in maiuscolo e che sia di 5 lettere
      .split("\n")
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length === 5);

    // Funzione che carica ogni giorno una parola segreta diversa
    loadDailyWord();
  });

// Variabile che conterrà la parola segreta
let secretWord = "";

// Funzione per calcolare l’indice del giorno, in modo che il iorno 1 che avvii il gioco prenda come indice la prima parola e poi ogni gionro il puntatore scorre 
// le parole nel file, sfruttando il cambio della
function getDayIndex() {
  const start = new Date(2026, 1, 6); // 6 febbraio 2026 = prima parola
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Funzione che sceglie la parola del giorno
function loadDailyWord() {
  const index = getDayIndex() % parole_segrete.length;
  secretWord = parole_segrete[index];
  console.log("Parola del giorno:", secretWord); // utile per debug
}





//Collego il file "dizionario.txt" alla logica di JS per vedere se la parola inserita dall'utente rientra nelle parole realmente esistenti nella lingua italiana
let dictionary = [];

fetch("dizionario.txt")
  .then(response => response.text())
  .then(text => {
    dictionary = text
      .split("\n")                 // divide per righe
      .map(w => w.trim().toUpperCase())  // pulisce e mette in maiuscolo
      .filter(w => w.length === 5);      // solo parole di 5 lettere
  });


// 1. Parola segreta
//const secretWord = "PIZZA";

// 2. Stato del gioco
let currentRow = 0;
let currentCol = 0;

// 3. Prendi tutte le celle della griglia
const rows = document.querySelectorAll(".row");

// 4. Gestione click sulla tastiera virtuale
const keys = document.querySelectorAll(".key");

keys.forEach(key => {
  key.addEventListener("click", () => {
    const letter = key.textContent;

    if (letter === "CANC") {
      deleteLetter();
    } else if (letter === "INVIO") {
      checkWord();
    } else {
      addLetter(letter);
    }
  });
});

// 5. Funzione: aggiungi lettera
function addLetter(letter) {
  if (currentCol < 5) {
    const cell = rows[currentRow].children[currentCol];
    cell.textContent = letter;
    currentCol++;
  }
}

// 6. Funzione: cancella lettera
function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const cell = rows[currentRow].children[currentCol];
    cell.textContent = "";
  }
}

// 7. Fuzione mostra a video la schermata di vittoria
function showWinScreen() {
  const winScreen = document.getElementById("win-screen");
  winScreen.classList.remove("hidden");
}


// 8. Funzione mostra a video la schermata di sconfitta
function showLoseScreen() {
  const loseScreen = document.getElementById("lose-screen");
  const solutionWord = document.getElementById("solution-word");

  solutionWord.textContent = secretWord.toUpperCase();
  loseScreen.classList.remove("hidden");
}



// 9. Funzione: controlla la parola
function checkWord() {
  if (currentCol < 5) {
    alert("La parola non è completa");
    return;
  }

  let guess = "";
  for (let i = 0; i < 5; i++) {
    guess += rows[currentRow].children[i].textContent;
  }

  //Controllo che la parola sia presente nel dizionario
  if (!dictionary.includes(guess)) {
  alert("Questa parola non esiste nel dizionario!");
  return; // blocca il controllo e non passa alla riga successiva
  }

  // Qui poi aggiungeremo i colori
  console.log("Hai scritto:", guess);   // mi serve per capire se il gioco sta leggendo effettivamente la parola scritta

  for (let i = 0; i < 5; i++) {
  const cell = rows[currentRow].children[i];
  const letter = guess[i];


// Controlli per le lettere che si ripetono più volte. Il gioco funziona nel seguente modo:
// - se la parola da indovinare è "P I Z Z A" e l'utente inserisce "F A R A I", il gioco colora di giallo solo la prima "A" 
//   e di grigio tutte le ripetizioi successive della lettera
// - se la parola da indovinare è "P I Z Z A" e l'utente inserisce "C A L M A", il gioro colora di verde solo la lettera messa in posizione giusta 
//   e di grigio le altre

  let secret = secretWord.split(""); // es: ["P","I","Z","Z","A"]
  let colors = ["gray", "gray", "gray", "gray", "gray"];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      colors[i] = "green";
      secret[i] = null; // rimuove la lettera, così non viene riusata
    }
  }

  for (let i = 0; i < 5; i++) {
  if (colors[i] === "gray") {
    let index = secret.indexOf(guess[i]);
    if (index !== -1) {
      colors[i] = "yellow";
      secret[index] = null; // rimuove la lettera usata
    }
  }
}

  if (colors[i] === "green") {
    // lettera giusta in posizione giusta
    cell.classList.add("correct");
  } else if (colors[i] === "yellow") {
    // lettera giusta ma in posizione sbagliata
    cell.classList.add("present");
  } else {
    // lettera sbagliata
    cell.classList.add("absent");
  }

   
}

// se la parola viene indovinata compare una schermata di vittoria
  if (guess === secretWord) {
  showWinScreen();
  return;

}

  currentRow++;
  currentCol = 0;

  if (currentRow === 6 && !(guess === secretWord)) {
  showLoseScreen();
}

}



document.getElementById("btn-menu").addEventListener("click", () => {
  window.location.href = "menu.html"; // o la pagina che vuoi
});

document.getElementById("btn-replay").addEventListener("click", () => {
  alert("Modalità allenamento non ancora implementata!");
  // qui poi caricheremo una parola randomica
});




//Vorrei fare in modo che una volta che indovini la parola ti viene fuori una scritta con scritto "indovinato" e poi che ci sia un menù in alto che ti permette
//ci scegliere un altro gioco oppure di rigiocare di nuovo a questo gioco ma con altre parole che saranno scelte in modo random nell'elenco di parole segrete, 
//escludendo quele già presenti. in particolare se poi le parole dell'elenco finiscono perchè uno ha giocato tante volte, di mandare un messaggio a video con scritto
//"parole finite per oggi"

//poi vorrei aggiungere la possibilità di chiedere un aiuto per aggiungere una lettera segnata di giallo nella tastiera. Aiuto disponibile una volta sola per parola 
//da indovinare, da capire se inserire l'aiuto solo dal 4/5 tentativo o da subito

//provare a implementare anche connections che potrebbe essere molto carino

//provare anche eventualemente ad inserire una breve spiegazione di ripasso delle parole indovinate o magari anche un'immagine


//devi implementare anche la comparsa di una schermata quando l'utente esaurisce i suoi tentativi e non ha indovinato la parola