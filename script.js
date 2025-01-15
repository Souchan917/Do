//====================================================
// 共通の部分（Core System）
//====================================================
// プレイヤー状態の管理
let isPlaying = false;
let currentTime = 0;
const totalDuration = 312; // 5:12 in seconds
let currentStage = 0;
const audio = new Audio('assets/audio/MT.mp3');
let clearedStages = new Set();

// DOM Elements
const playButton = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const problemArea = document.getElementById('problemArea');
const titleArea = document.querySelector('.title-area h2');
const progressBarElement = document.getElementById('progressBar');

// ステージ基本情報
const STAGE_NAMES = [
    "チュートリアル",
    "1問目", "2問目", "3問目", "4問目",
    "5問目", "6問目", "7問目", "8問目",
    "クリア"
];

const stageClearConditions = {
    0: { min: 0, max: totalDuration },
    1: { min: 10, max: 220 },
    2: { min: 10, max: 240 },
    3: { min: 10, max: 260 },
    4: { min: 10, max: 280 },
    5: { min: 10, max: 200 },
    6: { min: 10, max: 220 },
    7: { min: 10, max: 240 },
    8: { min: 10, max: 260 }
};

// 問題画像の設定
const PUZZLE_IMAGES = {
    0: null,
    1: "assets/images/puzzles/puzzle1.png",
    2: "assets/images/puzzles/puzzle2.png",
    3: "assets/images/puzzles/puzzle3.png",
    4: "assets/images/puzzles/puzzle4.png",
    5: "assets/images/puzzles/puzzle5.png",
    6: "assets/images/puzzles/puzzle6.png",
    7: "assets/images/puzzles/puzzle7.png",
    8: "assets/images/puzzles/puzzle8.png",
    9: "assets/images/puzzles/clear.png"
};

// ステージの答え
const STAGE_ANSWERS = {
    0: "チュートリアルの答え",
    1: "りんご",
    2: "みかん",
    3: "3問目の答え",
    4: "4問目の答え",
    5: "5問目の答え",
    6: "6問目の答え",
    7: "7問目の答え",
    8: "8問目の答え",
    9: "おめでとうございます！"
};

// 共通ユーティリティ関数
function createProblemElement(settings) {
    const element = document.createElement('div');
    element.id = settings.id;
    element.className = 'problem-element';
    problemArea.appendChild(element);
    return element;
}

function updateElementPosition(element, settings) {
    const containerWidth = problemArea.clientWidth;
    const containerHeight = problemArea.clientHeight;
    const scaleFactor = Math.min(containerWidth, containerHeight) / 400;
    const fontSize = settings.size * scaleFactor;
    
    element.style.fontSize = `${fontSize}px`;
    element.style.left = `${settings.x}%`;
    element.style.top = `${settings.y}%`;
    element.style.transform = 'translate(-50%, -50%)';
}

function updatePuzzleImage() {
    let existingImage = problemArea.querySelector('.puzzle-image');
    if (existingImage) {
        existingImage.remove();
    }

    const imagePath = PUZZLE_IMAGES[currentStage];
    if (imagePath) {
        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.className = 'puzzle-image';
        imageElement.alt = `Puzzle ${currentStage}`;
        problemArea.insertBefore(imageElement, problemArea.firstChild);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeWithMS(seconds) {
    return seconds.toFixed(2);
}

function shakeNextButton() {
    nextButton.classList.add('shake');
    setTimeout(() => {
        nextButton.classList.remove('shake');
    }, 500);
}

function updateBackgroundColor() {
    document.body.className = `stage-${currentStage}`;
}

function updateAnswer() {
    const answerElement = document.querySelector('.answer-area p');
    answerElement.textContent = `${STAGE_ANSWERS[currentStage]}`;
}

//====================================================
// ステージ0（チュートリアル）のギミック
//====================================================
const TIMER_SETTINGS = {
    x: 25,
    y: 25,
    size: 60,
    id: 'timer-display'
};

//====================================================
// ステージ1（ひらがな）のギミック
//====================================================
const HIRAGANA = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'を', 'ん'
];

const HIRAGANA_SETTINGS = {
    x: 50,
    y: 50,
    size: 60,
    id: 'hiragana-display'
};

let characterChangeInterval = 60*4/170;
let lastCharacterChangeTime = 0;
//====================================================
// ステージ4（セグメント）のギミック
//====================================================
const SEGMENT_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const SEGMENT_SETTINGS = {
    x: 50,
    y: 50,
    size: 48,
    id: 'segment-display'
};

const SEGMENT_CHANGE_INTERVAL = 60*4/170; // 0.5秒ごとに切り替え
//====================================================
// システム制御（System Control）
//====================================================
// 問題エリアの要素を更新
function updateProblemElements() {
    const timerElement = document.getElementById(TIMER_SETTINGS.id) || 
                        createProblemElement(TIMER_SETTINGS);
    const hiraganaElement = document.getElementById(HIRAGANA_SETTINGS.id) || 
                            createProblemElement(HIRAGANA_SETTINGS);
    const segmentElement = document.getElementById(SEGMENT_SETTINGS.id) ||
                            createProblemElement(SEGMENT_SETTINGS);

    // セグメント表示のための初期化
    if (currentStage === 4 && !segmentElement.hasChildNodes()) {
        const displayDiv = document.createElement('div');
        displayDiv.style.display = 'flex';
        displayDiv.style.gap = '5px';
        displayDiv.style.justifyContent = 'center';

        // 4桁分のセグメント画像を作成
        for (let i = 0; i < 4; i++) {
            const digitImg = document.createElement('img');
            digitImg.src = `assets/images/puzzles/stage4/segment0.png`;
            digitImg.className = 'segment-digit';
            displayDiv.appendChild(digitImg);
        }
        
        segmentElement.appendChild(displayDiv);
    }

    if (currentStage === 0) {
        timerElement.style.display = 'block';
        hiraganaElement.style.display = 'none';
        segmentElement.style.display = 'none';
        timerElement.textContent = formatTimeWithMS(currentTime);
    } 
    else if (currentStage === 1) {
        timerElement.style.display = 'none';
        hiraganaElement.style.display = 'block';
        segmentElement.style.display = 'none';
        const currentIndex = Math.floor(currentTime / characterChangeInterval) % HIRAGANA.length;
        hiraganaElement.textContent = HIRAGANA[currentIndex];
    }
    else if (currentStage === 4) {
        timerElement.style.display = 'none';
        hiraganaElement.style.display = 'none';
        segmentElement.style.display = 'block';

        // カウントアップの計算
        const currentCount = Math.floor(currentTime / SEGMENT_CHANGE_INTERVAL) % 10000;
        const paddedNumber = String(currentCount).padStart(4, '0');
        
        // 各桁の更新
        const digits = segmentElement.querySelectorAll('.segment-digit');
        digits.forEach((digit, index) => {
            digit.src = `assets/images/puzzles/stage4/segment${paddedNumber[index]}.png`;
        });
    }
    else {
        timerElement.style.display = 'none';
        hiraganaElement.style.display = 'none';
        segmentElement.style.display = 'none';
    }

    updateElementPosition(timerElement, TIMER_SETTINGS);
    updateElementPosition(hiraganaElement, HIRAGANA_SETTINGS);
    updateElementPosition(segmentElement, SEGMENT_SETTINGS);
    
    // セグメントのサイズ調整
    if (currentStage === 4) {
        const containerWidth = problemArea.clientWidth;
        const containerHeight = problemArea.clientHeight;
        const scaleFactor = Math.min(containerWidth, containerHeight) / 400;
        const digitSize = SEGMENT_SETTINGS.size * scaleFactor;
        
        const digits = segmentElement.querySelectorAll('.segment-digit');
        digits.forEach(digit => {
            digit.style.width = `${digitSize}px`;
            digit.style.height = 'auto';
        });
    }
}

function updateStageContent() {
    titleArea.textContent = STAGE_NAMES[currentStage];
    updatePuzzleImage();
    updateProblemElements();
    updateBackgroundColor();
    updateAnswer();
}

function updateProgress() {
    const progress = (currentTime / totalDuration) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('progressKnob').style.left = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(currentTime);
}

// シークバーの制御
let isDragging = false;

function updateTimeFromClick(event, forceUpdate = false) {
    if (!isDragging && !forceUpdate) return;

    const rect = progressBarElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    currentTime = percentage * totalDuration;
    audio.currentTime = currentTime;
    updateProgress();
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    const knob = document.getElementById('progressKnob');
    const knobRect = knob.getBoundingClientRect();
    
    if (touch.clientX >= knobRect.left && touch.clientX <= knobRect.right &&
        touch.clientY >= knobRect.top && touch.clientY <= knobRect.bottom) {
        isDragging = true;
        progressBarElement.addEventListener('touchmove', handleTouchMove);
    }
}

function handleTouchMove(event) {
    if (isDragging) {
        event.preventDefault();
        updateTimeFromTouch(event);
    }
}

function handleTouchEnd() {
    isDragging = false;
    progressBarElement.removeEventListener('touchmove', handleTouchMove);
}

function updateTimeFromTouch(event) {
    if (!isDragging) return;

    const touch = event.touches[0];
    const rect = progressBarElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    currentTime = percentage * totalDuration;
    audio.currentTime = currentTime;
    updateProgress();
}

//====================================================
// イベントリスナー
//====================================================
// マウスイベント
progressBarElement.addEventListener('mousedown', (event) => {
    const knob = document.getElementById('progressKnob');
    const knobRect = knob.getBoundingClientRect();
    
    if (event.clientX >= knobRect.left && event.clientX <= knobRect.right &&
        event.clientY >= knobRect.top && event.clientY <= knobRect.bottom) {
        isDragging = true;
    }
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        updateTimeFromClick(event, true);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// タッチイベント
progressBarElement.addEventListener('touchstart', handleTouchStart);
progressBarElement.addEventListener('touchend', handleTouchEnd);

// コントロールボタン
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playIcon.src = 'assets/images/controls/play.png';
    } else {
        audio.play();
        playIcon.src = 'assets/images/controls/pause.png';
    }
    isPlaying = !isPlaying;
});

// オーディオイベント
audio.addEventListener('ended', () => {
    // 時間をリセット
    currentTime = 0;
    audio.currentTime = 0;
    
    // 再生を継続
    audio.play();
});

prevButton.addEventListener('click', () => {
    if (currentStage > 0) {
        currentStage--;
        updateStageContent();
    }
});

nextButton.addEventListener('click', () => {
    if (currentStage === 9) return;

    const condition = stageClearConditions[currentStage];
    if (clearedStages.has(currentStage) || 
        (currentTime >= condition.min && currentTime <= condition.max)) {
        clearedStages.add(currentStage);
        currentStage++;
        updateStageContent();
    } else {
        shakeNextButton();
    }
});

// リサイズイベント
window.addEventListener('resize', () => {
    updateProblemElements();
});

//====================================================
// メインループと初期化
//====================================================
function update() {
    if (isPlaying) {
        currentTime = audio.currentTime;
        updateProgress();
        updateProblemElements();
    }
    requestAnimationFrame(update);
}

function initialize() {
    updateStageContent();
    updateProgress();
    requestAnimationFrame(update);
}

// 初期化
initialize();