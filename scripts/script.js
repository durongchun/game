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

  resetImages() {
    const images = $("#gameCard img");
    const cardFaceDown = $(".card-face-down");

    images.each((index, image) => {
      if ($(image).hasClass("hidden")) {
        $(image).removeClass("hidden");
        $(cardFaceDown[index]).addClass("d-none");
      }
    });
  },

  switchPlayer() {
    this.switchPlayerButt.addEventListener("click", () => {
      this.resetImages();
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

const $container = $("#gameCard");

// Function to generate image pairs
function generateImagePairs(numPairs) {
  $container.empty(); // Clear any existing elements

  // Calculate the number of <div> elements to add based on selected pairs
  let divCount;
  switch (numPairs) {
    case 4:
      divCount = 4;
      break;
    case 8:
      divCount = 8;
      break;
    case 12:
      divCount = 12;
      break;
    case 16:
      divCount = 16;
      break;
    default:
      divCount = 0; // Default to 0 in case of an invalid input
  }

  // Append the specified number of pairs
  for (let i = 0; i < divCount; i++) {
    $container.append(`
        <div class="spin">
          <img src="./image/Resized_beautiful_fairy.png">
          <div class="card-face-down d-none"></div>
        </div>
        <div class="spin">
          <img src="./image/Resized_beautiful_fairy.png">
          <div class="card-face-down d-none"></div>
        </div>
      `);
  }
}

// Set default to 4 pairs on page load
// generateImagePairs(4);

// function shuffleCards() {
//   // variable to prevent additional clicks while we wait for cards to be turned back down
//   let preventClicks = false;
//   let images = $("#gameCard img").toArray();
//   let cardFaceDown = $(".card-face-down").toArray();
//   let spin = $(".spin").toArray();

//   console.log("images: " + images.length);

//   const possibleCards = [
//     "A",
//     "B",
//     "C",
//     "D",
//     "E",
//     "F",
//     "G",
//     "H",
//     "I",
//     "J",
//     "K",
//     "L",
//     "M",
//     "N",
//     "O",
//     "P",
//     "Q",
//     "R",
//     "S",
//     "T",
//     "U",
//     "V",
//     "W",
//     "X",
//     "Y",
//     "Z",
//   ];

//   let selectedCards = [];
//   let cards = [];
//   let clickCards = [];

//   let possibleCardsNumber = images.length / 2;
//   console.log("possibleCardsNumber: " + possibleCardsNumber);

//   for (let i = 0; i < possibleCardsNumber; i++) {
//     const randomIndex = Math.floor(Math.random() * possibleCards.length);
//     selectedCards.push(possibleCards[randomIndex]);
//   }

//   console.log("selectedCards:" + JSON.stringify(selectedCards));

//   cards = [...selectedCards, ...selectedCards];

//   console.log("cards befor sort:" + JSON.stringify(cards));

//   cards.sort(() => Math.random() - 0.5);

//   console.log("cards after sort: " + JSON.stringify(cards));

//   const cardImageMapping = cards.map((card, index) => {
//     return {
//       card: card,
//       image: images[index],
//     };
//   });

//   console.log("cardImageMapping" + JSON.stringify(cardImageMapping));

//   for (let i = 0; i < images.length; i++) {
//     cardFaceDown[i].textContent = cardImageMapping[i].card;
//     console.log(`Assigned card: ${cardFaceDown[i].textContent}`);
//   }

//   for (let i = 0; i < images.length; i++) {
//     $(images[i]).on("click", () => {
//       let cardInfo = cardImageMapping.find((item) => item.image === images[i]);
//       if (cardInfo) {
//         images[i].classList.add("hidden");
//         cardFaceDown[i].classList.remove("d-none"); // don't display the image
//         spin[i].style.animation = "spin 0.1s linear 1 forwards";

//         if (i > 0) {
//           if (clickCards.includes(cardFaceDown[i].textContent)) {
//             const player1 = new Player();
//             player1.getNumberPoint(game);
//             clickCards = [];
//           } else {
//             images[i - 1].classList.remove("hidden");
//             cardFaceDown[i - 1].classList.add("d-none");
//             clickCards.splice[(i - 1, 1)];
//             clickCards.push(cardFaceDown[i].textContent);
//           }
//         } else {
//           clickCards.push(cardFaceDown[i].textContent);
//         }
//         console.log("clickcards: " + JSON.stringify(clickCards));
//       }
//     });
//   }
// }

function shuffleCards() {
  const images = $("#gameCard img").toArray();
  const cardFaceDown = $(".card-face-down").toArray();
  const possibleCards = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const selectedCards = possibleCards.slice(0, images.length / 2);
  const cards = [...selectedCards, ...selectedCards].sort(
    () => Math.random() - 0.5
  );

  images.forEach((image, index) => {
    cardFaceDown[index].textContent = cards[index];
    $(image).on("click", () => handleCardClick(image, cardFaceDown[index]));
  });
}

let clickCards = [];
let preventClicks = false;

function handleCardClick(image, cardFace) {
  if (preventClicks || !game.isRunning) return;

  $(image).addClass("hidden");
  $(cardFace).removeClass("d-none");

  clickCards.push(cardFace.textContent);

  if (clickCards.length === 2) {
    preventClicks = true;
    const [first, second] = clickCards;

    if (first === second) {
      console.log("Match found!");
      const activePlayer = game.players[game.activePlayerIndex];
      activePlayer.getNumberPoint(game);
      preventClicks = false;
      const matchedCards = $(".card-face-down").filter(
        (_, el) => el.textContent === first
      );
      matchedCards.addClass("matched");
      $(".hidden")
        .filter((_, el) => $(el).next(".card-face-down").text() === first)
        .addClass("matched");
    } else {
      setTimeout(() => {
        $(".hidden:not(.matched)").removeClass("hidden");
        $(".card-face-down:not(.matched)").addClass("d-none");
        preventClicks = false;
      }, 1000);
    }

    clickCards = [];
  }
}

// function resetImages() {
//   const images = $("#gameCard img").toArray();
//   const cardFaceDown = $(".card-face-down").toArray();
//   for (let i = 0; i < images.length; i++) {
//     images[i].removeClass("hidden");
//     cardFaceDown[i].addClass("d-none");
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  game.init();
  game.addPlayer().then(() => {
    // Event listener for input changes
    $("#num-pairs").on("change", function () {
      const numPairs = parseInt($(this).val());
      generateImagePairs(numPairs); // Populate the DOM
      shuffleCards(); // Shuffle cards after DOM is updated
    });

    // Initialize default pairs and shuffle
    generateImagePairs(4);
    shuffleCards();

    game.startGame();
    game.switchPlayer();
    $("#resetButt").on("click", function () {
      location.reload();
    });
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
  }
}
