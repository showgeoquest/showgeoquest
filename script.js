const $ = (id) => document.getElementById(id);

const screenTitle = $("screen-title");
const screenGame  = $("screen-game");
const modeLabel   = $("modeLabel");
const titleMap    = $("titleMap");

const backBtn    = $("backToTitle");
const questionEl = $("question");
const form       = $("form");
const answerEl   = $("answer");
const resultEl   = $("result");
const nextBtn    = $("next");
const revealBtn  = $("reveal");
const logEl      = document.getElementById("log");

// デモ用（あとで47都道府県データに差し替えOK）
const DATA = {
  region: {
    hokkaido_tohoku: [
      { pref: "北海道", capital: "札幌市" },
      { pref: "宮城県", capital: "仙台市" },
    ],
    kanto: [
      { pref: "東京都", capital: "新宿区（都庁）" },
      { pref: "神奈川県", capital: "横浜市" },
    ],
    chubu: [
      { pref: "新潟県", capital: "新潟市" },
      { pref: "愛知県", capital: "名古屋市" },
    ],
    kinki: [
      { pref: "大阪府", capital: "大阪市" },
      { pref: "京都府", capital: "京都市" },
    ],
    chugoku_shikoku: [
      { pref: "広島県", capital: "広島市" },
      { pref: "香川県", capital: "高松市" },
    ],
    kyushu_okinawa: [
      { pref: "福岡県", capital: "福岡市" },
      { pref: "沖縄県", capital: "那覇市" },
    ],
  },
  conquest: {
    west: [
      { pref: "大阪府", capital: "大阪市" },
      { pref: "広島県", capital: "広島市" },
      { pref: "福岡県", capital: "福岡市" },
      { pref: "沖縄県", capital: "那覇市" },
    ],
    all: [
      { pref: "北海道", capital: "札幌市" },
      { pref: "東京都", capital: "新宿区（都庁）" },
      { pref: "大阪府", capital: "大阪市" },
      { pref: "福岡県", capital: "福岡市" },
      { pref: "沖縄県", capital: "那覇市" },
    ],
    east: [
      { pref: "北海道", capital: "札幌市" },
      { pref: "東京都", capital: "新宿区（都庁）" },
      { pref: "新潟県", capital: "新潟市" },
    ],
  }
};

let pool = [];
let current = null;

/* ===== 日本列島制覇：雷＋光（無音） ===== */
let japanBoltPlayed = false;

function playJapanBolt(){
  if (japanBoltPlayed) return; // 1回だけ
  japanBoltPlayed = true;

  // 背景地図も「前に出て光る」
  if (titleMap){
    titleMap.classList.add("is-complete");
    setTimeout(() => titleMap.classList.remove("is-complete"), 1200);
  }

  const flash = document.createElement("div");
  flash.className = "effect-flash";
  document.body.appendChild(flash);

  const bolt = document.createElement("div");
  bolt.className = "effect-lightning";
  document.body.appendChild(bolt);

  setTimeout(() => {
    flash.remove();
    bolt.remove();
  }, 1200);
}

/* ===== ゲーム基本 ===== */
function normalize(s){ return (s ?? "").trim(); }

function addLog(text){
  if (!logEl) return;
  const li = document.createElement("li");
  li.textContent = text;
  logEl.prepend(li);
}

function pickQuestion(){
  if (!pool.length) return;
  current = pool[Math.floor(Math.random() * pool.length)];
  questionEl.textContent = `${current.capital} の都道府県は？`;
  resultEl.textContent = "ここに結果が出ます";
  answerEl.value = "";
  answerEl.focus();
}

function showTitle(){
  screenTitle.hidden = false;
  screenGame.hidden = true;
  if (logEl) logEl.innerHTML = "";
  current = null;
}

function showGame(mode, key, labelText){
  pool = DATA?.[mode]?.[key] ?? [];
  modeLabel.textContent = labelText ?? "---";
  screenTitle.hidden = true;
  screenGame.hidden = false;
  pickQuestion();
}

/* ===== ボタン選択 ===== */
document.querySelectorAll("button[data-mode][data-key]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    const key  = btn.dataset.key;

    // 日本列島制覇だけ「雷＋光＋背景地図の光」を重ねる（無音）
    if (mode === "conquest" && key === "all") {
      playJapanBolt();
    }

    showGame(mode, key, btn.textContent);
  });
});

backBtn.addEventListener("click", showTitle);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!current) return;

  const ans = normalize(answerEl.value);
  if (!ans) {
    resultEl.textContent = "入力してね";
    return;
  }

  const ok = ans === current.pref;
  if (ok) {
    resultEl.textContent = "✅ 正解！";
    addLog(`正解：${current.capital} → ${current.pref}`);
  } else {
    resultEl.textContent = `❌ 不正解。正解は「${current.pref}」`;
    addLog(`不正解：${current.capital} → あなた「${ans}」 / 正解「${current.pref}」`);
  }
});

nextBtn.addEventListener("click", () => pickQuestion());

revealBtn.addEventListener("click", () => {
  if (!current) return;
  resultEl.textContent = `答え：${current.pref}`;
});

// 初期はタイトル
showTitle();