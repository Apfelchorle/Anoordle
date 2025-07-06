let target = "";
let guesses = [];
let hintUsed = false;
let currentApiLanguage = "en";

// 🌐 Change language + layout direction
function updateApiLanguage(lang) {
  currentApiLanguage = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  updateMenuLanguage(lang); // ✨ Localize UI
  showMessage(`🌐 Language set to ${getLanguageLabel(lang)}`, "info");
  restartGame();
}


function getLanguageLabel(code) {
  return { en: "English", ar: "Arabic" }[code] || "Unknown";
}

// 🔤 Get random word
async function getRandomWord() {
  if (currentApiLanguage === "ar") {
    return arabicWords[Math.floor(Math.random() * arabicWords.length)];
  }

  const response = await fetch("https://api.datamuse.com/words?sp=?????&max=1000");
  const data = await response.json();
  const words = data.map(w => w.word).filter(w => /^[a-z]{5}$/.test(w));
  return words[Math.floor(Math.random() * words.length)];
}

// ✅ Word validation
async function isValidWord(word) {
  if (currentApiLanguage === "en") {
    const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
    const data = await response.json();
    return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
  }
  return true; // Assume Arabic words are valid
}

// 💬 Message box
function showMessage(msg, type = "info") {
  const box = document.getElementById("messageBox");
  box.textContent = msg;
  box.className = "";

  box.style.backgroundColor = {
    success: "#d4edda",
    error: "#f8d7da",
    info: "#fff"
  }[type] || "#fff";

  box.style.color = {
    success: "#155724",
    error: "#721c24",
    info: "#333"
  }[type] || "#333";

  box.classList.add("message-visible", "message-fadeout");
  setTimeout(() => {
    box.classList.remove("message-visible", "message-fadeout");
  }, 3000);
}

// 🔊 Play sound
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) sound.play();
}

// 🌗 Toggle theme
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  document.getElementById("toggleDark").checked = document.body.classList.contains("dark");
  document.getElementById("toggleDarkMenu").checked = document.body.classList.contains("dark");
}

// 🧩 Setup letter inputs
function setupLetterInputs() {
  const container = document.getElementById("letterInputs");
  container.innerHTML = "";
  const length = target.length || 5;

  for (let i = 0; i < length; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "letter";

    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase().replace(/[^A-Zأ-ي]/g, "");
      input.classList.remove("animate");
      void input.offsetWidth;
      input.classList.add("animate");
      if (input.value && i < length - 1) container.children[i + 1].focus();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && i > 0) container.children[i - 1].focus();
      if (e.key === "Enter") {
        collectGuess();
        submitGuess();
      }
    });

    container.appendChild(input);
  }

  container.children[0]?.focus();
}

// 🧠 Collect guess
function collectGuess() {
  const guess = Array.from(document.querySelectorAll(".letter"))
    .map(input => input.value)
    .join("");
  document.getElementById("guess").value = guess;
}

// 📤 Submit guess
async function submitGuess() {
  collectGuess();
  const guess = document.getElementById("guess").value.toLowerCase();

  if (guess.length !== target.length) {
    playSound("errorSound");
    showMessage(`⛔ Enter all ${target.length} letters!`, "error");
    return;
  }

  if (!(await isValidWord(guess))) {
    playSound("errorSound");
    showMessage("❌ Not a valid word!", "error");
    return;
  }

  guesses.push(guess);
  createGrid();
  updateKeyboardColors()

  if (guess === target) {
    playSound("successSound");
    handleWinCondition();
    showMessage("🎉 You got it!", "success");
    document.body.scrollIntoView({
    behavior: 'smooth'
    });
    document.getElementById("winOverlay").style.display = "flex";
    document.getElementById("guessCount").textContent = guesses.length;
    document.getElementById("languageDisplay").textContent = getLanguageLabel(currentApiLanguage);
    triggerConfetti();
  } else {
    showMessage("📌 Guess submitted!", "info");
  }

  setupLetterInputs();
}

// 🧩 Create guess grid
function createGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${target.length}, 52px)`;

  guesses.forEach((guess) => {
    guess.split("").forEach((char, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = char;

      setTimeout(() => {
        cell.classList.add("animate");
        if (char === target[i]) cell.classList.add("correct");
        else if (target.includes(char)) cell.classList.add("present");
        else cell.classList.add("absent");
      }, i * 100);

      grid.appendChild(cell);
      updateKeyboardColors()
    });
  });
}

// 🔍 Hint system
function hint() {
  if (!target) return showMessage("Game hasn't started yet!", "error");
  if (hintUsed) return showMessage("❗ You've already used your hint!", "error");

  const index = Math.floor(Math.random() * target.length);
  showMessage(`🔍 Hint: Contains "${target[index].toUpperCase()}"`, "info");
  hintUsed = true;
}

// 🔁 Restart game
async function restartGame() {
  resetKeyboardColors()
  const btn = document.querySelector('button[onclick="restartGame()"]');
  btn.disabled = true;
  const previous = target;
  target = await getRandomWord();
  guesses = [];
  hintUsed = false;
  createGrid();
  setupLetterInputs();
  const winOverlay = document.getElementById("winOverlay");
  if (winOverlay) winOverlay.style.display = "none";
  showMessage(previous ? `🔄 New word! Last one was "${previous}"` : "🟢 Game started!", "info");
  btn.disabled = false;
}

// 🎉 Confetti
function triggerConfetti() {
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.textContent = "🎊";
    piece.style.position = "fixed";
    piece.style.zIndex = "9999";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = "0";
    piece.style.fontSize = `${12 + Math.random() * 24}px`;
    piece.style.animation = "confetti-fall 2s ease-out forwards";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

// 🪟 Launch popup
function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
  restartGame();
}

// ☰ Menu logic
function toggleMenu() {
  document.body.classList.toggle("menu-open");
}

function closeMenu() {
  document.body.classList.remove("menu-open");
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + id).classList.add("active");
}

function toggleNotes(show) {
  document.getElementById("footerNotes").style.display = show ? "block" : "none";
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  document.body.classList.add("mobile");
}


function toggleStyle(useResponsive) {
  const head = document.head;
  const existingStyle = document.getElementById("main-style");

  if (existingStyle) {
    head.removeChild(existingStyle);
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.id = "main-style";
  link.href = useResponsive ? "responsive.css" : "style.css";
  head.appendChild(link);
}

function killMenu() {
  const menu = document.getElementById("menuPanel");
  const menuButton = document.getElementById("menuButton");

  if (menu) menu.style.display = "none";
  if (menuButton) menuButton.style.display = "none";
}


function toggleGameButtons() {
  const checkbox = document.getElementById("toggleGamebuttons");
  const gameButtons = document.getElementById("GameButtons");

  if (gameButtons && checkbox) {
    gameButtons.style.display = checkbox.checked ? "none" : "block";
  }
}

function spawnConfettiBurst(count = 30) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}

function getRandomColor() {
  const colors = ["#e91e63", "#ffc107", "#4caf50", "#2196f3", "#ff5722"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function handleWinCondition() {
  spawnConfettiBurst(); // 🎉 Launch confetti
  document.getElementById("winOverlay").style.display = "flex"; // Show win popup
}

const translations = {
  en: {
    winMessage: "🎉 You Won!",
    winDescription: "Great job guessing the word!",
    playButton: "Play Again?",
    menuLabel: "Game Menu",
    homeTab: "🏠 Home",
    themesTab: "🎨 Themes",
    settingsTab: "⚙️ Settings",
    closeMenu: "✖",
    languageLabel: "🌍 Language",
    Lang: "🌐 Language:",
    winText: "✅ You guessed all the letters correctly",
    TotalGuesses: "📜 Total guesses:"
  },
  ar: {
    winMessage: "🎉 لقد فزت!",
    winDescription: "عمل رائع! لقد خمنت الكلمة!",
    playButton: "ألعب مجددًا؟",
    menuLabel: "القائمة",
    homeTab: "🏠 الرئيسية",
    themesTab: "🎨 الألوان",
    settingsTab: "⚙️ الإعدادات",
    closeMenu: "✖",
    languageLabel: "🌍 اللغة",
    Lang: "🌐 اللغة:",
    winText: "✅ لقد خمنت جميع الحروف الصحيحة",
    TotalGuesses: "📜 عدد التخمينات:"
  }
};


function updateMenuLanguage(lang) {
  const t = translations[lang] || translations.en;
  document.getElementById("winMessage").textContent = t.winMessage;
  document.getElementById("winDescription").textContent = t.winDescription;
  document.getElementById("playButton").textContent = t.playButton;
  document.getElementById("menuLabel").textContent = t.menuLabel;
  document.getElementById("homeTab").textContent = t.homeTab;
  document.getElementById("themesTab").textContent = t.themesTab;
  document.getElementById("settingsTab").textContent = t.settingsTab;
  document.getElementById("closeMenu").textContent = t.closeMenu;
  document.getElementById("languageLabel").textContent = t.languageLabel;
  document.getElementById("winText").textContent = t.winText;
  document.getElementById("Lang").textContent = t.Lang;
  document.getElementById("TotalGuesses").textContent = t.TotalGuesses;

}

function updateKeyboardColors() {
  const allKeys = document.querySelectorAll(".keyboard-key");

  guesses.forEach(guess => {
    guess.split("").forEach((char, i) => {
      const key = [...allKeys].find(k => k.textContent.trim().toUpperCase() === char.toUpperCase());
      if (!key) return;

      if (char === target[i]) {
        key.classList.remove("key-present", "key-absent");
        key.classList.add("key-correct");
      } else if (target.includes(char)) {
        if (!key.classList.contains("key-correct")) {
          key.classList.remove("key-absent");
          key.classList.add("key-present");
        }
      } else {
        if (!key.classList.contains("key-correct") && !key.classList.contains("key-present")) {
          key.classList.add("key-absent");
        }
      }
    });
  });
}

function resetKeyboardColors() {
  const keys = document.querySelectorAll(".keyboard-key");
  keys.forEach(key => {
    key.classList.remove("key-correct", "key-present", "key-absent");
  });
}


function toggleKeyboard() {
  const checkbox = document.getElementById("toggleKeyboard");
  const container = document.getElementById("keyboardContainer");

  if (checkbox && container) {
    container.style.display = checkbox.checked ? "none" : "flex";
  }
}










// 🚀 Init
window.addEventListener("load", () => {
  setupLetterInputs();
  document.getElementById("menuButton").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("menuPanel");
    const button = document.getElementById("menuButton");
    if (!menu.contains(e.target) && !button.contains(e.target)) {
      closeMenu();
    }
  });
});
