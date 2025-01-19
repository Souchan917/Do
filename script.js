
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
const BPM = 170;
const BEATS_PER_SECOND = BPM / 60;
const BEAT_INTERVAL = 60 / BPM; // 1拍の長さ（秒）
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
    SEGMENT: 'segment',
    DYNAMIC_TEXT: 'dynamic_text',
    WALL_IMAGE: 'wall_image',
    DOT_COUNTER: 'dot_counter',
    DYNAMIC_TEXT_GROUP: 'dynamic_text_group',
    RHYTHM_DOTS: 'rhythm_dots',
    NUMBER_TEXT: 'number_text',
    CLICK_COUNTER: 'click_counter'  // 新しく追加
};
// クリック回数を追跡する変数を追加
const clickCounts = {
    play: 0,
    prev: 0,
    next: 0,
    progress: 0,
    getTotal() {
        return this.play + this.prev + this.next + this.progress;
    }
};

const STAGE_CONFIGS = {
    0: {
        gimmicks: [
        ]
    },
    1: {
        gimmicks: [

        ]
    },
    2: {
        gimmicks: [

        ]
    },
    3: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.DYNAMIC_TEXT_GROUP,  // 新しいタイプを作成
                settings: {
                    x: 50,  // 中央に配置
                    y: 55,
                    size: 100,
                    spacing: 15,  // 文字間のスペース
                    characters: [
                        { dotIndex: 0, defaultChar: 'ホ', selectedChar: 'ブ' },
                        { dotIndex: 1, defaultChar: 'ワ', selectedChar: 'ラ' },
                        { dotIndex: 2, defaultChar: 'イ', selectedChar: 'ッ' },
                        { dotIndex: 3, defaultChar: 'ト', selectedChar: 'ク' }
                    ]
                }
            }
        ]
    },
    4: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.RHYTHM_DOTS,
                settings: {
                    x: 50,      // 全体の中心X座標
                    y: 50,      // 全体の中心Y座標
                    size: 400,  // 全体のサイズ
                    dots: [
                        { x: 20, y: 20, size: 30, beat: 1 },  // 左上
                        { x: 80, y: 20, size: 30, beat: 2 },  // 右上
                        { x: 20, y: 40, size: 30, beat: 3 },  // 左から2番目
                        { x: 80, y: 40, size: 30, beat: 4 },  // 右から2番目
                        { x: 20, y: 60, size: 30, beat: 5 },  // 左から3番目
                        { x: 80, y: 60, size: 30, beat: 6 },  // 右から3番目
                        { x: 20, y: 80, size: 30, beat: 7 },  // 左下
                        { x: 80, y: 80, size: 30, beat: 8 }   // 右下
                        
                    ]
                }
            }
        ]
    },
    5: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.NUMBER_TEXT,
                settings: {
                    x: 50,      // 全体の中心X座標
                    y: 53,      // 全体の中心Y座標
                    size: 190,  // 全体のサイズを大きく
                    spacing: 5,  // 文字間のスペース
                    words: [
                        {
                            text: "Z--#",
                            x: 50,
                            y: -45,
                            specialChar: { index: 3, default: "O", selected: "I" }
                        },
                        {
                            text: "#N-",
                            x: 50,
                            y: -25,
                            specialChar: { index: 0, default: "O", selected: "I" }
                        },
                        {
                            text: "-W#",
                            x: 50,
                            y: -5,
                            specialChar: { index: 2, default: "O", selected: "I" }
                        },

                        {
                            text: "-#U-",
                            x: 50,
                            y: 35,
                            specialChar: { index: 1, default: "O", selected: "I" }
                        },
                        {
                            text: "-#V-",
                            x: 50,
                            y: 55,
                            specialChar: { index: 1, default: "O", selected: "I" }
                        },
                        {
                            text: "S#X",
                            x: 50,
                            y: 75,
                            specialChar: { index: 1, default: "O", selected: "I" }
                        },

                        {
                            text: "-#G--",
                            x: 50,
                            y: 115,
                            specialChar: { index: 1, default: "O", selected: "I" }
                        },
                        {
                            text: "N#N-",
                            x: 50,
                            y: 135,
                            specialChar: { index: 1, default: "O", selected: "I" }
                        },
                        {
                            text: "-----",  // 変更なしのテキスト
                            x: 50,
                            y: 15
                        },
                        {
                            text: "S-V-N",  // 変更なしのテキスト
                            x: 50,
                            y: 95
                        },
                    ]
                }
            }
        ]
    },
    6: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.DOT_COUNTER,
                settings: {
                    x: 30,
                    y: 20,
                    size: 90,
                    startBeat: 1,
                    endBeat: 4,
                    baseNumber: '1',
                    requiredCount: 2  // 前半は2回必要
                }
            },
            {
                type: GIMMICK_TYPES.DOT_COUNTER,
                settings: {
                    x: 70,
                    y: 20,
                    size: 90,
                    startBeat: 5,
                    endBeat: 8,
                    baseNumber: '1',
                    requiredCount: 3  // 後半は3回必要
                }
            }
        ]
    },
    7: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.RHYTHM_DOTS,
                settings: {
                    x: 50,      // 全体の中心X座標
                    y: 50,      // 全体の中心Y座標
                    size: 400,  // 全体のサイズ
                    dots: [
                        { x: 40, y: 10, size: 30, beat: 2 },  // 左上
                        { x: 60, y: 10, size: 30, beat: 7 },  // 右上
                        { x: 90, y: 40, size: 30, beat: 3 },  // 左から2番目
                        { x: 90, y: 60, size: 30, beat: 4 },  // 右から2番目
                        { x: 60, y: 90, size: 30, beat: 8 },  // 左から3番目
                        { x: 40, y: 90, size: 30, beat: 1 },
                        { x: 10, y: 60, size: 30, beat: 5 },   // 右から3番目
                        { x: 10, y: 40, size: 30, beat: 6 }  // 左下
                          // 右下
                        
                    ]
                }
            }
        ]
    },
    8: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.IMAGE_SEQUENCE,
                settings: {
                    x: 20,
                    y: 50,
                    size: 80,
                    images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage8/moon${i}.png`),
                    changeInterval: 60 * 4 / 170 / 4
                }
            }
        ]
    },
    9: {
        gimmicks: [

        ]
    },
    10: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.IMAGE_SEQUENCE,
                settings: {
                    x: 50,
                    y: 50,
                    size: 30,
                    images: Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage10/black${i}.png`),
                    changeInterval: 60 * 4 / 170 / 4
                }
            }
        ]
    },
    11: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.WALL_IMAGE,
                settings: {
                    x: 50,
                    y: 50,
                    size: 100,  // 100%のサイズで表示
                    images: Array.from({ length: 16 }, (_, i) => `assets/images/puzzles/wall/wall${i}.png`)
                }
            }
        ]
    },
    12: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.WALL_IMAGE,
                settings: {
                    x: 50,
                    y: 50,
                    size: 100,  // 100%のサイズで表示
                    images: Array.from({ length: 16 }, (_, i) => `assets/images/puzzles/wall/wall${i}.png`)
                }
            }
        ]
    },
    13: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.WALL_IMAGE,
                settings: {
                    x: 50,
                    y: 50,
                    size: 100,  // 100%のサイズで表示
                    images: Array.from({ length: 16 }, (_, i) => `assets/images/puzzles/wall/wall${i}.png`)
                }
            }
        ]
    },
    14: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.RHYTHM_DOTS,
                settings: {
                    x: 50,      // 全体の中心X座標
                    y: 50,      // 全体の中心Y座標
                    size: 400,  // 全体のサイズ
                    dots: [
                        { x: 50, y: 35, size: 25, beat: 1 },  // 左上
                        { x: 73, y: 35, size: 25, beat: 2 },  // 右上
                        { x: 40, y: 85, size: 25, beat: 3 },  // 左から2番目
                        { x: 39, y: 35, size: 25, beat: 4 },  // 右から2番目
                        { x: 61.5, y: 35, size: 25, beat: 5 },  // 左から3番目
                        { x: 84, y: 35, size: 25, beat: 6 },  // 右から3番目
                        { x: 50, y: 85, size: 25, beat: 7 },  // 左下
                        { x: 60, y: 85, size: 25, beat: 8 }   // 右下
                    ]
                }
            }
        ]
    },

    15: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.RHYTHM_DOTS,
                settings: {
                    x: 50,      
                    y: 50,      
                    size: 400,  
                    dots: [
                        // beat: どの拍に属するか
                        { x: 50, y: 53, size: 30, beat: 1 }, 
                        { x: 58, y: 12, size: 30, beat: 1 },  // 1拍目のドット
                        
                        // 2拍目の3つのドット
                        { x: 40, y: 12, size: 30, beat: 2 },
                        { x: 41, y: 26, size: 30, beat: 2 },
                        { x: 51.5, y: 89, size: 30, beat: 2 },
                        
                        { x: 40, y: 53, size: 30, beat: 3 },  // 3拍目のドット

                        { x: 90, y: 40, size: 30, beat: 4 },
                        { x: 90, y: 50, size: 30, beat: 5 },
                        { x: 90, y: 60, size: 30, beat: 6 },

                        { x: 60, y: 26, size: 30, beat: 7 },  // 4拍目のドット
                    ]
                }
            }
        ]
    },
    16: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.CLICK_COUNTER,
                settings: {
                    x: 30,
                    y: 70,
                    size: 80
                }
            },

        ]
    },
    17: {
        gimmicks: [
            {
                type: GIMMICK_TYPES.CLICK_COUNTER,
                settings: {
                    x: 30,
                    y: 30,
                    size: 80
                }
            },
            {
                type: GIMMICK_TYPES.RECORDS_DISPLAY,
                settings: {
                    x: 50,
                    y: 60,
                    size: 150
                }
            },
        ]
    },
    
};

const STAGE_NAMES = [
    "チュートリアル",
    "Do", "イコールの下が答えだ！", "輝き",
    "選択", "0or1", "数式",
    "道しるべ(きまぐれ)", "夜空", "おいしそう！",
    "チカチカ", "問題を成立させよう！", "西？",
    "九？", "一週間", "楽器の名前をこたえよう",
    "最終ステージ", "エンディング-おめでとう！"
];

const PUZZLE_IMAGES = {
    0: "assets/images/puzzles/puzzle0.png",
    1: "assets/images/puzzles/puzzle1.png",
    2: "assets/images/puzzles/puzzle2.png",
    3: "assets/images/puzzles/puzzle999.png",
    4: "assets/images/puzzles/puzzle4.png",
    5: "assets/images/puzzles/puzzle999.png",
    6: "assets/images/puzzles/puzzle6.png",
    7: "assets/images/puzzles/puzzle7.png",
    8: "assets/images/puzzles/stage8/puzzlemoon.png",
    9: "assets/images/puzzles/puzzle9.png",
    10: "assets/images/puzzles/puzzle999.png",
    11: "assets/images/puzzles/puzzle11.png",
    12: "assets/images/puzzles/puzzle12.png",
    13: "assets/images/puzzles/puzzle13.png",
    14: "assets/images/puzzles/puzzle14.png",
    15: "assets/images/puzzles/puzzle15.png",
    16: "assets/images/puzzles/puzzle16.png",
    17: "assets/images/puzzles/puzzle17.png"
};

// ヒントシステム
const STAGE_HINTS = {
    0: "音楽のリズムに合わせて点が動きます。特に何もしなくても大丈夫です。",
    1: "黒黒白黒の順番で丸が表示されています。あなたができることはボタンを押すことのみです。試しに何度か次へボタンを押してみましょう",
    2: "停止ボタンをイコールだとすれば、答えは「テイル」です。「ステージタイトル」という文字の中に「テイル」が存在しています",
    3: "全てのボタンを押すと「ブラック」となります。「ホワイト」「ブラック」この文字から「ブライト」を作りましょう",
    4: "8つの点が順番に光ります。イラスト「せみ」「きん」「たい」「くり」です。「せんたく」になるようにどちらか片方ずつ選びましょう",
    5: "10個の要素がありますが、これは数字の「ZERO」から「NINE」を表しています。ボタンを押すと#が「O」か「I」になります。",
    6: "左側について「/」と縦書きの「一日」を合わせるととある漢数字になります。",
    7: "すべて光らせると「なぼとういざくん」となります。",
    8: "月が満ち欠けしていきます。「つきみ」にするには、真ん中が「み？づき」になります。",
    9: "上部は「一富士二鷹三茄子」を表しています。下部の食べ物にまつわる「慣用句」思い出してみましょう。",
    10: "「黒黒・黒・・黒・」で点滅しています",
    11: "ボタンを押すと、16分割されたタイルが現れます。上部は「点が10個で酉(とり)」中部は「点が12個で亥(い)」を表しています。1か所消す必要があります。",
    12: "例示は九九の「にしがはち」「さざんがく」を表しています。3か所消す必要があります。",
    13: "例示は「点の個数」になるように調節しましょう。7か所消す必要があります。",
    14: "1拍目は「水」、2拍目は「金」、4拍目は「火」5拍目は「木」を表しています。順序に注目してみましょう",
    15: "7色のバーがあります。それぞれの色と文字数を考えると、上から2番目は「オレンジ」4番目は「ミドリ」が当てはまります。点が反応する順序に注目してみましょう",
    16: "クリック回数を100回以内に抑える必要があります。効率的な選び方を考えましょう。"
};

let loopCount = 0;
let hintShown = false;

const STAGE_ANSWERS = {
    0: "ーーー",
    1: "ーーー",
    2: "テイル",
    3: "ブライト",
    4: "せんたく",
    5: "ーーー",
    6: "十",
    7: "ぼういん",
    8: "つきみ",
    9: "ーーー",
    10: "ーーー",
    11: "午(うま)",
    12: "インク",
    13: "七",
    14: "てんかい",
    15: "？？？",
    16: "がんばれ～",
    17: "プレイありがとうございます。"
};
// Twitter共有用の関数を更新
function shareToTwitter() {
    const text = encodeURIComponent('「Do」をクリアした！\n#Do謎 #Player謎');
    const url = encodeURIComponent('https://twitter.com/Souchan917/status/1880596843299737622');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

// エンディング画面の更新関数を修正
function updateProblemElements() {
    if (currentStage === 17) {
        // エンディング画面用の特別なレイアウト
        problemArea.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 10px;
                padding: 20px;
            ">
                <p style="
                    color: #333;
                    font-size: 16px;
                    margin-bottom: 20px;
                    font-family: 'M PLUS Rounded 1c', sans-serif;
                ">総クリック回数: ${clickCounts.getTotal()}回</p>
                
                <div style="
                    font-size: 48px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 30px;
                    font-family: 'M PLUS Rounded 1c', sans-serif;
                ">CLEAR</div>
            </div>
        `;

        // answer-area を更新
        const answerArea = document.querySelector('.answer-area');
        if (answerArea) {
            answerArea.innerHTML = `
                <p style="margin-bottom: 20px;">クリアおめでとう！</p>
                <button 
                    onclick="shareToTwitter()"
                    style="
                        padding: 12px 24px;
                        background-color: #1DA1F2;
                        color: white;
                        border: none;
                        border-radius: 20px;
                        font-size: 16px;
                        cursor: pointer;
                        font-family: 'M PLUS Rounded 1c', sans-serif;
                        margin-top: 10px;
                        z-index: 1000;
                    "
                >
                    Xで共有
                </button>
            `;
        }
    } else {
        gimmickManager.updateGimmick(currentStage, currentTime);
        gimmickManager.hideAllExcept(currentStage);
    }
}

// answer-areaの更新関数も修正
function updateAnswer() {
    const answerArea = document.querySelector('.answer-area');
    if (!answerArea) return;
    
    answerArea.innerHTML = ''; // 一旦クリア

    const answerText = document.createElement('p');
    answerText.textContent = STAGE_ANSWERS[currentStage];
    answerArea.appendChild(answerText);
    
    // エンディング画面の場合
    if (currentStage === 17) {
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Xで共有';
        shareButton.onclick = shareToTwitter;
        shareButton.style.cssText = `
            padding: 12px 24px;
            background-color: #1DA1F2;
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 16px;
            cursor: pointer;
            font-family: 'M PLUS Rounded 1c', sans-serif;
            margin-top: 15px;
            z-index: 1000;
        `;
        
        answerArea.appendChild(shareButton);
    }
}

const stageSettings = {
    0: { dots: 4 },
    1: { dots: 4 },
    2: { dots: 8 },
    3: { dots: 4 },
    4: { dots: 8 },
    5: { dots: 8 },
    6: { dots: 8 },
    7: { dots: 8 },
    8: { dots: 8 },
    9: { dots: 16 },
    10: { dots: 8 },
    11: { dots: 16 },
    12: { dots: 16 },
    13: { dots: 16 },
    14: { dots: 8 },
    15: { dots: 8 },
    16: { dots: 4 },
    17: { dots: 8 }
};
const correctPatterns = {
    0: [1, 2, 3, 4],
    1: [1, 2, 4],
    2: [2, 6, 8],
    3: [1, 2],
    4: [1, 4, 5, 7],
    5: [5, 6, 7, 8],
    6: [4, 8, 12, 16],
    7: [2, 4, 5, 8],
    8: [1],
    9: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
    10: [1, 2, 4, 7],
    11: [13],
    12: [1, 5, 9],
    13: [1, 2, 3, 4, 5, 9, 13],
    14: [7, 8],
    15: [1, 6],
    16: [1, 2, 3, 4],
    17: [2, 4, 6, 8]
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
let isHolding = false;
let holdStartBeat = -1;
const audio = new Audio('assets/audio/MUSIC.mp3');
audio.volume = 0.7;

//====================================================
// ギミック管理クラス
//====================================================
class GimmickManager {
    constructor() {
        this.elements = new Map();
        this.activeWallImages = new Map();
    }

    createGimmickElement(stageId, gimmickIndex) {
        const config = STAGE_CONFIGS[stageId]?.gimmicks[gimmickIndex];
        if (!config) return null;

        const element = document.createElement('div');
        element.className = 'problem-element';
        element.id = `gimmick-${stageId}-${gimmickIndex}`;
        

        if (config.type === GIMMICK_TYPES.NUMBER_TEXT) {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.height = '100%';
            
            // 各単語用のコンテナを作成
            config.settings.words.forEach((word, wordIndex) => {
                const wordContainer = document.createElement('div');
                wordContainer.className = 'number-text-word';
                wordContainer.style.position = 'absolute';
                
                // 文字を1つずつ作成
                const chars = word.text.split('');
                chars.forEach((char, charIndex) => {
                    const charElement = document.createElement('span');
                    charElement.className = 'number-text-char';
                    // 特殊文字（#）は一時的に空白に
                    charElement.textContent = char === '#' ? '' : char;
                    wordContainer.appendChild(charElement);
                });
                
                container.appendChild(wordContainer);
            });
            
            element.appendChild(container);
        }
        if (config.type === GIMMICK_TYPES.IMAGE_SEQUENCE) {
            const img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            element.appendChild(img);
        }

        if (config.type === GIMMICK_TYPES.DOT_COUNTER) {
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            element.appendChild(container);
        }

        if (config.type === GIMMICK_TYPES.RHYTHM_DOTS) {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.width = '100%';
            container.style.height = '100%';
            
            // 各ドットの作成
            config.settings.dots.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'rhythm-dot-in-puzzle';
                dot.style.position = 'absolute';
                container.appendChild(dot);
            });
            
            element.appendChild(container);
        }

        problemArea.appendChild(element);
        this.elements.set(`${stageId}-${gimmickIndex}`, element);
        return element;
    }

    _countSelectedDotsInRange(start, end) {
        let count = 0;
        for (let i = start; i <= end; i++) {
            if (selectedBeats.has(i)) {
                count++;
            }
        }
        return count;
    }

    _generateDotCounterText(count, baseNumber) {
        return baseNumber + '0'.repeat(count);
    }

    _setupTextStyles(element, size) {
        element.style.fontSize = `${size * 0.5}px`;
        element.style.lineHeight = `${size}px`;
        element.style.textAlign = 'center';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.fontFamily = "'M PLUS Rounded 1c', sans-serif";
    }

    _updateTimerGimmick(element, currentTime) {
        element.textContent = formatTime(currentTime);
    }

    _updateHiraganaGimmick(element, config, currentTime) {
        const charIndex = Math.floor(currentTime / config.settings.changeInterval) % config.settings.characters.length;
        element.textContent = config.settings.characters[charIndex];
    }

    _updateImageSequenceGimmick(element, config, currentTime) {
        const img = element.querySelector('img');
        if (img) {
            const imageIndex = Math.floor(currentTime / config.settings.changeInterval) % config.settings.images.length;
            const imagePath = config.settings.images[imageIndex];
            if (img.src !== imagePath) {
                img.src = imagePath;
            }
        }
    }

    _updateWallImageGimmick(element, config) {
        selectedBeats.forEach(beatNumber => {
            if (!this.activeWallImages.has(beatNumber)) {
                const imageElement = document.createElement('img');
                imageElement.src = config.settings.images[beatNumber - 1];
                imageElement.style.position = 'absolute';
                imageElement.style.top = '0';
                imageElement.style.left = '0';
                imageElement.style.width = '100%';
                imageElement.style.height = '100%';
                imageElement.style.objectFit = 'cover';
                imageElement.style.zIndex = '1';
                element.appendChild(imageElement);
                this.activeWallImages.set(beatNumber, imageElement);
            }
        });

        if (isLoopComplete) {
            this.activeWallImages.forEach(img => img.remove());
            this.activeWallImages.clear();
        }
    }

    _updateDynamicTextGroupGimmick(element, config, size, scaleFactor) {
        const textSize = size * scaleFactor;
        const textGroupContainer = element;
        textGroupContainer.style.display = 'flex';
        textGroupContainer.style.flexDirection = 'row';
        textGroupContainer.style.justifyContent = 'center';
        textGroupContainer.style.alignItems = 'center';
        textGroupContainer.style.width = '100%';
        textGroupContainer.style.gap = `${config.settings.spacing}px`;

        config.settings.characters.forEach((char, charIndex) => {
            let charElement = textGroupContainer.children[charIndex];
            if (!charElement) {
                charElement = document.createElement('div');
                charElement.className = 'dynamic-text-char';
                textGroupContainer.appendChild(charElement);
            }

            const isSelected = selectedBeats.has(char.dotIndex + 1);
            charElement.textContent = isSelected ? char.selectedChar : char.defaultChar;
            charElement.style.fontSize = `${textSize * 0.6}px`;
        });
    }


    // _updateNumberTextGimmick関数を更新
_updateNumberTextGimmick(element, config, containerSize) {
    const scaleFactor = containerSize / 400;
    const fontSize = config.settings.size * 0.2 * scaleFactor;
    
    const container = element.querySelector('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.left = '0';
    container.style.top = '0';
    
    const words = element.querySelectorAll('.number-text-word');
    const currentBeat = Math.floor(currentBeatProgress) + 1;
    
    words.forEach((wordElement, wordIndex) => {
        const wordConfig = config.settings.words[wordIndex];
        
        wordElement.style.position = 'absolute';
        wordElement.style.left = `${wordConfig.x}%`;
        wordElement.style.top = `${wordConfig.y}%`;
        wordElement.style.transform = 'translate(-50%, -50%)';
        wordElement.style.width = 'auto';
        wordElement.style.whiteSpace = 'nowrap';
        
        // 文字のスタイルを設定
        const chars = wordElement.querySelectorAll('.number-text-char');
        chars.forEach((charElement, charIndex) => {
            charElement.style.fontSize = `${fontSize}px`;
            charElement.style.fontFamily = "'M PLUS Rounded 1c', sans-serif";
            charElement.style.display = 'inline-block';
            charElement.style.minWidth = `${fontSize}px`;
            charElement.style.textAlign = 'center';
            charElement.style.fontWeight = 'bold';
            
            // specialChar が設定されている場合のみ、ドットの影響を受ける
            if (wordConfig.specialChar && wordConfig.specialChar.index === charIndex) {
                // wordIndex + 1 が対応する拍番号
                const beatNumber = wordIndex + 1;
                
                if (beatNumber < currentBeat || (beatNumber === currentBeat && lastBeat === currentBeat)) {
                    // この拍が既に過ぎている場合
                    const wasSelected = selectedBeats.has(beatNumber);
                    charElement.textContent = wasSelected ? 
                        wordConfig.specialChar.selected : 
                        wordConfig.specialChar.default;
                } else {
                    // この拍がまだ来ていない、または現在進行中の場合
                    charElement.textContent = '#';
                }
            } else {
                // # でない普通の文字はそのまま表示
                const originalChar = wordConfig.text[charIndex];
                if (originalChar !== '#') {
                    charElement.textContent = originalChar;
                }
            }
        });
    });
}

    _updateDotCounterGimmick(element, config, size) {
        const counterContainer = element.querySelector('div');
        if (counterContainer) {
            const fontSize = size * 0.5;
            counterContainer.style.fontSize = `${fontSize}px`;
            counterContainer.style.color = '#333';
            counterContainer.style.lineHeight = '1';
            counterContainer.style.textAlign = 'center';
            counterContainer.style.fontFamily = "'M PLUS Rounded 1c', sans-serif";
            counterContainer.style.display = 'flex';
            counterContainer.style.justifyContent = 'center';
            counterContainer.style.alignItems = 'center';

            const dotCount = this._countSelectedDotsInRange(
                config.settings.startBeat,
                config.settings.endBeat
            );

            counterContainer.textContent = this._generateDotCounterText(
                dotCount,
                config.settings.baseNumber
            );
        }
    }
    
    _updateClickCounterGimmick(element, config, size) {
        const total = clickCounts.getTotal();
        element.style.fontSize = `${size * 0.3}px`;
        element.style.fontFamily = "'M PLUS Rounded 1c', sans-serif";
        element.style.textAlign = 'center';
        element.style.color = '#333';
        element.style.whiteSpace = 'nowrap';  // 追加：改行を防ぐ
        element.textContent = `総クリック回数: ${total}回`;  // brタグを削除し、区切りをコロンに
    }
    _updateRhythmDotsGimmick(element, config, containerSize) {
        const dots = element.querySelectorAll('.rhythm-dot-in-puzzle');
        const scaleFactor = containerSize / 400;
        const currentBeat = Math.floor(currentBeatProgress) + 1;
    
        const container = element.querySelector('div');
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
    
        dots.forEach((dot, index) => {
            const dotConfig = config.settings.dots[index];
            const beatNumber = dotConfig.beat;  // 配列のインデックスではなく、beatプロパティを使用
    
            const scaledSize = (dotConfig.size || 20) * scaleFactor;
            dot.style.width = `${scaledSize}px`;
            dot.style.height = `${scaledSize}px`;
            dot.style.left = `${dotConfig.x}%`;
            dot.style.top = `${dotConfig.y}%`;
            dot.style.transform = 'translate(-50%, -50%)';
    
            // 見た目の設定
            dot.style.backgroundColor = selectedBeats.has(beatNumber) ? '#000000' : '#FFFFFF';
            dot.style.borderRadius = '50%';
            dot.style.opacity = '0.8';
            dot.style.transition = 'all 0.1s ease';
            dot.style.border = '2px solid #333';
    
            // 現在のビートのドットをハイライト
            if (beatNumber === currentBeat) {
                dot.style.transform = 'translate(-50%, -50%) scale(1.2)';
                dot.style.opacity = '1';
            } else {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    }

    updateGimmick(stageId) {
        const config = STAGE_CONFIGS[stageId];
        if (!config) return;

        config.gimmicks.forEach((gimmickConfig, index) => {
            let element = this.elements.get(`${stageId}-${index}`);
            if (!element) {
                element = this.createGimmickElement(stageId, index);
            }

            const containerSize = Math.min(problemArea.clientWidth, problemArea.clientHeight);
            const scaleFactor = containerSize / 400;
            const size = gimmickConfig.settings.size * scaleFactor;

            // 基本的なスタイル設定
            if (gimmickConfig.type !== GIMMICK_TYPES.WALL_IMAGE) {
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.left = `${gimmickConfig.settings.x}%`;
                element.style.top = `${gimmickConfig.settings.y}%`;
                element.style.transform = 'translate(-50%, -50%)';
            } else {
                element.style.width = '100%';
                element.style.height = '100%';
                element.style.left = '0';
                element.style.top = '0';
                element.style.transform = 'none';
            }

            // タイマーとひらがなのスタイル設定
            if (gimmickConfig.type === GIMMICK_TYPES.TIMER || 
                gimmickConfig.type === GIMMICK_TYPES.HIRAGANA) {
                this._setupTextStyles(element, size);
            }

            // 各ギミックタイプの更新処理
            switch (gimmickConfig.type) {
                case GIMMICK_TYPES.TIMER:
                    this._updateTimerGimmick(element, currentTime);
                    break;

                case GIMMICK_TYPES.HIRAGANA:
                    this._updateHiraganaGimmick(element, gimmickConfig, currentTime);
                    break;

                case GIMMICK_TYPES.IMAGE_SEQUENCE:
                    this._updateImageSequenceGimmick(element, gimmickConfig, currentTime);
                    break;

                case GIMMICK_TYPES.WALL_IMAGE:
                    this._updateWallImageGimmick(element, gimmickConfig);
                    break;

                case GIMMICK_TYPES.DYNAMIC_TEXT_GROUP:
                    this._updateDynamicTextGroupGimmick(element, gimmickConfig, size, scaleFactor);
                    break;

                case GIMMICK_TYPES.DOT_COUNTER:
                    this._updateDotCounterGimmick(element, gimmickConfig, size);
                    break;

                case GIMMICK_TYPES.RHYTHM_DOTS:
                    this._updateRhythmDotsGimmick(element, gimmickConfig, containerSize);
                    break;

                case GIMMICK_TYPES.SEGMENT:
                    // セグメント表示の実装（必要に応じて）
                    break;

                case GIMMICK_TYPES.NUMBER_TEXT:
                    this._updateNumberTextGimmick(element, gimmickConfig, containerSize);
                    break;

                case GIMMICK_TYPES.CLICK_COUNTER:
                    this._updateClickCounterGimmick(element, gimmickConfig, size);
                    break;
            }
        });
    }

    hideAllExcept(currentStageId) {
        this.elements.forEach((element, key) => {
            const [stageId] = key.split('-');
            element.style.display = parseInt(stageId) === currentStageId ? 'block' : 'none';
        });
    }

    reset() {
        this.activeWallImages.forEach(img => img.remove());
        this.activeWallImages.clear();
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
        
        // クリア済みステージの場合、正解のドットを selected 状態で表示
        if (clearedStages.has(currentStage)) {
            const beatNumber = i + 1;
            if (correctPatterns[currentStage].includes(beatNumber)) {
                dot.classList.add('selected');
            }
        }
        
        dotsContainer.appendChild(dot);
    }
}

function updateRhythmDots() {
    if (!isPlaying && !clearedStages.has(currentStage)) return;

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
        const isCorrectBeat = clearedStages.has(currentStage) && 
            correctPatterns[currentStage].includes(beatNumber);

        // クリア済みステージの場合、正解のドットを常に selected 状態に
        if (isCorrectBeat) {
            dot.classList.add('selected');
        } else {
            dot.classList.toggle('active', isCurrentBeat);
            dot.classList.toggle('selected', isSelected);
        }
    });
}

function checkRhythmPattern() {
    // ステージ6の特殊判定
    if (currentStage === 6) {
        // 前半と後半のドット数をカウント
        let firstHalfCount = 0;
        let secondHalfCount = 0;
        
        // 前半（1-4拍）のカウント
        for (let i = 1; i <= 4; i++) {
            if (selectedBeats.has(i)) {
                firstHalfCount++;
            }
        }
        
        // 後半（5-8拍）のカウント
        for (let i = 5; i <= 8; i++) {
            if (selectedBeats.has(i)) {
                secondHalfCount++;
            }
        }

        // 正解判定: 前半が2回、後半が3回
        if (firstHalfCount === 2 && secondHalfCount === 3) {
            clearedStages.add(currentStage);
            currentStage++;
            updateStageContent();
        }
        
        selectedBeats.clear();
        return;
    }

    if (currentStage === 16) {
        const pattern = correctPatterns[currentStage];
        if (!pattern || selectedBeats.size !== pattern.length) {
            selectedBeats.clear();
            return;
        }

        const allBeatsCorrect = pattern.every(beat => selectedBeats.has(beat));
        if (allBeatsCorrect) {
            // クリック回数が100回以下かチェック
            if (clickCounts.getTotal() <= 100) {
                clearedStages.add(currentStage);
                currentStage++;
                updateStageContent();
            } else {
                // クリック回数が100を超えた場合、リセットボタンを表示
                const resetContainer = document.getElementById('resetContainer');
                if (resetContainer) {
                    resetContainer.classList.add('show');
                }
            }
        }
        selectedBeats.clear();
        return;
    }

    // 通常ステージの判定
    const pattern = correctPatterns[currentStage];
    if (!pattern || selectedBeats.size !== pattern.length) {
        selectedBeats.clear();
        return;
    }

    const allBeatsCorrect = pattern.every(beat => selectedBeats.has(beat));
    if (allBeatsCorrect) {
        clearedStages.add(currentStage);
        currentStage++;
        updateStageContent();
    }
    
    selectedBeats.clear();
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
    clickCounts.play++;
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
    clickCounts.prev++;
    if (currentStage > 0) {
        currentStage--;
        updateStageContent();
    }
});

nextButton.addEventListener('click', () => {
    clickCounts.next++;
    if (currentStage === 17) return;

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
// アセットのプリロード機能を追加
class AssetLoader {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.loadingText = document.createElement('div');
        this.setupLoadingUI();
    }

    setupLoadingUI() {
        this.loadingText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 18px;
            font-family: 'M PLUS Rounded 1c', sans-serif;
            text-align: center;
            z-index: 10000;
        `;
        document.body.appendChild(this.loadingText);
    }

    updateLoadingProgress() {
        const percentage = Math.floor((this.loadedAssets / this.totalAssets) * 100);
        this.loadingText.textContent = `Loading... ${percentage}%`;
    }

    async loadAll() {
        // 画像のリストを作成
        const imageList = [
            ...Object.values(PUZZLE_IMAGES),
            'assets/images/controls/play.png',
            'assets/images/controls/pause.png',
            'assets/images/controls/prev.png',
            'assets/images/controls/next.png'
        ];

        // Stage 7の星の画像
        for (let i = 0; i < 8; i++) {
            imageList.push(`assets/images/puzzles/stage8/moon${i}.png`);
        }

        // Stage 8の月の画像
        for (let i = 0; i < 8; i++) {
            imageList.push(`assets/images/puzzles/stage8/moon${i}.png`);
        }

        // Wall画像
        for (let i = 0; i < 16; i++) {
            imageList.push(`assets/images/puzzles/wall/wall${i}.png`);
        }

        this.totalAssets = imageList.length + 1; // +1 for audio
        this.loadedAssets = 0;

        // 画像のプリロード
        const imagePromises = imageList.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.loadedAssets++;
                    this.updateLoadingProgress();
                    resolve();
                };
                img.onerror = reject;
                img.src = src;
            });
        });

        // オーディオのプリロード
        const audioPromise = new Promise((resolve, reject) => {
            const tempAudio = new Audio('assets/audio/MUSIC.mp3');
            tempAudio.addEventListener('canplaythrough', () => {
                this.loadedAssets++;
                this.updateLoadingProgress();
                resolve();
            }, { once: true });
            tempAudio.addEventListener('error', reject);
            tempAudio.load();
        });

        try {
            await Promise.all([...imagePromises, audioPromise]);
            this.loadingText.remove();
            return true;
        } catch (error) {
            console.error('Asset loading failed:', error);
            this.loadingText.textContent = 'Loading failed. Please refresh the page.';
            return false;
        }
    }
}

// ヒントが表示されるまでのループ回数を定義
const STAGE_HINT_LOOPS = {
    0: 999,  // チュートリアルはヒント非表示
    1: 10,   // 比較的簡単なステージは早めに表示
    2: 15,
    3: 30,
    4: 15,
    5: 15,
    6: 15,
    7: 15,
    8: 15,
    9: 9,
    10: 15,
    11: 15,
    12: 15,
    13: 15,
    14: 15,
    15: 15,
    16: 999,  // 最終ステージは非表示
    17: 999   // エンディングは非表示
};

// ヒントモーダルで表示する答えのテキスト
const HINT_ANSWERS = {
    0: "チュートリアルステージです",
    1: "黒黒・黒",
    2: "・黒・・・黒・黒",
    3: "黒黒・・",
    4: "黒・・黒黒・黒・",
    5: "・・・・黒黒黒黒",
    6: "黒黒・・黒黒黒・",
    7: "・黒・黒黒・・黒",
    8: "黒・・・・・・・",
    9: "黒黒黒・黒黒黒・黒黒黒黒黒黒黒黒",
    10: "黒黒・黒・・黒・",
    11: "・・・・・・・・・・・・黒・・・\n（点の個数を干支にする）",
    12: "黒・・・黒・・・黒・・・・・・・\n（九九/ニシガハチ、サザンガク、インクガク）",
    13: "黒黒黒黒黒・・・黒・・・黒・・・\n（点の個数/西の漢字の上部分を隠すと四という漢字になる）",
    14: "・・・・・・黒黒\n（8拍は、水金地火木土天海を表す）",
    15: "黒・・・・黒・・\n（8拍は、ドレミファソラシ・を表す）",
    16: "総クリック回数を100回以内に抑えてください。",
    17: "おめでとうございます！"
};

// ヒントシステムの初期化
function initializeHintSystem() {
    const hintButton = document.getElementById('hintButton');
    const hintModal = document.getElementById('hintModal');
    const stageLoopCounts = {};  // ステージごとのループカウント

    // ヒントボタンの表示/非表示を制御
    function updateHintButtonVisibility() {
        // チュートリアル、最終ステージ、エンディングでは非表示
        if (currentStage === 0 || currentStage >= 16) {
            hintButton.classList.add('hidden');
            return;
        }

        // 現在のステージのループカウントを取得
        stageLoopCounts[currentStage] = stageLoopCounts[currentStage] || 0;

        // ループ完了時にカウントを増やす
        if (isLoopComplete) {
            stageLoopCounts[currentStage]++;
        }

        // 必要なループ回数に達したらヒントボタンを表示
        const requiredLoops = STAGE_HINT_LOOPS[currentStage] || 12;
        if (stageLoopCounts[currentStage] >= requiredLoops && !clearedStages.has(currentStage)) {
            hintButton.classList.remove('hidden');
        } else {
            hintButton.classList.add('hidden');
        }
    }

    // ヒントモーダルを表示
    function showHintModal() {
        const hint = STAGE_HINTS[currentStage];
        const answer = HINT_ANSWERS[currentStage];
        
        if (hint) {
            // モーダルの内容を生成
            hintModal.innerHTML = `
                <div class="hint-content">
                    <h3>ヒント</h3>
                    <p>${hint}</p>
                    <div class="hint-answer" id="hintAnswer">${answer}</div>
                    <div class="hint-buttons">
                        <button class="hint-show-answer hint-button-base" id="showAnswerButton">
                            答えを見る
                        </button>
                        <button class="hint-close hint-button-base">
                            閉じる
                        </button>
                    </div>
                </div>
            `;

            // イベントリスナーを設定
            setupModalEventListeners();

            // モーダルを表示
            hintModal.classList.add('show');
        }
    }

    // モーダルのイベントリスナーを設定
    function setupModalEventListeners() {
        const closeButton = hintModal.querySelector('.hint-close');
        const showAnswerButton = document.getElementById('showAnswerButton');
        const answerElement = document.getElementById('hintAnswer');

        closeButton.addEventListener('click', hideHintModal);
        
        showAnswerButton.addEventListener('click', () => {
            answerElement.classList.add('show');
            showAnswerButton.style.opacity = '0.5';
            showAnswerButton.disabled = true;
        });

        // モーダル外クリックで閉じる
        hintModal.addEventListener('click', (e) => {
            if (e.target === hintModal) {
                hideHintModal();
            }
        });
    }

    // ヒントモーダルを非表示
    function hideHintModal() {
        hintModal.classList.remove('show');
    }

    // ヒントボタンのクリックイベント
    hintButton.addEventListener('click', showHintModal);

    // ステージ変更時の処理をオーバーライド
    const originalUpdateStageContent = window.updateStageContent;
    window.updateStageContent = function() {
        originalUpdateStageContent.apply(this, arguments);
        if (!stageLoopCounts[currentStage]) {
            stageLoopCounts[currentStage] = 0;
        }
        updateHintButtonVisibility();
    };

    // リズムパターンチェック後の処理をオーバーライド
    const originalCheckRhythmPattern = window.checkRhythmPattern;
    window.checkRhythmPattern = function() {
        originalCheckRhythmPattern.apply(this, arguments);
        updateHintButtonVisibility();
    };

    // 音楽ループ完了時の処理をオーバーライド
    const originalUpdateRhythmDots = window.updateRhythmDots;
    window.updateRhythmDots = function() {
        originalUpdateRhythmDots.apply(this, arguments);
        if (isLoopComplete) {
            updateHintButtonVisibility();
        }
    };

    // 初期状態のセットアップ
    updateHintButtonVisibility();
}

// initialize関数に組み込む
const originalInitialize = initialize;
initialize = async function() {
    await originalInitialize.apply(this, arguments);
    initializeHintSystem();
};


// 初期化関数を修正
async function initialize() {
    // モーダルの制御
    const modal = document.getElementById('startModal');
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.container');
    
    // 最初は全て非表示
    modal.style.visibility = 'hidden';
    container.style.visibility = 'hidden';

    // アセットのロード
    const loader = new AssetLoader();
    const loadSuccess = await loader.loadAll();

    if (!loadSuccess) {
        return; // ロード失敗時は初期化中止
    }

    // ロード完了後にモーダルを表示
    modal.style.visibility = 'visible';
    
    // ゲーム開始を遅延させる
    const startGame = () => {
        modal.style.display = 'none';
        container.style.visibility = 'visible';
        updateStageContent();
        updateProgress();
        requestAnimationFrame(update);
        debugTools.initialize();
    };

    // OKボタンのクリックイベント
    startButton.addEventListener('click', startGame);
}

// 初期化実行
initialize();