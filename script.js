//====================================================
// 共通の部分（Core System）
//====================================================
// プレイヤー状態の管理
let isPlaying = false;
let currentTime = 0;
const totalDuration = 254; // 5:12 in seconds
let currentStage = 0;
const audio = new Audio('assets/audio/GOODFORTUNE Extended.mp3');
audio.volume = 0.3; // デフォルトの音量を30%に設定
let clearedStages = new Set();

// リズム関連の定数
const BPM = 170;
const BEATS_PER_SECOND = BPM / 60;

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

//====================================================
// ステージ関連の設定
//====================================================
const STAGE_NAMES = [
    "チュートリアル",
    "1問目", "2問目", "3問目", "4問目",
    "5問目", "6問目", "7問目", "8問目",
    "クリア"
];

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

const STAGE_ANSWERS = {
    0: "チュートリアル",
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

// ステージごとのドット設定
const stageSettings = {
    0: { dots: 4 },  // チュートリアル
    1: { dots: 8 },  // 1問目
    2: { dots: 8 },  // 2問目
    3: { dots: 16 }, // 3問目
    4: { dots: 4 },  // 4問目
    5: { dots: 8 },  // 5問目
    6: { dots: 16 }, // 6問目
    7: { dots: 8 },  // 7問目
    8: { dots: 4 }   // 8問目
};

// 正解パターン（内部でのみ使用）
const correctPatterns = {
    0: [2, 4],           // チュートリアル
    1: [2, 4, 6, 8],     // 1問目
    2: [1, 3, 5, 7],     // 2問目
    3: [4, 8, 12, 16],   // 3問目
    4: [1, 2, 3, 4],     // 4問目
    5: [1, 3, 4, 7],     // 5問目
    6: [4, 8, 12, 16],   // 6問目
    7: [2, 4, 6, 8],     // 7問目
    8: [1, 2, 3, 4]      // 8問目
};

//====================================================
// リズム判定用の状態管理を更新
//====================================================
let currentBeatProgress = 0;
let selectedBeats = new Set();      // プレイヤーが選択した拍
let lastBeat = -1;
let isLoopComplete = false;         // 1ループが完了したかどうか



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

let characterChangeInterval = 60*4/170/4;
let lastCharacterChangeTime = 0;
//====================================================
// ステージ4（セグメント）のギミック
//====================================================
const SEGMENT_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const SEGMENT_SETTINGS = {
    x: 50,
    y: 50,
    size: 30,
    id: 'segment-display'
};

const SEGMENT_CHANGE_INTERVAL = 60*4/170/4; // 0.5秒ごとに切り替え



//====================================================
// 共通ユーティリティ関数
//====================================================
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
// リズムドット関連の機能
//====================================================
function createRhythmDots() {
    const dotsContainer = document.getElementById('rhythmDots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const dotCount = stageSettings[currentStage]?.dots || 4;
    
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'rhythm-dot';
        dotsContainer.appendChild(dot);
    }
}

function updateRhythmDots() {
    if (!isPlaying) return;
    
    const dotsContainer = document.getElementById('rhythmDots');
    if (!dotsContainer) return;
    
    const dotCount = stageSettings[currentStage]?.dots || 4;
    const oldBeat = lastBeat;
    currentBeatProgress = (currentTime * BEATS_PER_SECOND) % dotCount;
    const currentBeat = Math.floor(currentBeatProgress) + 1;
    
    // ループの完了を検出
    if (currentBeat < oldBeat) {
        // 1ループ完了時の正誤判定
        checkRhythmPattern();
        selectedBeats.clear();  // ここでリセット
        isLoopComplete = true;
    } else {
        isLoopComplete = false;
    }
    
    lastBeat = currentBeat;
    
    // ドットの表示を更新
    const dots = dotsContainer.querySelectorAll('.rhythm-dot');
    dots.forEach((dot, index) => {
        const beatNumber = index + 1;
        const isCurrentBeat = beatNumber === currentBeat;
        const isSelected = selectedBeats.has(beatNumber);
        
        dot.classList.toggle('active', isCurrentBeat);
        dot.classList.toggle('selected', isSelected);
    });
}


// checkRhythmPatternも修正
function checkRhythmPattern() {
    const pattern = correctPatterns[currentStage];
    
    // 選択された拍の数と正解パターンの数が一致するかチェック
    if (selectedBeats.size !== pattern.length) {
        selectedBeats.clear();  // サイズが合わない場合もリセット
        return;
    }
    
    // すべての正解の拍が選択されているかチェック
    const allBeatsCorrect = pattern.every(beat => selectedBeats.has(beat));
    
    if (allBeatsCorrect) {
        clearedStages.add(currentStage);
        currentStage++;
        updateStageContent();
    } else {
        selectedBeats.clear();  // 不正解の場合、選択をリセット
    }
}
//====================================================
// システム制御
//====================================================
function updateProgress() {
    const progress = (currentTime / totalDuration) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('progressKnob').style.left = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(currentTime);
}

function updateStageContent() {
    titleArea.textContent = STAGE_NAMES[currentStage];
    updatePuzzleImage();
    updateBackgroundColor();
    updateAnswer();
    createRhythmDots();
    selectedBeats.clear();  // 選択状態をリセット
    isLoopComplete = false;
}

function update() {
    if (isPlaying) {
        currentTime = audio.currentTime;
        updateProgress();
        updateRhythmDots();
    }
    requestAnimationFrame(update);
}

//====================================================
// シークバー制御
//====================================================
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

progressBarElement.addEventListener('touchstart', handleTouchStart);
progressBarElement.addEventListener('touchend', handleTouchEnd);

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

audio.addEventListener('ended', () => {
    currentTime = 0;
    audio.currentTime = 0;
    audio.play();
});

prevButton.addEventListener('click', () => {
    if (currentStage > 0) {
        currentStage--;
        updateStageContent();
    }
});

// 次へボタンの処理を修正
nextButton.addEventListener('click', () => {
    if (currentStage === 9) return;
    
    // クリア済みのステージの場合は即座に次へ進む
    if (clearedStages.has(currentStage)) {
        currentStage++;
        updateStageContent();
        return;
    }
    
    const currentBeat = Math.floor(currentBeatProgress) + 1;
    selectedBeats.add(currentBeat);  // 現在の拍を選択状態に追加
});

window.addEventListener('resize', () => {
    createRhythmDots();
});

//====================================================
// 初期化
//====================================================
function initialize() {
    updateStageContent();
    updateProgress();
    requestAnimationFrame(update);
}

// 初期化実行
initialize();
