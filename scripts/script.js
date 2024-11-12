"use strict";

const game = {
  title: "Hitch",
  isRunning: false,
  players: [],
  activePlayerIndex: 0, //this is activePlayer index
  scoreboard1: "",
  scoreboard2: "",
  scoreboard3: "",
  scorePoint1: 0,
  scorePoint2: 0,
  scorePoint3: 0,
  startGameButt: "",
  switchPlayerButt: "",
  scorePointButt: "",
  resetButt: "",
  resume: "",
  pause: "",
  playerJoin: "",
  headerGrid1: "",
  headerGrid2: "",
  headerGrid3: "",

  addPlayer() {
    return new Promise((resolve) => {
      const inputBox = document.getElementById("userInput");
      const button = document.getElementById("myButton");

      button.addEventListener("click", () => {
        const inputValue = inputBox.value.trim();
        if (inputValue) {
          const newPlayer = new Player(inputValue); // Create a new Player instance
          this.players.push(newPlayer); // Store the instance

          if (this.players.length === 1) {
            this.headerGrid1.textContent = newPlayer.name;
            this.scoreboard1.textContent = newPlayer.getScore();
          } else if (this.players.length === 2) {
            this.headerGrid2.textContent = newPlayer.name;
            this.scoreboard2.textContent = newPlayer.getScore();
          } else if (this.players.length === 3) {
            this.headerGrid3.textContent = newPlayer.name;
            this.scoreboard3.textContent = newPlayer.getScore();
          } else {
            alert("Maximum of 3 players allowed.");
            this.players.pop(newPlayer);
          }

          this.startGameButt.disabled = false;
          document.getElementById("player").style.display = "grid";
          resolve(newPlayer);
          inputBox.value = ""; // Clear input box after adding
        } else {
          alert("Please enter a valid player name");
        }
      });
    });
  },

  init() {
    console.log("initializing game");
    this.startGameButt = document.getElementById("start");
    this.switchPlayerButt = document.getElementById("left-switch");
    this.scorePointButt = document.getElementById("left-score");
    this.resume = document.getElementById("left-resume");
    this.pause = document.getElementById("left-pause");
    this.playerJoin = document.getElementById("playerJoin");
    this.headerGrid1 = document.getElementById("grid1");
    this.headerGrid2 = document.getElementById("grid2");
    this.headerGrid3 = document.getElementById("grid3");
    this.scoreboard1 = document.getElementById("scoreboard1");
    this.scoreboard2 = document.getElementById("scoreboard2");
    this.scoreboard3 = document.getElementById("scoreboard3");
    this.resetButt = document.getElementById("resetButt");

    this.startGameButt.disabled = true;
    this.switchPlayerButt.disabled = true;
    this.scorePointButt.disabled = true;

    this.headerGrid1.classList.add("disabled");
    this.headerGrid2.classList.add("disabled");
    this.headerGrid3.classList.add("disabled");
    this.scoreboard1.classList.add("disabled");
    this.scoreboard2.classList.add("disabled");
    this.scoreboard3.classList.add("disabled");
  },

  startGame() {
    console.log("start game....");

    this.startGameButt.addEventListener("click", () => {
      this.isRunning = true;
      console.log("game is running", this.isRunning);
      if (this.isRunning) {
        this.switchPlayerButt.disabled = false;
        this.scorePointButt.disabled = false;

        this.startGameButt.style.display = "none";
        this.pause.style.display = "block";
        this.playerJoin.style.display = "none";
        this.resetButt.style.display = "block";
        document.getElementById("left-control").style.display = "grid";
        document.getElementById("gameCard").style.display = "grid";
        document.getElementById("timer").style.display = "flex";

        this.headerGrid1.classList.remove("disabled");
        this.scoreboard1.classList.remove("disabled");
      }
    });

    this.resume.addEventListener("click", () => {
      this.startGameButt.style.display = "none";
      this.pause.style.display = "block";
      this.pause.disabled = false;
      this.resume.style.display = "none";
      this.switchPlayerButt.disabled = false; // Update reference
      this.scorePointButt.disabled = false;
    });

    this.pause.addEventListener("click", () => {
      console.log("Game paused");
      this.pause.style.display = "none"; // Hide pause button when paused
      this.resume.style.display = "block"; // Show resume button
      this.isRunning = false; // Update game state to not running
      this.switchPlayerButt.disabled = true;
      this.scorePointButt.disabled = true;
    });
  },

  switchPlayer() {
    this.switchPlayerButt.addEventListener("click", () => {
      //next player
      this.activePlayerIndex =
        (this.activePlayerIndex + 1) % this.players.length;
      if (this.activePlayerIndex === 0) {
        this.headerGrid1.classList.remove("disabled");
        this.headerGrid2.classList.add("disabled");
        this.headerGrid3.classList.add("disabled");
        this.scoreboard1.classList.remove("disabled");
        this.scoreboard2.classList.add("disabled");
        this.scoreboard3.classList.add("disabled");
      } else if (this.activePlayerIndex === 1) {
        this.headerGrid1.classList.add("disabled");
        this.headerGrid2.classList.remove("disabled");
        this.headerGrid3.classList.add("disabled");
        this.scoreboard1.classList.add("disabled");
        this.scoreboard2.classList.remove("disabled");
        this.scoreboard3.classList.add("disabled");
      } else if (this.activePlayerIndex === 2) {
        this.headerGrid1.classList.add("disabled");
        this.headerGrid2.classList.add("disabled");
        this.headerGrid3.classList.remove("disabled");
        this.scoreboard1.classList.add("disabled");
        this.scoreboard2.classList.add("disabled");
        this.scoreboard3.classList.remove("disabled");
      } else {
        console.log("No active player");
      }
    });
  },

  numberOfPairs() {},
};

// event handler to read desired number of pairs from the DOM input and call dealer
$("#num-pairs").on("input", function () {
  const numPairs = $(this).val();
  console.log("numPairs: " + numPairs);
});

// variable to prevent additional clicks while we wait for cards to be turned back down
let preventClicks = false;

const possibleCards = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

document.addEventListener("DOMContentLoaded", () => {
  game.init();
  game.addPlayer().then(() => {
    game.startGame(); // Start the game after a player is added
    game.switchPlayer();
    const player1 = new Player();
    player1.getNumberPoint(game);
  });
});

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  incrementScore() {
    this.score += 1;
  }

  getScore() {
    return this.score;
  }

  getNumberPoint(game) {
    game.scorePointButt.addEventListener("click", () => {
      const activePlayer = game.players[game.activePlayerIndex];
      if (activePlayer) {
        activePlayer.incrementScore();
        const score = activePlayer.getScore();
        if (game.activePlayerIndex === 0) {
          game.scoreboard1.textContent = score;
        } else if (game.activePlayerIndex === 1) {
          game.scoreboard2.textContent = score;
        } else if (game.activePlayerIndex === 2) {
          game.scoreboard3.textContent = score;
        }
      } else {
        console.log("No active game player");
      }
    });
  }
}
