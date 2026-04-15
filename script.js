/* ===================================================
   script.js — 許旆慈職涯作品集
   功能：頁面切換、圖表、動態技能條、互動測驗
=================================================== */

// ─── 資料 ───────────────────────────────────────────
const skillData = [
  { name: '提供產品維護與客戶支援服務', score: 3.75, max: 5, level: '最高分項目', type: 'best' },
  { name: '依據專案需求進行系統分析',   score: 3.50, max: 5, level: '中等能力',   type: 'gold' },
  { name: '撰寫技術文件及使用手冊',     score: 3.00, max: 5, level: '中等能力',   type: 'gold' },
  { name: '確認軟體開發或程式設計需求', score: 2.67, max: 5, level: '尚待加強',   type: 'warn' },
];

const commonData = [
  { name: '溝通表達', score: 3.14, pr: 15,  desc: '您的溝通表達能力可再精進，建議練習傾聽、表達與書寫技巧，依據不同對象調整溝通方式。' },
  { name: '持續學習', score: 3.00, pr: 13,  desc: '建議往未來關注，思考自己的職涯目標，養成持續學習的習慣，面對快速變化的職場環境。' },
  { name: '人際互動', score: 3.67, pr: 32,  desc: '練習同理心，認識多元人際，學習職場上互惠合作的原則，主動建立廣泛人際關係。' },
  { name: '團隊合作', score: 2.86, pr: 3,   desc: '透過參與社團、競賽或志工服務，學習在團隊中找到適合自己的角色，培養協作精神。' },
  { name: '問題解決', score: 3.00, pr: 15,  desc: '練習系統化思維，學習看待問題的邏輯觀點，研究他人解決方案，加強專業知識。' },
  { name: '創新',     score: 3.50, pr: 39,  desc: '創新思維屬中等程度，可透過觀察與想像，在既有規則中找出更有效率的新方法。' },
  { name: '工作責任及紀律', score: 3.14, pr: 10, desc: '養成良好工作規劃習慣，先規劃後執行，逐步完成任務，建立對工作的成就感與信心。' },
  { name: '資訊科技應用', score: 3.50, pr: 31, desc: '加強基礎數位工具，如文書處理、試算表、簡報軟體，有助於提升工作效率與職場競爭力。' },
];

const interestData = {
  labels: ['醫療保健','藝文影音','教育訓練','個人社會服務','休閒觀光','科技工程數學','建築營造','天然資源農業','製造','物流運輸','司法安全','行銷銷售','資訊科技','政府公共','金融財務','企業管理'],
  values: [2.05, 1.75, 1.75, 1.75, 1.75, 1.75, 1.45, 1.45, 1.45, 1.45, 1.45, 0.85, 0.55, 0.55, 0.25, 0.25],
};

// ─── 頁面切換 ────────────────────────────────────────
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.dataset.page === id) l.classList.add('active');
  });
  if (id === 'data') {
    setTimeout(() => {
      buildSkillBars();
      buildCommonGrid();
      buildQuizBtns();
      buildCharts();
    }, 50);
  }
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    goPage(link.dataset.page);
  });
});

document.querySelectorAll('[onclick]').forEach(el => {
  // handled via onclick attribute
});

// ─── 技能條 ──────────────────────────────────────────
function buildSkillBars() {
  const container = document.getElementById('skillBars');
  if (!container || container.dataset.built) return;
  container.dataset.built = 'true';
  container.innerHTML = '';

  skillData.forEach(item => {
    const pct = (item.score / item.max) * 100;
    const fillClass = item.type === 'best' ? 'skill-bar-fill best'
                    : item.type === 'gold' ? 'skill-bar-fill gold'
                    : 'skill-bar-fill';
    const el = document.createElement('div');
    el.className = 'skill-bar-item';
    el.innerHTML = `
      <div class="skill-bar-header">
        <span class="skill-bar-name">${item.name}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="skill-bar-level">${item.level}</span>
          <span class="skill-bar-score">${item.score} / ${item.max}</span>
        </div>
      </div>
      <div class="skill-bar-track">
        <div class="${fillClass}" style="width:0%" data-pct="${pct}"></div>
      </div>
    `;
    container.appendChild(el);
  });

  // animate
  requestAnimationFrame(() => {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      setTimeout(() => {
        bar.style.width = bar.dataset.pct + '%';
      }, 100);
    });
  });
}

// ─── 共通職能格 ─────────────────────────────────────
function buildCommonGrid() {
  const grid = document.getElementById('commonGrid');
  if (!grid || grid.dataset.built) return;
  grid.dataset.built = 'true';
  grid.innerHTML = '';

  commonData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'common-item';
    div.innerHTML = `
      <div class="common-item-name">${item.name}</div>
      <div class="common-item-score">${item.score}</div>
      <div class="common-item-pr">PR ${item.pr}</div>
    `;
    div.addEventListener('click', () => showQuizResult(i));
    grid.appendChild(div);
  });
}

// ─── 互動測驗按鈕 ────────────────────────────────────
function buildQuizBtns() {
  const btns = document.getElementById('quizBtns');
  if (!btns || btns.dataset.built) return;
  btns.dataset.built = 'true';
  btns.innerHTML = '';

  commonData.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.textContent = item.name;
    btn.dataset.idx = i;
    btn.addEventListener('click', () => showQuizResult(i, btn));
    btns.appendChild(btn);
  });
}

function showQuizResult(idx, btn) {
  const item = commonData[idx];
  const result = document.getElementById('quizResult');
  const allBtns = document.querySelectorAll('.quiz-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const level = item.score >= 4.5 ? '✅ 優勢能力'
               : item.score >= 1.5 ? '📘 中等能力'
               : '⚠️ 尚待加強';

  result.innerHTML = `
    <strong>${item.name}</strong>　${level}　${item.score} 分 / PR${item.pr}<br/>
    <span style="font-size:13px">${item.desc}</span>
  `;
  result.classList.add('show');
}

// ─── 圖表 ────────────────────────────────────────────
let chartsBuilt = false;
function buildCharts() {
  if (chartsBuilt) return;
  chartsBuilt = true;

  const gold     = '#B8962E';
  const green    = '#4A7C59';
  const gridLine = 'rgba(180,160,120,0.15)';
  const textCol  = '#5C4E35';

  Chart.defaults.font.family = "'Noto Sans TC', sans-serif";
  Chart.defaults.color = textCol;

  /* ─ 1. 職業興趣雷達圖 ─ */
  const rCtx = document.getElementById('radarChart');
  if (rCtx) {
    new Chart(rCtx, {
      type: 'radar',
      data: {
        labels: interestData.labels,
        datasets: [{
          label: '興趣強度',
          data: interestData.values,
          backgroundColor: 'rgba(74,124,89,0.2)',
          borderColor: green,
          pointBackgroundColor: green,
          pointRadius: 4,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0, max: 2.5,
            ticks: { stepSize: 0.5, font: { size: 10 } },
            grid: { color: gridLine },
            angleLines: { color: gridLine },
            pointLabels: { font: { size: 11 }, color: textCol },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` 興趣分數：${ctx.raw}`
            }
          }
        }
      }
    });
  }

  /* ─ 2. 專業職能長條圖 ─ */
  const bCtx = document.getElementById('barChart');
  if (bCtx) {
    const barColors = skillData.map(d =>
      d.type === 'best' ? green : d.type === 'gold' ? gold : '#C97B5A'
    );
    new Chart(bCtx, {
      type: 'bar',
      data: {
        labels: skillData.map(d => d.name),
        datasets: [{
          label: '分數 / 5',
          data: skillData.map(d => d.score),
          backgroundColor: barColors,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            min: 0, max: 5,
            grid: { color: gridLine },
            ticks: { stepSize: 1 }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` 分數：${ctx.raw} / 5`
            }
          }
        }
      }
    });
  }

  /* ─ 3. 共通職能雷達圖 ─ */
  const cCtx = document.getElementById('commonRadar');
  if (cCtx) {
    new Chart(cCtx, {
      type: 'radar',
      data: {
        labels: commonData.map(d => d.name),
        datasets: [{
          label: '我的分數',
          data: commonData.map(d => d.score),
          backgroundColor: 'rgba(184,150,46,0.15)',
          borderColor: gold,
          pointBackgroundColor: gold,
          pointRadius: 5,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0, max: 5,
            ticks: { stepSize: 1, font: { size: 10 } },
            grid: { color: gridLine },
            angleLines: { color: gridLine },
            pointLabels: { font: { size: 12 }, color: textCol },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw} 分`
            }
          }
        }
      }
    });
  }
}