window.addEventListener("load", () => {
  const keys = document.querySelectorAll(".keyboard-key");

  keys.forEach(key => {
    key.addEventListener("click", () => {
      const value = key.textContent.trim();

      if (value === "ENTER") {
        submitGuess();
        return;
      }

      if (key.querySelector("img") || value === "⌫") {
        handleBackspace();
        return;
      }

      insertLetter(value);
    });
  });
});

function insertLetter(char) {
  const inputs = document.querySelectorAll(".letter");
  for (let input of inputs) {
    if (!input.value) {
      input.value = char.toUpperCase();
      input.classList.add("animate");
      break;
    }
  }
  collectGuess(); // Update the guess field
}

function handleBackspace() {
  const inputs = Array.from(document.querySelectorAll(".letter"));
  for (let i = inputs.length - 1; i >= 0; i--) {
    if (inputs[i].value) {
      inputs[i].value = "";
      inputs[i].classList.remove("animate");
      break;
    }
  }
  collectGuess(); // Update the guess field
}
