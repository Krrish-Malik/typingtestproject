const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing speed tests help improve accuracy and speed.",
  "Practice makes perfect in the world of typing.",
  "Never stop learning because life never stops teaching."
];

let originalText = "";
let timerInterval, countdownInterval;
let startTime = null;
let started = false;

const inputBox = document.getElementById("input-box");
const testText = document.getElementById("test-text");
const timer = document.getElementById("timer");
const wpm = document.getElementById("wpm");
const accuracy = document.getElementById("accuracy");
const errors = document.getElementById("errors");
const username = document.getElementById("username");
const suggestions = document.getElementById("suggestions");
const leaderboard = document.getElementById("leaderboard");

function startTest() {
  if (!username.value.trim()) {
    alert("Please enter your name.");
    return;
  }
  originalText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  testText.textContent = originalText;
  inputBox.value = "";
  inputBox.disabled = true;
  started = false;
  inputBox.disabled = true;
  document.getElementById("countdown-display").textContent = "Starting in 3...";
  let counter = 3;
  countdownInterval = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown-display").textContent = "";
      beginTyping();
    } else {
      document.getElementById("countdown-display").textContent = `Starting in ${counter}...`;
    }
  }, 1000);
}

function beginTyping() {
  inputBox.disabled = false;
  inputBox.focus();
  startTime = new Date();
  started = true;
  timerInterval = setInterval(updateStats, 1000);
}

function updateStats() {
  const current = inputBox.value;
  const timeElapsed = Math.floor((new Date() - startTime) / 1000);
  if (timeElapsed === 0) return;

  const words = current.trim().split(/\s+/).length;
  const chars = current.length;
  const correctChars = current.split('').filter((ch, i) => ch === originalText[i]).length;
  const err = originalText.length - correctChars;

  timer.textContent = timeElapsed;
  wpm.textContent = Math.round((words / timeElapsed) * 60);
  accuracy.textContent = Math.max(0, Math.round((correctChars / originalText.length) * 100));
  errors.textContent = err;

  updateSuggestions(current);

  if (current === originalText) {
    clearInterval(timerInterval);
    inputBox.disabled = true;
    saveToLeaderboard(username.value, parseInt(wpm.textContent));
    showLeaderboard();
  }
}

function resetTest() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  inputBox.value = "";
  inputBox.disabled = true;
  testText.textContent = "Click start to begin typing test.";
  timer.textContent = "0";
  wpm.textContent = "0";
  accuracy.textContent = "100";
  errors.textContent = "0";
  suggestions.textContent = "";
  document.getElementById("countdown-display").textContent = "";
}

function updateSuggestions(currentText) {
  const lastWord = currentText.trim().split(/\s+/).pop();
  const matches = originalText.split(/\s+/).filter(word => word.startsWith(lastWord) && word !== lastWord);
  suggestions.textContent = matches.slice(0, 3).join(", ");
}

function saveToLeaderboard(name, score) {
  const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  data.push({ name, wpm: score });
  data.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem("leaderboard", JSON.stringify(data.slice(0, 10)));
}

function showLeaderboard() {
  const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.innerHTML = "<h3>🏆 Leaderboard</h3><ol>" +
    data.map(e => `<li>${e.name}: ${e.wpm} WPM</li>`).join("") + "</ol>";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

const title = "Krrish & Kanishk's Typing Speed Test";
let char = 0;
function typeTitle() {
  if (char < title.length) {
    document.getElementById("animated-title").textContent += title.charAt(char);
    char++;
    setTimeout(typeTitle, 80);
  }
}
window.onload = typeTitle;





