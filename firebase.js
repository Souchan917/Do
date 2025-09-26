// --- 最小・必要カウントのみ版 ---

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBhBJtjCTMy_onq0bDO_OrsXwS7QDjNcPQ",
  authDomain: "webnazokanri.firebaseapp.com",
  projectId: "webnazokanri",
  storageBucket: "webnazokanri.firebasestorage.app",
  messagingSenderId: "175593773883",
  appId: "1:175593773883:web:9be1347ff9532ba5e0751e",
  measurementId: "G-8YDV70EC6F"
});
try { analyticsIsSupported().then(ok => { if (ok) getAnalytics(app); }).catch(()=>{}); } catch(_) {}

const db = getFirestore(app);
const statsDocRef = doc(db, "games", "Do", "stats", "summary");

// 起動時 setDoc をやめ、必要な時だけ update→失敗したら set→update
async function safeUpdate(updates) {
  try {
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

// 端末ローカルでユニーク制御
const START_KEY = "do_unique_start_v1";
const CLEAR_KEY = "do_unique_clear_v1";

function recordStart() {
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(START_KEY)) {
      localStorage.setItem(START_KEY, "1");
      return safeUpdate({ uniqueStarts: increment(1) });
    }
  } catch(_) {}
  return Promise.resolve();
}

function recordClear() {
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(CLEAR_KEY)) {
      localStorage.setItem(CLEAR_KEY, "1");
      return safeUpdate({ uniqueClears: increment(1) });
    }
  } catch(_) {}
  return Promise.resolve();
}

// もし uniqueVisitors も残したいなら下記を有効化（末尾の自動実行は付けない）
/*
const VISITOR_KEY = "do_unique_visitor_v1";
function recordVisitOnceEver() {
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem(VISITOR_KEY)) {
      localStorage.setItem(VISITOR_KEY, "1");
      return safeUpdate({ uniqueVisitors: increment(1) });
    }
  } catch(_) {}
  return Promise.resolve();
}
// 必要なら start モーダルOK後など任意のタイミングで recordVisitOnceEver() を呼ぶ
*/

window.firebaseCounters = { recordStart, recordClear };
window.firebaseReady = Promise.resolve();

// ❌ 旧：recordVisit(); の自動実行はしない
