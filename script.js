
const playButton = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBarElement = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const problemArea = document.getElementById('problemArea');
const titleArea = document.querySelector('.title-area h2');
//====================================================
// 定数定義
//====================================================
const BPM = 180;
const BEATS_PER_SECOND = BPM / 60;
const TOTAL_DURATION = 254; // 4:14 in seconds

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



//====================================================
// ギミックシステム
//====================================================
const GIMMICK_TYPES = {
    TIMER: 'timer',
    HIRAGANA: 'hiragana',
    IMAGE_SEQUENCE: 'image_sequence',
    SEGMENT: 'segment'
};

const STAGE_CONFIGS = {
    0: {
        type: GIMMICK_TYPES.TIMER,
        settings: {
            x: 25,
            y: 25,
            size: 100
        }
    },
    1: {
        type: GIMMICK_TYPES.HIRAGANA,
        settings: {
            x: 50,
            y: 50,
            size: 100,
            changeInterval: 60 * 4 / 180 / 4,
            characters: HIRAGANA
        }
    },
    2: {
        type: GIMMICK_TYPES.IMAGE_SEQUENCE,
        settings: {
            x: 50,
            y: 50,
            size: 60,
            images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage2/mikan${i}.png`),
            changeInterval: 60 * 4 / 180 / 4
        }
    },
    3: {
        type: GIMMICK_TYPES.IMAGE_SEQUENCE,
        settings: {
            x: 20,
            y: 50,
            size: 80,
            images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage3/moon${i}.png`),
            changeInterval: 60 * 4 / 180 / 4
        }
    },
    4: {
        type: GIMMICK_TYPES.SEGMENT,
        settings: {
            x: 50,
            y: 50,
            size: 10,
            changeInterval: 60 * 4 / 180 / 4
        }
    },
    // 以下、仮の設定
    5: {
        type: GIMMICK_TYPES.IMAGE_SEQUENCE,
        settings: {
            x: 50,
            y: 50,
            size: 70,
            images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage5/image${i}.png`),
            changeInterval: 60 * 4 / 180 / 4
        }
    },
    6: {
        type: GIMMICK_TYPES.HIRAGANA,
        settings: {
            x: 50,
            y: 50,
            size: 80,
            changeInterval: 60 * 4 / 180 / 4,
            characters: ['春', '夏', '秋', '冬']
        }
    },
    7: {
        type: GIMMICK_TYPES.IMAGE_SEQUENCE,
        settings: {
            x: 50,
            y: 50,
            size: 70,
            images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage7/image${i}.png`),
            changeInterval: 60 * 4 / 180 / 4
        }
    },
    // 8-21までの仮設定を追加
    // ...他のステージも同様に設定
};

const STAGE_NAMES = [
    "チュートリアル",
    "りんごステージ", "みかんステージ", "月見ステージ",
    "数字ステージ", "花火ステージ", "季節ステージ",
    "星空ステージ", "雨ステージ", "虹ステージ",
    "風船ステージ", "雪ステージ", "海ステージ",
    "山ステージ", "森ステージ", "太陽ステージ",
    "雲ステージ", "砂漠ステージ", "洞窟ステージ",
    "夜空ステージ", "オーロラステージ", "氷河ステージ",
    "最終ステージ", "エンディング"
];

const PUZZLE_IMAGES = {
    0: null,
    1: "assets/images/puzzles/puzzle1.png",
    2: "assets/images/puzzles/puzzle2.png",
    3: "assets/images/puzzles/stage3/puzzlemoon.png",
    4: "assets/images/puzzles/puzzle4.png",
    5: "assets/images/puzzles/puzzle5.png",
    6: "assets/images/puzzles/puzzle6.png",
    7: "assets/images/puzzles/puzzle7.png",
    8: "assets/images/puzzles/puzzle8.png",
    9: "assets/images/puzzles/puzzle9.png",
    10: "assets/images/puzzles/puzzle10.png",
    11: "assets/images/puzzles/puzzle11.png",
    12: "assets/images/puzzles/puzzle12.png",
    13: "assets/images/puzzles/puzzle13.png",
    14: "assets/images/puzzles/puzzle14.png",
    15: "assets/images/puzzles/puzzle15.png",
    16: "assets/images/puzzles/puzzle16.png",
    17: "assets/images/puzzles/puzzle17.png",
    18: "assets/images/puzzles/puzzle18.png",
    19: "assets/images/puzzles/puzzle19.png",
    20: "assets/images/puzzles/puzzle20.png",
    21: "assets/images/puzzles/puzzle21.png",
    22: "assets/images/puzzles/puzzle22.png",
    23: "assets/images/puzzles/clear.png"
};

const STAGE_ANSWERS = {
    0: "チュートリアルの答え",
    1: "りんご",
    2: "みかん",
    3: "つきみ",
    4: "セグメント",
    5: "はなび",
    6: "きせつ",
    7: "ほしぞら",
    8: "あめふり",
    9: "にじいろ",
    10: "ふうせん",
    11: "ゆきげしき",
    12: "うみべ",
    13: "やまなみ",
    14: "もりのなか",
    15: "たいよう",
    16: "くもり",
    17: "さばく",
    18: "どうくつ",
    19: "よぞら",
    20: "オーロラ",
    21: "オーロラ",
    22: "さいご",
    23: "おめでとう！"
};

const stageSettings = {
    0: { dots: 4 },
    1: { dots: 8 },
    2: { dots: 8 },
    3: { dots: 8 },
    4: { dots: 4 },
    5: { dots: 8 },
    6: { dots: 16 },
    7: { dots: 8 },
    8: { dots: 4 },
    9: { dots: 8 },
    10: { dots: 16 },
    11: { dots: 8 },
    12: { dots: 4 },
    13: { dots: 8 },
    14: { dots: 16 },
    15: { dots: 8 },
    16: { dots: 4 },
    17: { dots: 8 },
    18: { dots: 16 },
    19: { dots: 8 },
    20: { dots: 4 },
    19: { dots: 8 },
    22: { dots: 8 },
    23: { dots: 4 }
};
const correctPatterns = {
    0: [1, 2, 3, 4],
    1: [2, 4, 6, 8],
    2: [1, 3, 5, 7],
    3: [2],
    4: [1, 2, 3, 4],
    5: [1, 3, 4, 7],
    6: [4, 8, 12, 16],
    7: [2, 4, 6, 8],
    8: [1, 2, 3, 4],
    9: [2, 4, 6, 8],
    10: [4, 8, 12, 16],
    11: [1, 3, 5, 7],
    12: [1, 2, 3, 4],
    13: [2, 4, 6, 8],
    14: [4, 8, 12, 16],
    15: [1, 3, 5, 7],
    16: [1, 2, 3, 4],
    17: [2, 4, 6, 8],
    18: [4, 8, 12, 16],
    19: [1, 3, 5, 7],
    20: [1, 2, 3, 4],
    21: [1, 2, 3, 4],
    22: [2, 4, 6, 8],
    23: [1, 2, 3, 4]
};
//====================================================
// ゲーム状態管理
//====================================================
let isPlaying = false;
let currentTime = 0;
let currentStage = 0;
let clearedStages = new Set();
let currentBeatProgress = 0;
let selectedBeats = new Set();
let lastBeat = -1;
let isLoopComplete = false;
const audio = new Audio('assets/audio/Shimokita.mp3');
audio.volume = 0.3;

//====================================================
// ギミック管理クラス
//====================================================
class GimmickManager {
    constructor() {
        this.elements = new Map();
    }

    createGimmickElement(stageId) {
        const config = STAGE_CONFIGS[stageId];
        if (!config) return null;

        const element = document.createElement('div');
        element.className = 'problem-element';
        element.id = `gimmick-${stageId}`;
        
        if (config.type === GIMMICK_TYPES.IMAGE_SEQUENCE) {
            const img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            element.appendChild(img);
        }

        problemArea.appendChild(element);
        this.elements.set(stageId, element);
        return element;
    }

    updateGimmick(stageId, currentTime) {
        const config = STAGE_CONFIGS[stageId];
        if (!config) return;
    
        let element = this.elements.get(stageId);
        if (!element) {
            element = this.createGimmickElement(stageId);
        }
    
        // サイズの自動調整のための計算
        const containerSize = Math.min(problemArea.clientWidth, problemArea.clientHeight);
        const scaleFactor = containerSize / 400;
        const size = config.settings.size * scaleFactor;
    
        // 共通のスタイル設定
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${config.settings.x}%`;
        element.style.top = `${config.settings.y}%`;
        element.style.transform = 'translate(-50%, -50%)';
    
        // フォントサイズの設定（タイマーとひらがな用）
        if (config.type === GIMMICK_TYPES.TIMER || config.type === GIMMICK_TYPES.HIRAGANA) {
            element.style.fontSize = `${size * 0.5}px`; // サイズの50%をフォントサイズとして使用
            element.style.lineHeight = `${size}px`; // 縦方向の中央揃え
            element.style.textAlign = 'center'; // 横方向の中央揃え
            element.style.display = 'flex';
            element.style.justifyContent = 'center';
            element.style.alignItems = 'center';
        }
    
        switch (config.type) {
            case GIMMICK_TYPES.TIMER:
                element.textContent = formatTime(currentTime);
                break;
    
            case GIMMICK_TYPES.HIRAGANA:
                const charIndex = Math.floor(currentTime / config.settings.changeInterval) % config.settings.characters.length;
                element.textContent = config.settings.characters[charIndex];
                break;
    
            case GIMMICK_TYPES.IMAGE_SEQUENCE:
                const img = element.querySelector('img');
                if (img) {
                    const imageIndex = Math.floor(currentTime / config.settings.changeInterval) % config.settings.images.length;
                    const imagePath = config.settings.images[imageIndex];
                    if (img.src !== imagePath) {
                        img.src = imagePath;
                    }
                }
                break;
    
            case GIMMICK_TYPES.SEGMENT:
                const currentCount = Math.floor(currentTime / config.settings.changeInterval) % 10000;
                const paddedNumber = String(currentCount).padStart(4, '0');
                
                // セグメントのサイズ調整
                const digitWidth = size / 4; // 4つの数字を横に並べるため
                const digits = element.querySelectorAll('.segment-digit');
                if (digits.length === 0) {
                    for (let i = 0; i < 4; i++) {
                        const digitImg = document.createElement('img');
                        digitImg.className = 'segment-digit';
                        digitImg.src = `assets/images/puzzles/stage4/segment${paddedNumber[i]}.png`;
                        digitImg.style.width = `${digitWidth}px`;
                        digitImg.style.height = `${size}px`;
                        element.appendChild(digitImg);
                    }
                } else {
                    digits.forEach((digit, index) => {
                        digit.src = `assets/images/puzzles/stage4/segment${paddedNumber[index]}.png`;
                        digit.style.width = `${digitWidth}px`;
                        digit.style.height = `${size}px`;
                    });
                }
                break;
        }
    }

    hideAllExcept(currentStageId) {
        this.elements.forEach((element, stageId) => {
            element.style.display = stageId === currentStageId ? 'block' : 'none';
        });
    }
}

//====================================================
// ユーティリティ関数
//====================================================
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    if (currentBeat < oldBeat) {
        checkRhythmPattern();
        selectedBeats.clear();
        isLoopComplete = true;
    } else {
        isLoopComplete = false;
    }

    lastBeat = currentBeat;

    const dots = dotsContainer.querySelectorAll('.rhythm-dot');
    dots.forEach((dot, index) => {
        const beatNumber = index + 1;
        const isCurrentBeat = beatNumber === currentBeat;
        const isSelected = selectedBeats.has(beatNumber);

        dot.classList.toggle('active', isCurrentBeat);
        dot.classList.toggle('selected', isSelected);
    });
}

function checkRhythmPattern() {
    const pattern = correctPatterns[currentStage];

    if (selectedBeats.size !== pattern.length) {
        selectedBeats.clear();
        return;
    }

    const allBeatsCorrect = pattern.every(beat => selectedBeats.has(beat));

    if (allBeatsCorrect) {
        clearedStages.add(currentStage);
        currentStage++;
        updateStageContent();
    } else {
        selectedBeats.clear();
    }
}

//====================================================
// UI更新関数
//====================================================
const gimmickManager = new GimmickManager();

function updateProgress() {
    const progress = (currentTime / TOTAL_DURATION) * 100;
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
    selectedBeats.clear();
    isLoopComplete = false;
    updateProblemElements();
}

function updateBackgroundColor() {
    document.body.className = `stage-${currentStage}`;
}

function updateAnswer() {
    const answerElement = document.querySelector('.answer-area p');
    answerElement.textContent = STAGE_ANSWERS[currentStage];
}

function updateProblemElements() {
    gimmickManager.updateGimmick(currentStage, currentTime);
    gimmickManager.hideAllExcept(currentStage);
}

function update() {
    if (isPlaying) {
        currentTime = audio.currentTime;
        updateProgress();
        updateRhythmDots();
        updateProblemElements();
    }
    requestAnimationFrame(update);
}

//====================================================
// イベントリスナー
//====================================================
let isDragging = false;

function updateTimeFromClick(event, forceUpdate = false) {
    if (!isDragging && !forceUpdate) return;

    const rect = progressBarElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));

    currentTime = percentage * TOTAL_DURATION;
    audio.currentTime = currentTime;
    updateProgress();
}

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

nextButton.addEventListener('click', () => {
    if (currentStage === 9) return;

    if (clearedStages.has(currentStage)) {
        currentStage++;
        updateStageContent();
        return;
    }

    const currentBeat = Math.floor(currentBeatProgress) + 1;
    selectedBeats.add(currentBeat);
});

// プログレスバーのドラッグ制御
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

// タッチデバイス用のイベントリスナー
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

    currentTime = percentage * TOTAL_DURATION;
    audio.currentTime = currentTime;
    updateProgress();
}

progressBarElement.addEventListener('touchstart', handleTouchStart);
progressBarElement.addEventListener('touchend', handleTouchEnd);

// ウィンドウリサイズ時の処理
window.addEventListener('resize', () => {
    createRhythmDots();
    updateProblemElements();
});




//====================================================
// デバッグツール
//====================================================
const debugTools = {
    initialize() {
        const stageSelect = document.getElementById('stageSelect');
        const jumpButton = document.getElementById('debugJump');

        // ステージジャンプ
        jumpButton.addEventListener('click', () => {
            const targetStage = parseInt(stageSelect.value);
            this.forceJumpToStage(targetStage);
        });

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            let targetStage = null;
            
            // 通常の数字キー (0-9)
            if (e.key >= '0' && e.key <= '9' && !e.shiftKey && !e.ctrlKey) {
                targetStage = parseInt(e.key);
            }
            // Shift + 数字キー (11-19)
            else if (e.key >= '1' && e.key <= '9' && e.shiftKey && !e.ctrlKey) {
                targetStage = parseInt(e.key) + 10;
            }
            // Ctrl + 数字キー (21-29)
            else if (e.key >= '1' && e.key <= '9' && !e.shiftKey && e.ctrlKey) {
                targetStage = parseInt(e.key) + 20;
            }

            if (targetStage !== null && targetStage <= 25) {
                this.forceJumpToStage(targetStage);
            }
        });
    },

    // 強制的にステージを移動する関数
    forceJumpToStage(stageNumber) {
        if (stageNumber >= 0 && stageNumber <= 25) {
            // ゲームの状態をリセット
            selectedBeats.clear();
            isLoopComplete = false;
            currentStage = stageNumber;
            
            // 前のステージをクリア済みに
            clearedStages = new Set();
            for (let i = 0; i < stageNumber; i++) {
                clearedStages.add(i);
            }

            // UI更新
            updateStageContent();
            console.log(`デバッグ: ステージ${stageNumber}に移動しました`);
        }
    }
};

// ステージ更新時にセレクトボックスも更新
const originalUpdateStageContent = updateStageContent;
updateStageContent = function() {
    originalUpdateStageContent();
    const stageSelect = document.getElementById('stageSelect');
    if (stageSelect) {
        stageSelect.value = currentStage;
    }
};

//====================================================
// 初期化
//====================================================
function initialize() {
    updateStageContent();
    updateProgress();
    requestAnimationFrame(update);
    debugTools.initialize(); // 追加
}

// 初期化実行
initialize();