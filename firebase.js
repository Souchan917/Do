// Firebase counters for "Do" (minimal, aggregated only)
// Exposes global API: window.firebaseCounters.{recordStart, recordClear}
// Visits (total + unique) are recorded automatically on load.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhBJtjCTMy_onq0bDO_OrsXwS7QDjNcPQ",
  authDomain: "webnazokanri.firebaseapp.com",
  projectId: "webnazokanri",
  storageBucket: "webnazokanri.firebasestorage.app",
  messagingSenderId: "175593773883",
  appId: "1:175593773883:web:9be1347ff9532ba5e0751e",
  measurementId: "G-8YDV70EC6F"
};

// Initialize
const app = initializeApp(firebaseConfig);
try {
  analyticsIsSupported().then((ok) => { if (ok) getAnalytics(app); }).catch(() => {});
} catch (_) {}
const db = getFirestore(app);

// Data structure (Firestore): games/{GAME_ID}/stats/summary (document)
const GAME_ID = "Do";
const statsDocRef = doc(db, "games", GAME_ID, "stats", "summary");

// Ensure the stats document exists so updateDoc won't fail
let __ensureDoc = setDoc(statsDocRef, { __initialized: true }, { merge: true }).catch(() => {});

async function safeUpdate(updates) {
  try {
    await __ensureDoc;
    await updateDoc(statsDocRef, updates);
  } catch (e) {
    try {
      await setDoc(statsDocRef, {}, { merge: true });
      await updateDoc(statsDocRef, updates);
    } catch (err) {
      console.warn("Firestore update skipped:", err);
    }
  }
}

// Local de-dup keys (approx unique by browser)
const VISITOR_KEY = "do_unique_visitor_v1";
const START_KEY = "do_unique_start_v1";
const CLEAR_KEY = "do_unique_clear_v1";

function recordVisit() {
  const updates = { totalVisits: increment(1) };
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(VISITOR_KEY)) {
      updates.uniqueVisitors = increment(1);
      localStorage.setItem(VISITOR_KEY, "1");
    }
  } catch (_) {}
  return safeUpdate(updates);
}

let startRecordedThisSession = false;
function recordStart() {
  if (startRecordedThisSession) return Promise.resolve();
  startRecordedThisSession = true;
  const updates = { totalStarts: increment(1) };
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(START_KEY)) {
      updates.uniqueStarts = increment(1);
      localStorage.setItem(START_KEY, "1");
    }
  } catch (_) {}
  return safeUpdate(updates);
}

let clearRecordedThisSession = false;
function recordClear() {
  if (clearRecordedThisSession) return Promise.resolve();
  clearRecordedThisSession = true;
  const updates = { totalClears: increment(1) };
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(CLEAR_KEY)) {
      updates.uniqueClears = increment(1);
      localStorage.setItem(CLEAR_KEY, "1");
    }
  } catch (_) {}
  return safeUpdate(updates);
}

// Expose to non-module script.js
window.firebaseCounters = { recordStart, recordClear };
window.firebaseReady = Promise.resolve();

// Record a visit immediately
recordVisit();
