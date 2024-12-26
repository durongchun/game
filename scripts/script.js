"use strict";

const game = {
  title: "Memory Card",
  isRunning: false,
  players: [],
  activePlayerIndex: 0, //this is activePlayer index
  scoreboard1: "",
  scoreboard2: "",
  scoreboard3: "",
  startGameButt: "",
  switchPlayerButt: "",
  scoreBoardButt: "",
  resetButt: "",
  resume: "",
  pause: "",
  playerJoin: "",
  headerGrid1: "",
  headerGrid2: "",
  headerGrid3: "",
  rightGrid1: "",
  rightGrid2: "",
  rightGrid3: "",
  numPairs: 4,
  remainingTime: 60,
  clockRemainingTime: 0,
  switchPlayer: false,
  countdownInterval: 0,
  spentTime: 0,
  player1TotalSpent: 0,
  player2TotalSpent: 0,
  player3TotalSpent: 0,
  score1: "",
  score2: "",
  score3: "",
  images: "",
  cardFaceDown: "",

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
            this.rightGrid1.textContent = newPlayer.name;
            this.scoreboard1.textContent = newPlayer.getScore();
            this.score1 = newPlayer.getScore();
          } else if (this.players.length === 2) {
            this.headerGrid2.textContent = newPlayer.name;
            this.rightGrid2.textContent = newPlayer.name;
            this.scoreboard2.textContent = newPlayer.getScore();
            this.score2 = newPlayer.getScore();
          } else if (this.players.length === 3) {
            this.headerGrid3.textContent = newPlayer.name;
            this.rightGrid3.textContent = newPlayer.name;
            this.scoreboard3.textContent = newPlayer.getScore();
            this.score3 = newPlayer.getScore();
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
    this.scoreBoardButt = document.getElementById("left-score");
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
    this.rightGrid1 = document.getElementById("player1");
    this.rightGrid2 = document.getElementById("player2");
    this.rightGrid3 = document.getElementById("player3");
    this.score1 = document.getElementById("score1");
    this.score2 = document.getElementById("score1");
    this.score3 = document.getElementById("score1");

    this.startGameButt.disabled = true;
    this.switchPlayerButt.disabled = true;
    this.scoreBoardButt.disabled = true;

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
        // Enable buttons
        this.switchPlayerButt.disabled = false;
        this.scoreBoardButt.disabled = false;

        // Hide and show elements with animation
        this.startGameButt.style.display = "none";
        this.pause.style.display = "block";
        this.playerJoin.style.display = "none";
        this.resetButt.style.display = "block";
        document.getElementById("game").style.backgroundImage =
          'url("../image/pexels-heather-rosario-1293045183-24363595.jpg")';
        document.getElementById("pairStart").style.display = "none";

        // Add animation classes to the elements
        document.getElementById("left-control").style.display = "grid";
        document.getElementById("gameCard").style.display = "grid";
        document.getElementById("timer").style.display = "flex";

        // Apply the animation with delays to each element
        document
          .getElementById("left-control")
          .classList.add("show-up", "show-up-delay-1");
        document
          .getElementById("gameCard")
          .classList.add("show-up", "show-up-delay-2");
        document
          .getElementById("timer")
          .classList.add("show-up", "show-up-delay-3");

        // Apply the header and scoreboard transitions
        this.headerGrid1.classList.remove("disabled");
        this.scoreboard1.classList.remove("disabled");

        // Start countdown and stop animation
        startCountdown(game.remainingTime);
        stopAnimation(game.remainingTime);
      }
    });

    this.resume.addEventListener("click", () => {
      this.startGameButt.style.display = "none";
      this.pause.style.display = "block";
      this.pause.disabled = false;
      this.resume.style.display = "none";
      this.switchPlayerButt.disabled = false; // Update reference
      this.scoreBoardButt.disabled = false;
      console.log("game is resume!");
      shuffleCards();
      startCountdown(game.clockRemainingTime);
      stopAnimation(game.clockRemainingTime);
    });

    this.pause.addEventListener("click", () => {
      console.log("Game paused");
      this.pause.style.display = "none"; // Hide pause button when paused
      this.resume.style.display = "block"; // Show resume button
      this.isRunning = false; // Update game state to not running
      this.switchPlayerButt.disabled = true;
      this.scoreBoardButt.disabled = true;
      console.log("xxxxxxxxxxx", game.countdownInterval);
      console.log("game.clockRemainingTime: ", game.clockRemainingTime);

      clearInterval(game.countdownInterval);
      stopAnimation(0);
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
      generateImagePairs(game.numPairs);
      shuffleCards();
      clearInterval(game.countdownInterval);
      console.log("game.spentTime", game.spentTime);
      scoreBoard();

      startCountdown(game.remainingTime);
      stopAnimation(game.remainingTime);

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

function setClock(time) {
  document.querySelector("#clock").textContent = time;
}

// Function to generate image pairs
function generateImagePairs(numPairs) {
  $container.empty(); // Clear any existing elements

  // Calculate the number of <div> elements to add based on selected pairs
  let divCount;
  switch (numPairs) {
    case 4:
      divCount = 4;
      setClock("00:30:00");
      game.remainingTime = 30;
      break;
    case 8:
      divCount = 8;
      setClock("01:00:00");
      game.remainingTime = 60;
      break;
    case 12:
      divCount = 12;
      setClock("01:30:00");
      game.remainingTime = 90;
      break;
    case 16:
      divCount = 16;
      setClock("02:00:00");
      game.remainingTime = 120;
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

function shuffleCards() {
  game.images = $("#gameCard img").toArray();
  game.cardFaceDown = $(".card-face-down").toArray();
  const possibleCards = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  console.log("images: ", game.images.length);

  const selectedCards = possibleCards.slice(0, game.images.length / 2);
  const cards = [...selectedCards, ...selectedCards].sort(
    () => Math.random() - 0.5
  );

  console.log("selectdCards:", JSON.stringify(selectedCards));
  console.log("cards", JSON.stringify(cards));
  game.images.forEach((image, index) => {
    game.cardFaceDown[index].textContent = cards[index];
    $(image).on("click", () =>
      handleCardClick(image, game.cardFaceDown[index])
    );
  });
}

function resumeShuffleCards() {}

function scoreBoard() {
  // Add the spent time for the current player to their total
  const totalSpent = game.spentTime;
  if (game.activePlayerIndex === 0) {
    game.player1TotalSpent += totalSpent;
    game.scoreboard1.textContent = `Score: ${game.players[0].getScore()}, Time: ${
      game.player1TotalSpent
    }s`;
    document.getElementById("score1").textContent =
      game.scoreboard1.textContent;
    console.log("Player 1 Total Spent Time:", game.player1TotalSpent);
  } else if (game.activePlayerIndex === 1) {
    game.player2TotalSpent += totalSpent;
    game.scoreboard2.textContent = `Score: ${game.players[1].getScore()}, Time: ${
      game.player2TotalSpent
    }s`;
    document.getElementById("score2").textContent =
      game.scoreboard2.textContent;
    console.log("Player 2 Total Spent Time:", game.player2TotalSpent);
  } else if (game.activePlayerIndex === 2) {
    game.player3TotalSpent += totalSpent;
    game.scoreboard3.textContent = `Score: ${game.players[2].getScore()}, Time: ${
      game.player3TotalSpent
    }s`;
    document.getElementById("score3").textContent =
      game.scoreboard3.textContent;
    console.log("Player 3 Total Spent Time:", game.player3TotalSpent);
  }

  const result = determineWinner();
  console.log("result: ", JSON.stringify(result));
  document.getElementById(
    "winner"
  ).textContent = `Winner: ${result.Winner}, Score: ${result.Score}, Time: ${result.Time}s`;
}

let clickCards = [];
let preventClicks = false;
let pairs = 0;

function handleCardClick(image, cardFace) {
  if (preventClicks || !game.isRunning) return;

  $(image).addClass("hidden");
  $(cardFace).removeClass("d-none");

  clickCards.push(cardFace.textContent);

  if (clickCards.length === 2) {
    console.log("clickCards ", JSON.stringify(clickCards));
    preventClicks = true;
    const [first, second] = clickCards;

    if (first === second) {
      pairs++;
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

      if (pairs === game.numPairs) {
        showAlertModal();

        clearInterval(game.countdownInterval);
        pairs = 0;
      }
    } else {
      setTimeout(() => {
        $(".hidden:not(.matched)").removeClass("hidden");
        $(".card-face-down:not(.matched)").addClass("d-none");
        preventClicks = false;
      }, 500);
    }

    clickCards = [];
  }
}

function showAlertModal() {
  const modalElement = document.querySelector("#alertModal");
  if (modalElement) {
    const alertModal = new bootstrap.Modal(modalElement);
    alertModal.show();
  } else {
    console.error("Modal element not found!");
  }
}

// Function to format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// Function to start the countdown
function startCountdown(seconds) {
  // let countdownInterval; // Variable to store the countdown interval
  game.clockRemainingTime = seconds;
  const clockElement = document.querySelector("#clock");

  if (!clockElement) {
    console.error("Timer element not found!");
    return;
  }

  // Set the initial value on the clock
  clockElement.textContent = formatTime(game.clockRemainingTime);

  // Update the clock every second
  game.countdownInterval = setInterval(() => {
    game.clockRemainingTime--;
    clockElement.textContent = formatTime(game.clockRemainingTime);
    game.spentTime = game.remainingTime - game.clockRemainingTime;

    // Stop the countdown when time runs out
    if (game.clockRemainingTime <= 0) {
      clearInterval(game.countdownInterval);
      clockElement.textContent = "00:00";
      setTimeout(() => {
        alert("Game is over!");
      }, 10);
    }
  }, 1000);
}

function stopAnimation(seconds) {
  // Start the heartbeat animation
  const timeInMilliseconds = seconds * 1000;
  const heartElement = document.querySelector("#heart");

  console.log("seconds: ", timeInMilliseconds);

  // Set a timer to stop the animation after 30 seconds
  setTimeout(() => {
    heartElement.style.animation = "none"; // Stop the animation
  }, timeInMilliseconds); // 30 seconds in milliseconds
}

function determineWinner() {
  const scores = [game.scoreboard1, game.scorePoint2, game.scoreboard3];
  const times = [
    game.player1TotalSpent,
    game.player2TotalSpent,
    game.player3TotalSpent,
  ];

  let winnerIndex = 0;

  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[winnerIndex]) {
      winnerIndex = i;
    } else if (scores[i] === scores[winnerIndex]) {
      if (times[i] < times[winnerIndex]) {
        winnerIndex = i;
      }
    }
  }

  return {
    Winner: game.players[winnerIndex + 1].name,
    Score: game.players[winnerIndex + 1].score,
    Time: times[winnerIndex + 1],
  };
}

document.addEventListener("DOMContentLoaded", () => {
  game.init();
  game.addPlayer().then(() => {
    // Event listener for input changes
    $("#num-pairs").on("change", function () {
      game.numPairs = parseInt($(this).val());
      generateImagePairs(game.numPairs); // Populate the DOM
      shuffleCards(); // Shuffle cards after DOM is updated
    });

    // Initialize default pairs and shuffle
    generateImagePairs(game.numPairs);
    shuffleCards();

    game.startGame();
    game.switchPlayer();

    $("#resetButt").on("click", function () {
      // Add the fade-out class to the body
      document.body.classList.add("fade-out");

      // Set a delay for the page reload to match the fade-out duration
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 1000);
    });

    $("#left-score").on("click", function () {
      const rightControl = document.querySelector("#right-control");

      if (rightControl.classList.contains("d-none")) {
        rightControl.classList.remove("d-none", "slide-out");
        rightControl.classList.add("slide-in");
      } else {
        rightControl.classList.remove("slide-in");
        rightControl.classList.add("slide-out");

        setTimeout(() => {
          rightControl.classList.add("d-none");
        }, 300); // Match the animation duration
      }

      scoreBoard();
    });

    $("#next").on("click", function () {
      document.body.classList.add("fade-out");

      setTimeout(() => {
        game.resetButt.style.display = "block";
        document.getElementById("pairStart").classList.remove("d-none");
        document.getElementById("playerJoin").classList.add("d-none");
        document.getElementById("game").style.backgroundImage =
          'url("../image/zane-lee-IHj0xtWtLKE-unsplash.jpg")';
        document.body.classList.remove("fade-out");
      }, 800);
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
