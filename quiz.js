
(function () {
  const SCORE_KEY = "scores";
  const QUIZ_TIME_SECONDS = 60; // total time

  function getCurrentUser() {
    return window.Auth.getCurrentUser();
  }

  function saveScore(user, score) {
    const all = JSON.parse(localStorage.getItem(SCORE_KEY) || "[]");
    all.push({ userId: user.id, user: user.username || user.email, score, date: Date.now() });
    localStorage.setItem(SCORE_KEY, JSON.stringify(all));
  }

  function $(id) { return document.getElementById(id); }

  let questions = [];
  let current = 0;
  let answers = [];
  let timeLeft = QUIZ_TIME_SECONDS;
  let timer;

  function render() {
    $("qIndex").textContent = current + 1;
    $("qTotal").textContent = questions.length;
    const q = questions[current];
    $("questionText").textContent = q.question;
    const options = q.options.map((opt, i) => {
      const cls = answers[current] === i ? "option selected" : "option";
      return `<div class="${cls}" data-index="${i}">${opt}</div>`;
    }).join("");
    $("options").innerHTML = options;

    document.querySelectorAll("#options .option").forEach(el => {
      el.addEventListener("click", () => {
        answers[current] = parseInt(el.getAttribute("data-index"), 10);
        render();
        updateButtons();
      });
    });
    updateButtons();
  }

  function updateButtons() {
    $("prevBtn").disabled = current === 0;
    $("nextBtn").classList.toggle("hidden", current === questions.length - 1);
    $("submitBtn").classList.toggle("hidden", current !== questions.length - 1);
  }

  function startTimer() {
    $("timeLeft").textContent = timeLeft;
    timer = setInterval(() => {
      timeLeft--;
      $("timeLeft").textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        finish();
      }
    }, 1000);
  }

  function finish() {
    clearInterval(timer);
    // score = number correct
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.options.indexOf(q.answer)) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    const user = getCurrentUser();
    saveScore(user, pct);

    $("quizBox").classList.add("hidden");
    const res = $("resultBox");
    res.classList.remove("hidden");
    res.innerHTML = `
      <h2>Finished!</h2>
      <p>Your score: <strong>${pct}%</strong> (${correct}/${questions.length})</p>
      <div class="row">
        <a class="button accent" href="leaderboard.html">View Leaderboard</a>
        <a class="button" href="quiz.html">Retry</a>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const user = getCurrentUser();
    if (!user) return (window.location.href = "index.html");
    $("playerName").textContent = user.username || user.email;

    // navigation buttons
    $("prevBtn").addEventListener("click", () => { current--; render(); });
    $("nextBtn").addEventListener("click", () => { current++; render(); });
    $("submitBtn").addEventListener("click", finish);

    // load questions
    try {
      const res = await fetch("data/questions.json");
      questions = await res.json();
      // shuffle questions + options
      questions.sort(() => Math.random() - 0.5);
      questions = questions.map(q => ({
        ...q,
        options: q.options.slice().sort(() => Math.random() - 0.5)
      }));
      answers = new Array(questions.length).fill(null);
      render();
      startTimer();
    } catch (e) {
      alert("Failed to load questions. Check data/questions.json");
      console.error(e);
    }
  });
})();
