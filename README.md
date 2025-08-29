
# Quiz App (GitHub Pages + Firebase-ready)

A simple online quiz with **login**, **timer**, **scoring**, and **leaderboard**.
- Out of the box it uses **localStorage** (demo auth & scores).
- You can later plug in **Firebase Authentication + Firestore** without changing the UI.

## Project Structure
```
quiz-app/
├─ index.html          # login & signup
├─ quiz.html           # quiz page
├─ leaderboard.html    # top scores
├─ profile.html        # user's scores
├─ css/style.css
├─ js/
│  ├─ firebase.js      # placeholder – put your Firebase config here
│  ├─ auth.js          # mocked auth (localStorage)
│  ├─ quiz.js          # quiz logic, timer, scoring
│  └─ leaderboard.js   # leaderboard (localStorage for now)
└─ data/questions.json # edit your questions here
```

## Run locally
Open `index.html` in your browser (or use a simple HTTP server).

## Deploy to GitHub Pages
1. Create a new repo, e.g. `quiz-app`.
2. Upload these files.
3. Repo **Settings → Pages → Deploy from branch** (main, root).
4. Visit `https://<your-username>.github.io/quiz-app/`

## Editing Questions
Edit `data/questions.json`:
```json
[
  {"question":"...","options":["A","B","C","D"],"answer":"A"}
]
```

## Switch to Firebase (later)
1. Create a Firebase project.
2. Enable **Authentication (Email/Password)** and **Firestore**.
3. In `js/firebase.js`, paste your config & initialize Firebase.
4. Replace auth in `js/auth.js`:
   - `Auth.getCurrentUser()` → `firebase.auth().onAuthStateChanged(...)`
   - Login/Signup handlers → `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`
5. Replace local leaderboard in `js/quiz.js` & `js/leaderboard.js`:
   - On finish, write `{ user, score, date }` to `scores` collection.
   - On leaderboard page, query: `db.collection('scores').orderBy('score','desc').limit(10)`.

> Security note: localStorage auth is only for demo/dev. Use Firebase (or your backend) for real apps.
