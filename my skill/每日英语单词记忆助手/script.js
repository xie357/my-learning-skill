const words = [
  { word: "apple", meaning: "苹果", example: "I eat an apple every day." },
  { word: "discover", meaning: "发现", example: "She discovered a new café nearby." },
  { word: "journey", meaning: "旅程", example: "The journey was long but enjoyable." },
  { word: "focus", meaning: "专注", example: "Please focus on your homework." },
  { word: "habit", meaning: "习惯", example: "Reading is a good habit." },
  { word: "natural", meaning: "自然的", example: "The view from the hill is natural and beautiful." },
  { word: "value", meaning: "价值", example: "This lesson has great value." },
  { word: "record", meaning: "记录", example: "She likes to record new vocabulary." },
  { word: "challenge", meaning: "挑战", example: "Learning a language is a challenge." },
  { word: "change", meaning: "改变", example: "Change can be a good thing." },
];

const wordText = document.getElementById("wordText");
const wordMeaning = document.getElementById("wordMeaning");
const historyList = document.getElementById("historyList");
const historyHint = document.getElementById("historyHint");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const speakButton = document.getElementById("speakButton");
const clearButton = document.getElementById("clearButton");

let currentIndex = 0;
const STORAGE_KEY = "dailyWordMemoryHistory";

function loadHistory() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn("本地存储解析失败，将重置记录", error);
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function formatDate(date) {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderWord(index) {
  const item = words[index];
  wordText.textContent = item.word;
  wordMeaning.textContent = `${item.meaning} · 示例：${item.example}`;
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyHint.style.display = "block";
    return;
  }
  historyHint.style.display = "none";
  history.slice().reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `<span>【${entry.word}】${entry.meaning}</span><time>${entry.time}</time>`;
    historyList.appendChild(li);
  });
}

function addHistory() {
  const history = loadHistory();
  const currentWord = words[currentIndex];
  const entry = {
    word: currentWord.word,
    meaning: currentWord.meaning,
    time: formatDate(new Date()),
  };
  history.push(entry);
  saveHistory(history);
  renderHistory();
}

function speakWord() {
  const text = words[currentIndex].word;
  if (!window.speechSynthesis) {
    alert("您的浏览器不支持语音合成。");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

prevButton.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  renderWord(currentIndex);
  addHistory();
});

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % words.length;
  renderWord(currentIndex);
  addHistory();
});

speakButton.addEventListener("click", () => {
  speakWord();
});

clearButton.addEventListener("click", () => {
  if (!confirm("确定要清空所有打卡记录吗？")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

window.addEventListener("DOMContentLoaded", () => {
  renderWord(currentIndex);
  renderHistory();
  addHistory();
});
