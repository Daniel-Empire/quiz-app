
// Simple localStorage-based auth (demo only). Replace with Firebase in production.
(function () {
  const USERS_KEY = "users";
  const SESSION_KEY = "session";

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function makeId() {
    return 'u_' + Math.random().toString(36).slice(2, 10);
  }

  function hash(pwd) {
    // Not secure! Placeholder for demo.
    return btoa(unescape(encodeURIComponent(pwd))).split("").reverse().join("");
  }

  function getCurrentUser() {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, email: user.email, username: user.username }));
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  }

  // Expose globally
  window.Auth = { getCurrentUser, logout };

  // UI helpers on each page
  document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    const profileLink = document.getElementById("profileLink");
    if (profileLink && user) profileLink.classList.remove("hidden");

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const users = getUsers();
        const u = users.find(x => x.email === email && x.password === hash(password));
        if (!u) return alert("Invalid credentials");
        setSession(u);
        window.location.href = "quiz.html";
      });
    }

    // Signup form
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const users = getUsers();
        if (users.some(u => u.email === email)) return alert("Email already registered");
        const user = { id: makeId(), username, email, password: hash(password), createdAt: Date.now() };
        users.push(user);
        saveUsers(users);
        setSession(user);
        window.location.href = "quiz.html";
      });
    }
  });
})();
