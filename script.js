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
const TOTAL_DURATION = 283; // 4:42 in seconds


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
    CLICK_COUNTER: 'click_counter',  // 新しく追加
    LYRICS: 'lyrics'
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
                    size: 150,
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

// --- Stage 5 を歌詞表示に差し替え（シンプル実装・他ステージへ非影響）---
STAGE_CONFIGS[20] = {
    gimmicks: [
        {
            type: GIMMICK_TYPES.LYRICS,
            settings: {
                // 位置・サイズ（自由に調整可）
                x: 50,
                y: 50,
                size: 350,
                // スタイル（自由に調整可）
                fontSize: 33,
                lineHeight: 1.3,
                color: '#111',
                align: 'center',
                // 表示モード: 1行ずつのみ表示
                displayMode: 'current',
                // タイミング（仮）。時間未指定のときは autoStep で順番に表示
                autoStartAt: 0,
                autoStep: 2.5,
                lineDuration: 2.5,
                // 歌詞（仮・すべて時間指定、約5分想定）
                lines: [
                    { text: "~♪", start: 0.0, end: 17.2 },
                    { text: "(Don't fight it)", start: 17.2, end: 18.7 },
                    { text: "(Don't fight it)", start: 18.7, end: 20.2 },
                    { text: "(Don't fight it)", start: 20.2, end: 21.5 },
                    { text: "(Don't fight it)", start: 21.5, end: 22.6 },
                    { text: "~♪", start: 22.6, end: 34.2 },
                    { text: "Don't fight it", start: 34.2, end: 35.6 },
                    { text: "Don't fight it", start: 35.6, end: 37.0 },
                    { text: "Don't fight it", start: 37.0, end: 38.4 },
                    { text: "(Don't fight it)", start: 38.4, end: 39.8 },
                    { text: "Don't fight it", start: 39.8, end: 41.2 },
                    { text: "Don't fight it", start: 41.2, end: 42.6 },
                    { text: "Don't fight it", start: 42.6, end: 44.0 },
                    { text: "(Don't fight it)", start: 44.0, end: 45.0 },
                    { text: "~♪", start: 45.0, end: 51.0 },
                    { text: "Don't fight it", start: 51.0, end: 52.2 },
                    { text: "Don't fight it", start: 52.2, end: 53.6 },
                    { text: "Don't fight it", start: 53.6, end: 55.0 },
                    { text: "(Don't fight it)", start: 55.0, end: 56.4 },
                    { text: "~♪", start: 56.4, end: 90.7 },
                    { text: "Don't fight it", start: 90.7, end: 92.1 },
                    { text: "Don't fight it", start: 92.1, end: 93.5 },
                    { text: "Don't fight it", start: 93.5, end: 94.9 },
                    { text: "(Don't fight it)", start: 94.9, end: 96.3 },
                    { text: "Don't fight it", start: 96.3, end: 97.7 },
                    { text: "Don't fight it", start: 97.7, end: 99.1 },
                    { text: "Don't fight it", start: 99.1, end: 100.5 },
                    { text: "(Don't fight it)", start: 100.5, end: 101.7 },
                    { text: "~♪", start: 101.7, end: 136.4 },
                    { text: "Just like you never broke my heart", start: 136.4, end: 139.4 },
                    { text: "Like you never said the words", start: 139.4, end: 142.0 },
                    { text: "Two worlds never further apart", start: 142.0, end: 144.6 },
                    { text: "Now go", start: 146.4, end: 147.6 },
                    { text: "And life will never be the same", start: 147.6, end: 150.6 },
                    { text: "But I will keep on finding my way", start: 150.6, end: 153.5 },
                    { text: "I'll move on to get to my brighter day", start: 153.5, end: 157.3 },
                    { text: "~♪", start: 157.3, end: 186.7 },
                    { text: "(Don't fight it)", start: 186.7, end: 188.2 },
                    { text: "(Don't fight it)", start: 188.2, end: 189.6 },
                    { text: "(Don't fight it)", start: 189.6, end: 190.7 },
                    { text: "~♪", start: 190.7, end: 215.3 },
                    { text: "Just like you never broke my heart", start: 215.4, end: 218.4 },
                    { text: "Like you never said the words", start: 218.4, end: 221.3 },
                    { text: "Two worlds never further apart", start: 221.3, end: 225.4 },
                    { text: "Now go", start: 225.4, end: 226.6 },
                    { text: "And I will never be the same", start: 226.6, end: 229.6 },
                    { text: "But I will keep on finding a way", start: 229.6, end: 232.5 },
                    { text: "I'll move on to get to a brighter day", start: 232.5, end: 237.5 },
                    { text: "Don't fight it", start: 237.5, end: 238.9 },
                    { text: "Don't fight it", start: 238.9, end: 240.3 },
                    { text: "Don't fight it", start: 240.3, end: 241.2 },
                    { text: "Like you never said the words", start: 241.2, end: 243.1 },
                    { text: "Don't fight it", start: 243.1, end: 244.5 },
                    { text: "Don't fight it", start: 244.5, end: 245.9 },
                    { text: "(Don't fight it)", start: 245.9, end: 247.3 },
                    { text: "Don't fight it", start: 247.3, end: 248.7 },
                    { text: "Don't fight it", start: 248.7, end: 250.1 },
                    { text: "Don't fight it", start: 250.1, end: 251.5 },
                    { text: "Don't fight it", start: 251.5, end: 252.5 },
                    { text: "Like you never said the words", start: 252.5, end: 254.3 },
                    { text: "Don't fight it", start: 254.3, end: 255.7 },
                    { text: "Don't fight it", start: 255.7, end: 256.4 },
                    { text: "I'll move on to get to a brighter day", start: 256.4, end: 259.9 },
                    { text: "Don't fight it", start: 259.9, end: 261.3 },
                    { text: "Don't fight it", start: 261.3, end: 262.7 },
                    { text: "Don't fight it", start: 262.7, end: 264.1 },
                    { text: "(Don't fight it)", start: 264.1, end: 266.1 },
                    { text: "Don't fight it", start: 266.1, end: 267.5 },
                    { text: "Don't fight it", start: 267.5, end: 268.9 },
                    { text: "Don't fight it", start: 268.9, end: 270.3 },
                    { text: "(Don't fight it)", start: 270.3, end: 271.4 },
                    { text: "Don't fight it", start: 271.4, end: 272.8 },
                    { text: "Don't fight it", start: 272.8, end: 274.2 },
                    { text: "Don't fight it", start: 274.2, end: 275.6 },
                    { text: "(Don't fight it)", start: 275.6, end: 277.0 },
                    { text: "Don't fight it", start: 277.0, end: 278.4 },
                    { text: "Don't fight it", start: 278.4, end: 279.8 },
                    { text: "Don't fight it", start: 279.8, end: 281.2 },
                    { text: "(Don't fight it)", start: 281.2, end: 282.4 },
                    { text: "~♪", start: 282.4, end: 300.0 }
                ]
            }
        }
    ]
};

const STAGE_NAMES = [
    "チュートリアル",
    "Do", "イコールの下が答えだ！", "輝き",
    "選択", "0or1", "数式",
    "道しるべ(きまぐれ)", "夜空", "おいしそう！",
    "チカチカ", "問題を成立させよう！", "西？",
    "九？", "一週間", "楽器の名前をこたえよう",
    "最終ステージ-がんばれ～", "エンディング-おめでとう！"
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
    12: "「西」や「サザン」は九九に登場するワードです。3か所消す必要があります。",
    13: "例示は「点の個数」になるように調節しましょう。7か所消す必要があります。「西」という漢字に注目",
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
    15: "？？",
    16: "",
    17: "THANK YOU FOR PLAYING"
};
// Twitter共有用の関数を更新
function shareToTwitter() {
    clickCounts.play++; // クリック回数を増やす
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
    6: [1, 2, 5, 6, 7],
    7: [2, 4, 5, 8],
    8: [2],
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
// シームレスループ用オーディオプレイヤー（Web Audio API）
//====================================================
class SeamlessLoopPlayer {
    constructor(url) {
        this.url = url;
        this.context = null;
        this.gainNode = null;
        this.buffer = null;
        this.source = null;
        this._volume = 0.7;
        this._isPlaying = false;
        this._startTime = 0;    // context currentTime at start
        this._offset = 0;       // seconds into buffer when stopped/paused
        this._loopStart = 0;
        this._loopEnd = 0;      // set after decode
        this._ready = null;     // Promise for decode
        this._prefetchedArrayBuffer = null; // AssetLoader から供給される ArrayBuffer を保持
    }

    get isReady() { return !!this.buffer; }

    async _ensureContext() {
        if (!this.context) {
            const AC = window.AudioContext || window.webkitAudioContext;
            this.context = new AC();
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = this._volume;
            this.gainNode.connect(this.context.destination);
        }
        if (this.context.state === 'suspended') {
            try { await this.context.resume(); } catch (_) {}
        }
    }

    async _load() {
        if (this._ready) return this._ready;
        this._ready = (async () => {
            let arrayBuf = this._prefetchedArrayBuffer;
            if (!arrayBuf) {
                const res = await fetch(this.url);
                arrayBuf = await res.arrayBuffer();
            }
            await this._ensureContext();
            const buffer = await this.context.decodeAudioData(arrayBuf.slice(0));
            this.buffer = buffer;
            const { loopStart, loopEnd } = SeamlessLoopPlayer._detectLoopPoints(buffer);
            this._loopStart = loopStart;
            this._loopEnd = loopEnd;
            this._prefetchedArrayBuffer = null; // 使い終わったら解放
        })();
        return this._ready;
    }

    // 事前にフェッチ済みの ArrayBuffer を提供（ユーザー操作後の初期化で使用）
    provideArrayBuffer(arrayBuffer) {
        if (arrayBuffer && arrayBuffer.byteLength > 0) {
            this._prefetchedArrayBuffer = arrayBuffer;
            // 既に別の _ready が走っている最中は触らない
        }
    }

    static _detectLoopPoints(buffer) {
        const sr = buffer.sampleRate;
        const ch = buffer.numberOfChannels;
        const len = buffer.length;
        const thresh = 0.0005;
        let first = 0;
        let last = len - 1;

        outerHead:
        for (let i = 0; i < len; i++) {
            for (let c = 0; c < ch; c++) {
                if (Math.abs(buffer.getChannelData(c)[i]) > thresh) { first = i; break outerHead; }
            }
        }
        outerTail:
        for (let i = len - 1; i >= 0; i--) {
            for (let c = 0; c < ch; c++) {
                if (Math.abs(buffer.getChannelData(c)[i]) > thresh) { last = i; break outerTail; }
            }
        }
        let loopStart = Math.max(0, (first / sr) - 0.001);
        let loopEnd = Math.min(buffer.duration, ((last + 1) / sr) + 0.001);
        if (!(loopEnd > loopStart + 0.01)) {
            loopStart = 0;
            loopEnd = buffer.duration;
        }
        return { loopStart, loopEnd };
    }

    _createSource(startOffsetSec) {
        if (!this.buffer) return;
        const src = this.context.createBufferSource();
        src.buffer = this.buffer;
        src.loop = true;
        src.loopStart = this._loopStart;
        src.loopEnd = this._loopEnd || this.buffer.duration;
        src.connect(this.gainNode);
        const offset = this._wrapToLoop(startOffsetSec);
        src.start(0, offset);
        this._startTime = this.context.currentTime - offset;
        this.source = src;
    }

    _wrapToLoop(sec) {
        const start = this._loopStart;
        const end = this._loopEnd || (this.buffer ? this.buffer.duration : 0);
        const span = Math.max(0.001, end - start);
        let rel = sec - start;
        rel = ((rel % span) + span) % span;
        return start + rel;
    }

    async play() {
        await this._ensureContext();
        await this._load();
        if (this._isPlaying) return;
        const v = this._volume;
        this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
        this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(v, this.context.currentTime + 0.03);
        this._createSource(this._offset);
        this._isPlaying = true;
    }

    pause() {
        if (!this._isPlaying) return;
        const now = this.context.currentTime;
        const t = now - this._startTime;
        const dur = this.duration;
        const rel = dur > 0 ? (t % dur) : 0;
        this._offset = this._loopStart + rel;
        try {
            this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.context.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.02);
        } catch (_) {}
        try { this.source && this.source.stop(); } catch (_) {}
        try { this.source && this.source.disconnect(); } catch (_) {}
        this.source = null;
        this._isPlaying = false;
    }

    async _repositionPlayingSource() {
        if (!this._isPlaying) return;
        await this._ensureContext();
        await this._load();
        const v = this._volume;
        const now = this.context.currentTime;
        try {
            // quick fade-out
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 0.005);
        } catch(_) {}
        try { this.source && this.source.stop(now + 0.006); } catch(_) {}
        try { this.source && this.source.disconnect(); } catch(_) {}
        this.source = null;
        // start new source at requested offset
        this._createSource(this._offset);
        try {
            // quick fade-in
            const t = this.context.currentTime;
            this.gainNode.gain.setValueAtTime(0, t);
            this.gainNode.gain.linearRampToValueAtTime(v, t + 0.01);
        } catch(_) {}
    }

    get currentTime() {
        if (!this.buffer) return Math.max(0, (this._offset || 0) - this._loopStart);
        if (!this._isPlaying) return this._wrapToLoop(this._offset) - this._loopStart;
        const now = this.context.currentTime;
        const t = now - this._startTime;
        return this._wrapToLoop(t) - this._loopStart;
    }

    set currentTime(sec) {
        this._offset = this._loopStart + Math.max(0, sec);
        if (this._isPlaying) {
            // reposition without pausing globally
            this._repositionPlayingSource();
        }
    }

    get duration() {
        if (!this.buffer) return 0;
        const start = this._loopStart;
        const end = this._loopEnd || this.buffer.duration;
        return Math.max(0, end - start);
    }

    get volume() { return this._volume; }
    set volume(v) {
        this._volume = Math.max(0, Math.min(1, v));
        if (this.gainNode) this.gainNode.gain.value = this._volume;
    }
}
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
const audio = new SeamlessLoopPlayer('assets/audio/MUSIC.mp3');
audio.volume = 0.5;

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

        if (config.type === GIMMICK_TYPES.LYRICS) {
            // テキストを入れるコンテナ
            const textWrap = document.createElement('div');
            textWrap.className = 'lyrics-wrap';
            textWrap.style.position = 'absolute';
            textWrap.style.left = '50%';
            textWrap.style.top = '50%';
            textWrap.style.transform = 'translate(-50%, -50%)';
            textWrap.style.width = '100%';
            textWrap.style.height = '100%';
            textWrap.style.display = 'flex';
            textWrap.style.flexDirection = 'column';
            textWrap.style.justifyContent = 'center';
            textWrap.style.alignItems = 'center';
            textWrap.style.pointerEvents = 'none';
            // Use a lyric-friendly Mincho font
            textWrap.style.fontFamily = "'Shippori Mincho', 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', 'Hiragino Mincho', 'MS Mincho', serif";
            element.appendChild(textWrap);
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

    _updateLyricsGimmick(element, config, size, scaleFactor) {
        const settings = config.settings || {};
        const fontSize = (settings.fontSize ? settings.fontSize * scaleFactor : size * 0.15);
        const lineHeight = settings.lineHeight || 1.3;
        const color = settings.color || '#111';
        const align = settings.align || 'center';
        const mode = settings.displayMode || 'accumulate'; // 'accumulate' or 'current'
        const autoStep = settings.autoStep != null ? settings.autoStep : 2.5; // 秒
        const autoStartAt = settings.autoStartAt != null ? settings.autoStartAt : 0;
        const defaultDuration = settings.lineDuration != null ? settings.lineDuration : 2.5;

        let rawLines = settings.lines || settings.lyrics || [];
        // 正規化: { text, start, end }
        const entries = rawLines.map((entry, idx) => {
            if (typeof entry === 'string') {
                const start = autoStartAt + idx * autoStep;
                return { text: entry, start, end: start + defaultDuration };
            }
            const start = entry.start != null ? entry.start : (autoStartAt + idx * autoStep);
            const end = entry.end != null ? entry.end : (start + defaultDuration);
            return { text: entry.text, start, end };
        });

        // 表示する行を決定
        let visible = [];
        if (mode === 'accumulate') {
            visible = entries.filter(e => currentTime >= e.start).map(e => e.text);
        } else {
            // 現在行のみ（該当なしなら直前の行）
            const current = entries.find(e => currentTime >= e.start && currentTime < e.end);
            if (current) {
                visible = [current.text];
            } else {
                const prev = entries.filter(e => currentTime >= e.start).pop();
                if (prev) visible = [prev.text];
            }
        }

        const wrap = element.querySelector('.lyrics-wrap');
        if (!wrap) return;

        // スタイル
        wrap.style.textAlign = align;
        wrap.style.color = color;
        wrap.style.gap = `${Math.round(fontSize * (lineHeight - 1))}px`;

        // レイアウトに合わせてフォント反映
        // 既存をクリアして描画（シンプル実装）
        wrap.innerHTML = '';
        visible.forEach(line => {
            const p = document.createElement('div');
            p.textContent = line;
            p.style.fontSize = `${fontSize}px`;
            p.style.lineHeight = `${lineHeight}`;
            p.style.fontFamily = "'Shippori Mincho', 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', 'Hiragino Mincho', 'MS Mincho', serif";
            p.style.fontWeight = '700';
            // 行の最大横幅を要素幅に合わせる
            p.style.maxWidth = '90%';
            p.style.textAlign = align;
            wrap.appendChild(p);
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

                case GIMMICK_TYPES.LYRICS:
                    this._updateLyricsGimmick(element, gimmickConfig, size, scaleFactor);
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
        // 初期表示のチラつきを抑えるためデコード優先
        imageElement.decoding = 'sync';
        imageElement.loading = 'eager';
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
    // デバッグ用タイムスライダーを同期
    if (typeof debugTools?.updateTimeSlider === 'function') {
        debugTools.updateTimeSlider(currentTime);
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

playButton.addEventListener('click', async () => {
    clickCounts.play++;
    if (isPlaying) {
        try { audio.pause(); } catch (_) {}
        playIcon.src = 'assets/images/controls/play.png';
        isPlaying = false;
        return;
    }
    try {
        if (typeof audio._ensureContext === 'function') {
            await audio._ensureContext();
        }
        await audio.play();
        playIcon.src = 'assets/images/controls/pause.png';
        isPlaying = true;
    } catch (err) {
        // Safari 等で失敗した場合はユーザー操作を促す
        console.warn('Audio play failed:', err);
        playIcon.src = 'assets/images/controls/play.png';
        isPlaying = false;
    }
});

// Disable long-press context menu on mobile
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Web Audio のシームレスループを使うため、ended での手動ループは不要

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
// プログレスバー: つまみ以外でも即ジャンプ＆ドラッグ開始
progressBarElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    updateTimeFromClick(event, true);
});

// バーをクリックしただけでもジャンプ
progressBarElement.addEventListener('click', (event) => {
    updateTimeFromClick(event, true);
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
    isDragging = true;
    progressBarElement.addEventListener('touchmove', handleTouchMove);
    updateTimeFromTouch(event);
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
            if (e.repeat) return;
            let targetStage = null;
            // 物理キー優先で判定（Shiftの記号化対策）
            const code = e.code || '';
            let digit = null;
            if (code.startsWith('Digit')) {
                digit = parseInt(code.slice(5), 10);
            } else if (code.startsWith('Numpad')) {
                const n = parseInt(code.slice(6), 10);
                if (!isNaN(n) && n >= 0 && n <= 9) digit = n;
            } else if (e.key && e.key >= '0' && e.key <= '9') {
                digit = parseInt(e.key, 10);
            }

            if (digit !== null) {
                // Shift + 0..7 => 10..17
                if (e.shiftKey && !e.ctrlKey) {
                    if (digit >= 0 && digit <= 7) targetStage = 10 + digit;
                }
                // Ctrl + 1..9 => 21..29（従来維持）
                else if (!e.shiftKey && e.ctrlKey) {
                    if (digit >= 1 && digit <= 9) targetStage = 20 + digit;
                }
                // 単体 0..9 => 0..9
                else if (!e.shiftKey && !e.ctrlKey) {
                    targetStage = digit;
                }
            }

            if (targetStage !== null && targetStage <= 25) {
                e.preventDefault();
                this.forceJumpToStage(targetStage);
            }
        });

        // デバッグ用 再生時間バー
        (function setupDebugTimeBar(self){
            const toolsRoot = document.getElementById('debugTools');
            if (!toolsRoot || toolsRoot.querySelector('#debugTimeSlider')) return;

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.gap = '8px';
            row.style.alignItems = 'center';
            row.style.marginTop = '6px';

            const label = document.createElement('div');
            label.textContent = '再生時間:';
            label.style.color = 'white';
            label.style.fontSize = '12px';

            const timeValue = document.createElement('div');
            timeValue.id = 'debugTimeValue';
            timeValue.textContent = '0:00';
            timeValue.style.color = 'white';
            timeValue.style.fontSize = '12px';
            timeValue.style.width = '48px';
            timeValue.style.textAlign = 'right';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'debugTimeSlider';
            slider.min = '0';
            slider.max = String(TOTAL_DURATION);
            slider.step = '0.05';
            slider.value = '0';
            slider.style.flex = '1';

            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(timeValue);
            toolsRoot.appendChild(row);

            const startScrub = () => { self._scrubbing = true; };
            const endScrub = () => { self._scrubbing = false; };
            slider.addEventListener('mousedown', startScrub);
            slider.addEventListener('touchstart', startScrub, { passive: true });
            slider.addEventListener('mouseup', endScrub);
            slider.addEventListener('touchend', endScrub);

            const seekTo = (sec) => {
                currentTime = sec;
                audio.currentTime = sec;
                self.updateTimeLabel(sec);
                updateProgress();
                updateProblemElements();
                updateRhythmDots();
            };

            slider.addEventListener('input', () => {
                const sec = parseFloat(slider.value) || 0;
                const now = (window.performance && performance.now) ? performance.now() : Date.now();
                if (!self._lastSeekAt || now - self._lastSeekAt > 50) {
                    self._lastSeekAt = now;
                    seekTo(sec);
                } else {
                    // 軽量に表示だけ更新
                    self.updateTimeLabel(sec);
                }
            });
            slider.addEventListener('change', () => {
                const sec = parseFloat(slider.value) || 0;
                seekTo(sec);
            });

            self._timeSlider = slider;
            self._timeLabel = timeValue;
        })(this);
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
    },
    updateTimeLabel(sec) {
        if (this._timeLabel) {
            this._timeLabel.textContent = formatTime(sec);
        }
    },
    updateTimeSlider(sec) {
        if (!this._timeSlider || this._scrubbing) return;
        const clamped = Math.max(0, Math.min(TOTAL_DURATION, sec));
        if (this._timeSlider.value !== String(clamped)) {
            this._timeSlider.value = String(clamped);
            this.updateTimeLabel(clamped);
        }
    }
};

// ステージ更新時にセレクトボックスも更新
const originalUpdateStageContent = updateStageContent;
updateStageContent = function() {
    originalUpdateStageContent.apply(this, arguments);
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
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressText = this.loadingScreen.querySelector('.loading-progress');
        this.progressImage = this.loadingScreen.querySelector('.loading-image');
        // 音声は HTMLAudio 要素ではロードせず、fetch で ArrayBuffer を事前取得
        this.cache = new Map();
    }

    updateLoadingProgress() {
        const percentage = Math.floor((this.loadedAssets / this.totalAssets) * 100);
        if (this.progressText) this.progressText.textContent = `${percentage}%`;
        if (this.progressImage) {
            this.progressImage.style.setProperty('--p', percentage);
            // use turn unit for stable conic angle math
            this.progressImage.style.setProperty('--a', `${percentage / 100}turn`);
        }
    }

    // Safari対応の新しいローダー（音声は ArrayBuffer のみ事前フェッチ）
    async loadAll2() {
        try {
            const imageList = [
                'assets/images/load/load.png',
                ...Object.values(PUZZLE_IMAGES),
                'assets/images/controls/play.png',
                'assets/images/controls/pause.png',
                'assets/images/controls/prev.png',
                'assets/images/controls/next.png',
                'assets/images/controls/hint.png',
                ...Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage8/moon${i}.png`),
                ...Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage10/black${i}.png`),
                ...Array.from({ length: 16 }, (_, i) => `assets/images/puzzles/wall/wall${i}.png`)
            ];

            this.totalAssets = imageList.length + 1 + 1; // images + audio buffer + fonts
            this.loadedAssets = 0;

            const imagePromises = imageList.map(src => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = async () => {
                    try { if (img.decode) await img.decode(); } catch (_) {}
                    this.cache.set(src, img);
                    this.loadedAssets++;
                    this.updateLoadingProgress();
                    resolve();
                };
                img.onerror = reject;
                img.src = src;
            }));

            const audioBufferPromise = fetch('assets/audio/MUSIC5.mp3', { cache: 'force-cache' })
                .then(res => { if (!res.ok) throw new Error('Audio fetch failed'); return res.arrayBuffer(); })
                .then(buf => { this.cache.set('__audioArrayBuffer__', buf); this.loadedAssets++; this.updateLoadingProgress(); return buf; });

            const fontPromise = (document.fonts && document.fonts.ready)
                ? document.fonts.ready.then(() => { this.loadedAssets++; this.updateLoadingProgress(); })
                : Promise.resolve().then(() => { this.loadedAssets++; this.updateLoadingProgress(); });

            const [audioArrayBuffer] = await Promise.all([audioBufferPromise, fontPromise, ...imagePromises]);
            window.__imageCache = this.cache;
            window.__audioArrayBuffer = audioArrayBuffer;

            this.loadingScreen.classList.add('fade-out');
            await new Promise(resolve => setTimeout(resolve, 500));
            this.loadingScreen.style.display = 'none';
            return true;
        } catch (error) {
            console.error('Asset loading failed:', error);
            this.progressText.textContent = 'Loading failed. Please refresh.';
            return false;
        }
    }

    async loadAll() {
        try {
            // 画像のリストを作成
            const imageList = [
                'assets/images/load/load.png',
                // パズル画像
                ...Object.values(PUZZLE_IMAGES),
                
                // コントロール画像
                'assets/images/controls/play.png',
                'assets/images/controls/pause.png',
                'assets/images/controls/prev.png',
                'assets/images/controls/next.png',
                'assets/images/controls/hint.png',

                // Stage 8の月の画像
                ...Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage8/moon${i}.png`),

                // Stage 10の画像
                ...Array.from({ length: 8 }, (_, i) => `assets/images/puzzles/stage10/black${i}.png`),

                // Wall画像
                ...Array.from({ length: 16 }, (_, i) => `assets/images/puzzles/wall/wall${i}.png`)
            ];

            this.totalAssets = imageList.length + 1; // +1 for audio
            this.loadedAssets = 0;

            // 画像のプリロード
            const imagePromises = imageList.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = async () => {
                        try {
                            if (img.decode) {
                                await img.decode();
                            }
                        } catch (e) { /* ignore */ }
                        this.cache.set(src, img);
                        this.loadedAssets++;
                        this.updateLoadingProgress();
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = src;
                });
            });

            // オーディオの完全なロード
            const audioPromise = new Promise((resolve, reject) => {
                let loaded = false;
                
                // データの完全なロードを待つ
                this.audio.addEventListener('loadeddata', () => {
                    // 音声データの一部がロードされた
                    this.updateLoadingProgress();
                });

                // 再生可能になるまで待つ
                this.audio.addEventListener('canplaythrough', () => {
                    if (!loaded) {
                        loaded = true;
                        this.loadedAssets++;
                        this.updateLoadingProgress();
                        resolve(this.audio);
                    }
                });

                this.audio.addEventListener('error', reject);
                
                // 明示的にロード開始
                this.audio.load();
            });

            // すべてのアセットのロード完了を待つ
            const [loadedAudio] = await Promise.all([audioPromise, ...imagePromises]);
            window.__imageCache = this.cache;
            
            // グローバルのaudio要素に設定
            window.audio = loadedAudio;

            // ローディング画面をフェードアウト
            this.loadingScreen.classList.add('fade-out');
            await new Promise(resolve => setTimeout(resolve, 500));
            this.loadingScreen.style.display = 'none';
            
            return true;
        } catch (error) {
            console.error('Asset loading failed:', error);
            this.progressText.textContent = 'Loading failed. Please refresh.';
            return false;
        }
    }
}

// ヒントが表示されるまでのループ回数を定義
const STAGE_HINT_LOOPS = {
    0: 999,  // チュートリアルはヒント非表示
    1: 8,   // 比較的簡単なステージは早めに表示
    2: 10,
    3: 20,
    4: 10,
    5: 10,
    6: 10,
    7: 10,
    8: 10,
    9: 9,
    10: 10,
    11: 12,
    12: 12,
    13: 12,
    14: 12,
    15: 12,
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
    6: "黒黒・・黒黒黒・\n（数字を漢字で表記すると百と千）",
    7: "・黒・黒黒・・黒",
    8: "・黒・・・・・・\n（tips:新月から数えて三日目の月が三日月）",
    9: "黒黒黒・黒黒黒・黒黒黒黒黒黒黒黒\n（桃栗三年柿八年）",
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

    // アセットのロード（Safari 対応版）
    const loader = new AssetLoader();
    const loadSuccess = await loader.loadAll2();

    if (!loadSuccess) {
        return; // ロード失敗時は初期化中止
    }

    // ロード完了後にモーダルを表示
    modal.style.visibility = 'visible';
    
    // ゲーム開始を遅延させる
    const startGame = async () => {
        modal.style.display = 'none';
        // 最初にステージ画像が確実に用意されてから表示する（ほんの一瞬）
        try {
            const cache = window.__imageCache;
            const firstImage = (typeof PUZZLE_IMAGES !== 'undefined') ? PUZZLE_IMAGES[currentStage] : null;
            const cachedImg = firstImage && cache ? cache.get(firstImage) : null;
            if (cachedImg && typeof cachedImg.decode === 'function') {
                await cachedImg.decode();
            }
        } catch (_) {}
        container.style.visibility = 'visible';
        // ユーザー操作のタイミングで AudioContext を初期化 + 事前フェッチ済みバッファを提供
        if (audio && typeof audio._ensureContext === 'function') {
            try {
                await audio._ensureContext();
                if (window.__audioArrayBuffer) {
                    audio.provideArrayBuffer(window.__audioArrayBuffer);
                }
                await audio._load();
            } catch (_) {}
        }
        updateStageContent();
        updateProgress();
        requestAnimationFrame(update);
        debugTools.initialize();

        // レイアウトが安定してからもう一度描画（初回のズレ対策）
        const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
        try {
            await nextFrame();
            await nextFrame();
            updateStageContent();
            updateProblemElements();
        } catch (_) {}
    };

    // OKボタンのクリックイベント
    if (startButton && container) {
        startButton.addEventListener('click', startGame);
    } else {
        console.error('Required elements not found');
    }
}


document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    // エンターキー(13)またはスペースキー(32)が押された場合
    if (event.keyCode === 13 || event.keyCode === 32) {
        // デフォルトの動作を防止（スペースキーでのスクロールなど）
        event.preventDefault();
        
        // 次へボタンのクリックをシミュレート
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.click();
            
            // クリックエフェクトを追加（オプション）
            nextButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                nextButton.style.transform = 'scale(1)';
            }, 100);
        }
    }
});

// 初期化実行
initialize();
