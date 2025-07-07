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

const Keytranslations = {
  en: {
    Q: "Q",
    W: "W",
    E: "E",
    R: "R",
    T: "T",
    Y: "Y",
    U: "U",
    I: "I",
    O: "O",
    P: "P",
    A: "A",
    S: "S",
    D: "D",
    F: "F",
    G: "G",
    H: "H",
    J: "J",
    K: "K",
    L: "L",
    Z: "Z",
    X: "X",
    C: "C",
    V: "V",
    B: "B",
    N: "N",
    M: "M",
    ENTER: "ENTER",


  },
  ar: {
    Q: "ض",
    W: "ص",
    E: "ث",
    R: "ق",
    T: "ف",
    Y: "غ",
    U: "ع",
    I: "ه",
    O: "خ",
    P: "ح",
    A: "ش",
    S: "س",
    D: "ي",
    F: "ب",
    G: "ل",
    H: "ا",
    J: "ت",
    K: "ن",
    L: "م",
    Z: "ئ",
    X: "ء",
    C: "ؤ",
    V: "ر",
    B: "لا",
    N: "ى",
    M: "ك",
    ENTER: "انتر",

  }
};


function updateKeyboardLanguage(lang) {
  const t = Keytranslations[lang] || Keytranslations.en;
  document.getElementById("Q").textContent = t.Q;
  document.getElementById("W").textContent = t.W;
  document.getElementById("E").textContent = t.E;
  document.getElementById("R").textContent = t.R;
  document.getElementById("T").textContent = t.T;
  document.getElementById("Y").textContent = t.Y;
  document.getElementById("U").textContent = t.U;
  document.getElementById("I").textContent = t.I;
  document.getElementById("O").textContent = t.O;
  document.getElementById("P").textContent = t.P;
  document.getElementById("A").textContent = t.A;
  document.getElementById("S").textContent = t.S;
  document.getElementById("D").textContent = t.D;
  document.getElementById("F").textContent = t.F;
  document.getElementById("G").textContent = t.G;
  document.getElementById("H").textContent = t.H;
  document.getElementById("J").textContent = t.J;
  document.getElementById("K").textContent = t.K;
  document.getElementById("L").textContent = t.L;
  document.getElementById("Z").textContent = t.Z;
  document.getElementById("X").textContent = t.X;
  document.getElementById("C").textContent = t.C;
  document.getElementById("V").textContent = t.V;
  document.getElementById("B").textContent = t.B;
  document.getElementById("N").textContent = t.N;
  document.getElementById("M").textContent = t.M;
  document.getElementById("ENTER").textContent = t.ENTER;

}