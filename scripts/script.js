"use strict";

const game = {
  title: "Memory Card",
  isRunning: false,
  players: [],
  activePlayerIndex: 0,
  scoreboard1: "",
  scoreboard2: "",
  scoreboard3: "",
  startGameButt: "",
  switchPlayerButt: "",
  isSwitchedPlayer: true,
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
  cards: [],
  clickCards: [],
  gameRunningSound: "",
  backGroundMusic: "",

  addPlayer() {
    return new Promise((resolve) => {
      const inputBox = document.getElementById("userInput");
      const button = document.getElementById("myButton");

      button.addEventListener("click", () => {
        mouseClickSound();
        const inputValue = inputBox.value.trim();
        if (inputValue) {
          const newPlayer = new Player(inputValue);
          // Store the instance
          this.players.push(newPlayer);

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
          // Clear input box after adding
          inputBox.value = "";
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
    this.gameRunningSound = document.getElementById("gameRunningSound");
    console.log("Audio element:", game.gameRunningSound);

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
      mouseClickSound();
      this.isRunning = true;
      console.log("game is running", this.isRunning);

      if (this.isRunning) {
        gameSoundPlay();
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

        // Start countdown and animation
        startCountdown(game.remainingTime);
        startAnimation();
      }
    });

    this.resume.addEventListener("click", () => {
      mouseClickSound();
      this.startGameButt.style.display = "none";
      this.pause.style.display = "block";
      this.pause.disabled = false;
      this.resume.style.display = "none";
      this.switchPlayerButt.disabled = false;
      this.scoreBoardButt.disabled = false;
      console.log("game is resume!");
      gameSoundPlay();
      resumeShuffleCards();
      startCountdown(game.clockRemainingTime);
      restartAnimation();
      stopAnimation();
    });

    this.pause.addEventListener("click", () => {
      mouseClickSound();
      console.log("Game paused");
      // Hide pause button when paused
      this.pause.style.display = "none";
      // Show resume button
      this.resume.style.display = "block";
      // Update game state to not running
      this.isRunning = false;
      this.switchPlayerButt.disabled = true;
      this.scoreBoardButt.disabled = true;
      console.log("xxxxxxxxxxx", game.countdownInterval);
      console.log("game.clockRemainingTime: ", game.clockRemainingTime);

      stopGameSound();
      clearInterval(game.countdownInterval);
      stopAnimation();
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
      console.log("switched player");
      mouseClickSound();
      // clearInterval(game.backGroundMusic);
      stopAnimation();
      stopGameSound();
      clearInterval(game.countdownInterval);
      console.log(
        `clear game.backGroundMusic when switching player: `,
        game.backGroundMusic
      );

      // stopRunningSound();

      this.resetImages();
      generateImagePairs(game.numPairs);
      shuffleCards();
      console.log("game.spentTime", game.spentTime);
      if (game.isSwitchedPlayer) {
        timeSpent();
        scoreBoard();
      } else {
        scoreBoard();
        game.isSwitchedPlayer = true;
      }
      console.log("switch player game.remainingTime: ", game.remainingTime);

      gameSoundPlay();
      startCountdown(game.remainingTime);
      startAnimation();

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

function generateImagePairs(numPairs) {
  // Clear any existing elements
  $container.empty();

  // Calculate the number of <div> elements to add based on selected pairs
  let divCount;
  switch (numPairs) {
    case 4:
      divCount = 4;
      setClock("00:30");
      game.remainingTime = 30;
      break;
    case 8:
      divCount = 8;
      setClock("01:00");
      game.remainingTime = 60;
      break;
    case 12:
      divCount = 12;
      setClock("01:30");
      game.remainingTime = 90;
      break;
    case 16:
      divCount = 16;
      setClock("02:00");
      game.remainingTime = 120;
      break;
    default:
      // Default to 0 in case of an invalid input
      divCount = 0;
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
  console.log("images: ", JSON.stringify(game.images));

  const selectedCards = possibleCards.slice(0, game.images.length / 2);
  game.cards = [...selectedCards, ...selectedCards].sort(
    () => Math.random() - 0.5
  );

  console.log("selectdCards:", JSON.stringify(selectedCards));
  console.log("cards", JSON.stringify(game.cards));
  game.images.forEach((image, index) => {
    game.cardFaceDown[index].textContent = game.cards[index];
    $(image).on("click", () => {
      mouseClickSound();
      handleCardClick(image, game.cardFaceDown[index]);
    });
  });
}

function resumeShuffleCards() {
  console.log(
    "resume game.images: ",
    game.images.length,
    JSON.stringify(game.images)
  );
  console.log(
    "game.cardFaceDown",
    game.cardFaceDown.length,
    JSON.stringify(game.cardFaceDown)
  );
  console.log("cards", JSON.stringify(game.cards));
  game.isRunning = true;

  game.images.forEach((image, index) => {
    // Remove any existing click event listeners
    $(image).off("click");

    // Update the card face content
    game.cardFaceDown[index].textContent = game.cards[index];
    console.log("xxxx", game.cardFaceDown[index].textContent);

    // Reapply the click event listener
    $(image).on("click", () => {
      console.log(`Card clicked [${index}]:`, game.cardFaceDown[index]);
      mouseClickSound();
      handleCardClick(image, game.cardFaceDown[index]);
    });
  });
}

function timeSpent() {
  const totalSpent = game.spentTime;
  if (game.activePlayerIndex === 0) {
    game.player1TotalSpent += totalSpent;
  } else if (game.activePlayerIndex === 1) {
    game.player2TotalSpent += totalSpent;
  } else if (game.activePlayerIndex === 2) {
    game.player3TotalSpent += totalSpent;
  }
}

function scoreBoard() {
  if (game.activePlayerIndex === 0) {
    game.scoreboard1.textContent = `Score: ${game.players[0].getScore()}, Time: ${
      game.player1TotalSpent
    }s`;
    game.score1 = game.players[0].getScore();
    document.getElementById("score1").textContent =
      game.scoreboard1.textContent;
    console.log("Player 1 Total Spent Time:", game.player1TotalSpent);
  } else if (game.activePlayerIndex === 1) {
    game.scoreboard2.textContent = `Score: ${game.players[1].getScore()}, Time: ${
      game.player2TotalSpent
    }s`;
    document.getElementById("score2").textContent =
      game.scoreboard2.textContent;
    game.score2 = game.players[1].getScore();
    console.log("Player 2 Total Spent Time:", game.player2TotalSpent);
  } else if (game.activePlayerIndex === 2) {
    game.scoreboard3.textContent = `Score: ${game.players[2].getScore()}, Time: ${
      game.player3TotalSpent
    }s`;
    document.getElementById("score3").textContent =
      game.scoreboard3.textContent;
    game.score3 = game.players[2].getScore();
    console.log("Player 3 Total Spent Time:", game.player3TotalSpent);
  }

  const result = determineWinner();
  console.log("result: ", JSON.stringify(result));
  document.getElementById(
    "winner"
  ).innerHTML = `Winner <span class="winner-name">${result.Winner}</span> <br> Score: ${result.Score}, Time: ${result.Time}s`;
}

let preventClicks = false;
let pairs = 0;

function handleCardClick(image, cardFace) {
  console.log("game.isRunning", game.isRunning);
  if (preventClicks || !game.isRunning) return;

  console.log("resume clickxxxxxxx");
  $(image).addClass("hidden");
  $(cardFace).removeClass("d-none");

  game.clickCards.push(cardFace.textContent);

  if (game.clickCards.length === 2) {
    console.log("game.clickCards ", JSON.stringify(game.clickCards));
    preventClicks = true;
    const [first, second] = game.clickCards;

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
        stopGameSound();
        // stopRunningSound();
        const modalElement = document.querySelector("#alertModal");
        showAlertModal(modalElement);
        clearInterval(game.countdownInterval);
        // stopAnimation(0);
        stopAnimation();
        pairs = 0;
      }
    } else {
      setTimeout(() => {
        $(".hidden:not(.matched)").removeClass("hidden");
        $(".card-face-down:not(.matched)").addClass("d-none");
        preventClicks = false;
      }, 500);
    }

    game.clickCards = [];
  }
}

function showAlertModal(modal) {
  if (modal) {
    const alertModal = new bootstrap.Modal(modal);
    const gameOverSound = document.getElementById("gameOverSound");

    if (gameOverSound) {
      gameOverSound.play().catch((error) => {
        console.error("Failed to play gameOverSound:", error);
      });
    }

    alertModal.show();

    // Ensure focus is set to the modal
    modal.addEventListener("shown.bs.modal", () => {
      const firstFocusableElement = modal.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      firstFocusableElement?.focus();
    });
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
        stopGameSound();
        const modal = document.querySelector("#alertModal2");
        showAlertModal(modal);
        stopAnimation();
      }, 10);
    }
  }, 1000);
}

function restartAnimation() {
  const heartElement = document.getElementById("heart");
  // Add the class back after a small delay to restart the animation
  setTimeout(() => {
    heartElement.classList.add("heartbeat");
  }, 10); // 10ms delay ensures the animation resets
}

function determineWinner() {
  const scores = [game.score1, game.score2, game.score3]; // Corrected the repeated scoreboard3
  const times = [
    game.player1TotalSpent,
    game.player2TotalSpent,
    game.player3TotalSpent,
  ];

  console.log("scores: ", JSON.stringify(scores));
  console.log("times: ", JSON.stringify(times));

  let winnerIndex = 0;

  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[winnerIndex]) {
      // Higher score is better
      winnerIndex = i;
    } else if (scores[i] === scores[winnerIndex]) {
      // If scores are equal, compare times
      if (times[i] < times[winnerIndex]) {
        // Lower time is better for tiebreak
        winnerIndex = i;
      }
    }
  }

  // Return the winner's details
  return {
    Winner: game.players[winnerIndex].name, // Access player's name using the index
    Score: game.players[winnerIndex].score, // Use the score directly from scores array
    Time: times[winnerIndex], // Use the time directly from times array
  };
}

function winnerBoard() {
  // Show the winner board and play sound if the audio element exists
  const gameWinner = document.getElementById("gameWinner");
  const game = document.getElementById("game");
  gameWinner.classList.remove("d-none");
  game.classList.add("d-none");

  const gameWinnerSound = document.getElementById("gameWinnerSound");
  const result = determineWinner();

  if (gameWinnerSound) {
    gameWinnerSound.play().catch((error) => {
      console.error("Failed to play the winner sound:", error);
    });
  } else {
    console.error("Audio element with id 'gameWinnerSound' not found!");
  }

  // Display the winner
  gameWinner.innerHTML = `
    <h1 class="winner-name">${result.Winner} 
      <span class="text-warning">is the winner!</span>
    </h1>`;

  // Revert to game view after 2 seconds
  setTimeout(() => {
    gameWinner.classList.add("d-none");
    game.classList.remove("d-none");

    if (gameWinnerSound) {
      console.log("Lucyxxxxxx");
      gameWinnerSound.pause();
      // Reset sound
      gameWinnerSound.currentTime = 0;
    }

    console.log("game.classList", game.classList);
  }, 2000);

  // Log the result for debugging
  console.log("result: ", JSON.stringify(result));
}

// Flag to control the loop
let isLooping = false;

function gameSoundPlay() {
  const INTERVAL_DELAY = 500; // Set an interval (e.g., 500ms)

  // Check if the audio element is available
  if (!game.gameRunningSound) {
    console.error("Game running sound element not found!");
    return;
  }

  // Start the loop
  function playSoundInLoop() {
    if (!isLooping) return; // Stop the loop if the flag is false

    game.gameRunningSound
      .play()
      .then(() => {
        console.log("Game running sound playing...");
      })
      .catch((error) => {
        console.error("Error playing gameRunningSound:", error);
      });

    // Call this function again after the delay to continue the loop
    setTimeout(playSoundInLoop, INTERVAL_DELAY);
  }

  // Set the flag to true and start the loop
  isLooping = true;
  playSoundInLoop();
}

function stopGameSound() {
  isLooping = false; // Stop the loop

  // Pause and reset the sound
  if (game.gameRunningSound) {
    game.gameRunningSound.pause();
    game.gameRunningSound.currentTime = 0;
    console.log("Stopped game running sound.");
  }
}

// Flag to control the animation loop
let isAnimating = false;

// Function to start the heartbeat animation
function startAnimation() {
  const heartElement = document.querySelector("#heart");

  if (!heartElement) {
    console.error("Heart element not found!");
    return;
  }

  // Function to add the heartbeat class in a loop
  function animateLoop() {
    // If isAnimating is false, stop the loop
    if (!isAnimating) return;

    // Add animation class to start the animation
    heartElement.classList.add("heartbeat");
    console.log("Started heartbeat animation...");

    // We can use setTimeout to call this function again and repeat the animation
    setTimeout(() => {
      // Remove the animation class so it can restart the animation
      heartElement.classList.remove("heartbeat");

      // Call animateLoop to continue the animation
      if (isAnimating) animateLoop();
    }, 1000); // Adjust the duration of animation if needed (e.g., 1s for heartbeat)
  }

  // Start the animation loop
  isAnimating = true;
  animateLoop();
}

// Function to stop the heartbeat animation
function stopAnimation() {
  isAnimating = false; // Stop the animation loop
  const heartElement = document.querySelector("#heart");

  // Remove the animation class and reset the state
  if (heartElement) {
    heartElement.classList.remove("heartbeat");
    console.log("Stopped heartbeat animation.");
  }
}

let isPlaying = false;

function mouseClickSound() {
  if (!isPlaying) {
    isPlaying = true;
    let mouseClickSound = document.getElementById("mouseClickSound");

    if (mouseClickSound) {
      mouseClickSound
        .play()
        .then(() => {
          // Reset after the sound has played
          isPlaying = false;
        })
        .catch((error) => {
          console.error("Failed to play the sound:", error);
          // Reset on error
          isPlaying = false;
        });
    } else {
      console.error("Audio element not found!");
      isPlaying = false;
    }
  }
}

function stopRunningSound() {
  // Check if game.gameRunningSound is assigned correctly
  if (
    !game.gameRunningSound ||
    typeof game.gameRunningSound.pause !== "function"
  ) {
    console.error("game.gameRunningSound is not a valid audio element!");
    return;
  }

  // Pause the sound and reset its position
  game.gameRunningSound.pause();
  game.gameRunningSound.currentTime = 0;
  console.log("Stopped game running sound.");
}

document.addEventListener("DOMContentLoaded", () => {
  game.init();
  game.addPlayer().then(() => {
    $("#num-pairs").on("change", function () {
      mouseClickSound();
      game.numPairs = parseInt($(this).val());
      generateImagePairs(game.numPairs);
      shuffleCards();
    });

    // Initialize default pairs and shuffle
    generateImagePairs(game.numPairs);
    shuffleCards();

    game.startGame();
    game.switchPlayer();

    $("#resetButt").on("click", function () {
      mouseClickSound();
      // Add the fade-out class to the body
      document.body.classList.add("fade-out");

      // Set a delay for the page reload to match the fade-out duration
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    $("#left-score").on("click", function () {
      mouseClickSound();
      console.log("game.isSwitchedPlayer1: ", game.isSwitchedPlayer);
      if (game.isSwitchedPlayer) {
        timeSpent();
        scoreBoard();
        game.isSwitchedPlayer = false;
        console.log("game.isSwitchedPlayer2: ", game.isSwitchedPlayer);
      } else {
        console.log("game.isSwitchedPlayer3: ", game.isSwitchedPlayer);
        scoreBoard();
      }

      winnerBoard();
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
    });

    $("#next").on("click", function () {
      mouseClickSound();
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
