/* 扣篮协议 · 26 周 —— 静态交互层，无外部依赖 */
(function () {
  "use strict";

  var KEY = {
    weeks: "dunk26.weeks",
    tests: "dunk26.tests",
    start: "dunk26.start"
  };

  /* ---------------- 数据 ---------------- */
  var WEEKS = [
    { w: 1,  t: "激活 · 极限等长 2 分钟", d: "弹性 低 · 力量 77% 4×4 · 技术 助跑节奏 A/B" },
    { w: 2,  t: "激活 · 等长 3 分钟", d: "弹性 低 · 力量 80% 5×3 · 技术 A/B" },
    { w: 3,  t: "激活 · 单腿 pogo", d: "弹性 低 · 力量 82% 5×3 · 技术 目标触击 C" },
    { w: 4,  t: "激活 · 强度顶到 85%", d: "弹性 低 · 力量 85% 6×2 · 技术 C" },
    { w: 5,  t: "减载 + 测试", d: "弹性 低 · 力量 50% 5×5 · 只做技术", target: "2.90–2.91", type: "test" },
    { w: 6,  t: "吸收 · 6 秒离心", d: "弹性 低–中 · 力量 75% 5×4 · 技术 球处理 D" },
    { w: 7,  t: "吸收 · 北欧 + depth drop", d: "弹性 低–中 · 力量 80% 5×3 · 技术 D" },
    { w: 8,  t: "吸收 · approach tuck 落地", d: "弹性 低–中 · 力量 85% 5×2 · 技术 单脚专项" },
    { w: 9,  t: "减载 + 测试", d: "弹性 低 · 力量 50% 5×5 · 只做技术", target: "2.93–2.94", type: "test" },
    { w: 10, t: "推进 · 加速蹲 + 助力跳", d: "弹性 中–高 · 力量 60% 5×4 · 技术 单脚专项" },
    { w: 11, t: "推进 · 坐姿跳 + 药球上抛", d: "弹性 中–高 · 力量 70% 5×3 · 技术 C" },
    { w: 12, t: "推进 · 半跪姿 / 非反向跳", d: "弹性 中–高 · 力量 80% 5×2 · 技术 C" },
    { w: 13, t: "减载 + 测试（关键判定）", d: "弹性 低 · 力量 50% 5×5 · 只做技术", target: "2.95–2.97", type: "test" },
    { w: 14, t: "峰值 I · 50% + 85%", d: "弹性 高 · 力量 3×3@85% · 技术 全程实战化" },
    { w: 15, t: "峰值 I · 45% + 90%", d: "弹性 高 · 力量 4×2@90% · 技术 全程实战化" },
    { w: 16, t: "峰值 I · 40% + 95%", d: "弹性 高 · 力量 2×1@95% · 挑战日彩排", type: "peak" },
    { w: 17, t: "减载 + 测试（阶段结算）", d: "弹性 低 · 力量 2×2@85% · 只做技术", target: "2.98–3.00", type: "test" },
    { w: 18, t: "弹性 II · 高负荷弹性 + 冲刺", d: "弹性 最高 · 力量 维持 3×3@85% · 技术 3 次/周" },
    { w: 19, t: "弹性 II · 助跑速度 + 扣篮实战", d: "弹性 最高 · 力量 维持 · 技术 3 次/周" },
    { w: 20, t: "弹性 II · 单脚起跳专项", d: "弹性 最高 · 力量 维持 · 技术 4 次/周" },
    { w: 21, t: "减载 + 测试", d: "弹性 中 · 力量 3×3@85% · 只做技术", target: "3.00–3.02", type: "test" },
    { w: 22, t: "峰值 II · 全力 approach", d: "弹性 最高 · 力量 2×2@90% · 技术 4 次/周", type: "peak" },
    { w: 23, t: "峰值 II · 模拟挑战日 ×2", d: "弹性 最高 · 力量 2×2@90% · 技术 4 次/周", type: "peak" },
    { w: 24, t: "峰值 II · 踩点、试球、试筐", d: "弹性 最高 · 力量 2×2@88% · 场地实测", target: "3.02–3.04", type: "peak" },
    { w: 25, t: "减量 60% · 只留高质量 6–8 跳", d: "弹性 高质低量 · 力量 2×2@88%", type: "peak" },
    { w: 26, t: "挑战日", d: "T1（2.90m + 5 号球）→ T2（2.95m + 6 号球）", target: "T1 / T2", type: "peak" }
  ];

  var TESTS = [
    { w: "W0",  need: null,  label: "基线" },
    { w: "W5",  need: 2.90,  label: "+3cm" },
    { w: "W9",  need: 2.93,  label: "+6cm" },
    { w: "W13", need: 2.95,  label: "+8cm" },
    { w: "W17", need: 2.98,  label: "+11cm" },
    { w: "W21", need: 3.00,  label: "+13cm" },
    { w: "W26", need: 3.02,  label: "T1 2.98 / T2 3.07" }
  ];

  /* ---------------- 存储 ---------------- */
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var state = {
    done: load(KEY.weeks, {}),
    tests: load(KEY.tests, {}),
    start: load(KEY.start, null)
  };

  /* ---------------- 26 周列表 ---------------- */
  var weeksEl = document.getElementById("weeks");
  var progressEl = document.getElementById("blockProgress");
  var ringEl = document.getElementById("ring");
  var ringText = document.getElementById("ringText");
  var ringSub = document.getElementById("ringSub");
  var badge = document.getElementById("weekBadge");
  var startInput = document.getElementById("startDate");

  function weekIndexNow() {
    if (!state.start) return 1;
    var s = new Date(state.start + "T00:00:00");
    if (isNaN(s.getTime())) return 1;
    var days = Math.floor((Date.now() - s.getTime()) / 86400000);
    if (days < 0) return 1;
    return Math.min(26, Math.floor(days / 7) + 1);
  }

  function renderWeeks() {
    var now = weekIndexNow();
    var frag = document.createDocumentFragment();
    WEEKS.forEach(function (item) {
      var el = document.createElement("div");
      el.className = "wk";
      if (state.done[item.w]) el.classList.add("done");
      if (item.w === now) el.classList.add("now");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-pressed", state.done[item.w] ? "true" : "false");
      el.dataset.w = item.w;

      var chip = "";
      if (item.w === now) chip = '<span class="chip now">当前</span>';
      if (item.type === "test") chip += '<span class="chip">测试</span>';
      if (item.type === "peak") chip += '<span class="chip peak">峰值</span>';

      el.innerHTML =
        '<div class="wk-tag">W' + item.w + "</div>" +
        '<div class="wk-body">' +
          '<div class="wk-title">' + item.t + chip + "</div>" +
          '<div class="wk-detail">' + item.d + "</div>" +
        "</div>" +
        '<div class="wk-target">' + (item.target || "") + "</div>" +
        '<div class="wk-box"></div>';

      frag.appendChild(el);
    });
    weeksEl.innerHTML = "";
    weeksEl.appendChild(frag);
  }

  function updateProgress() {
    var n = Object.keys(state.done).filter(function (k) { return state.done[k]; }).length;
    var pct = Math.round((n / 26) * 100);
    progressEl.textContent = "已完成 " + n + " / 26 周";
    ringEl.style.setProperty("--p", pct);
    ringText.innerHTML = pct + "<small>%</small>";
    ringSub.textContent = n === 0
      ? "还没有开始记录"
      : (n >= 26 ? "全部完成 · 去挑战日" : "还剩 " + (26 - n) + " 周");
    badge.textContent = "第 " + weekIndexNow() + " 周";
  }

  weeksEl.addEventListener("click", function (e) {
    var row = e.target.closest(".wk");
    if (!row) return;
    var w = row.dataset.w;
    state.done[w] = !state.done[w];
    save(KEY.weeks, state.done);
    row.classList.toggle("done", state.done[w]);
    row.setAttribute("aria-pressed", state.done[w] ? "true" : "false");
    updateProgress();
  });

  weeksEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var row = e.target.closest(".wk");
    if (!row) return;
    e.preventDefault();
    row.click();
  });

  /* ---------------- 测试卡 ---------------- */
  var testsBox = document.getElementById("testsBox");

  function renderTests() {
    var frag = document.createDocumentFragment();
    TESTS.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "test-card";
      card.dataset.w = item.w;
      card.innerHTML =
        '<div class="tc-h">' +
          '<span class="tc-w">' + item.w + "</span>" +
          '<span class="tc-need">' + (item.need ? "≥ " + item.need.toFixed(2) + "m · " + item.label : "基线记录") + "</span>" +
        "</div>" +
        '<label for="t-' + item.w + '">助跑摸高（m）</label>' +
        '<input id="t-' + item.w + '" type="number" inputmode="decimal" step="0.01" min="2.4" max="3.6" placeholder="填写实测值" value="' +
          (state.tests[item.w] != null ? state.tests[item.w] : "") + '">' +
        '<div class="tc-res"></div>';
      frag.appendChild(card);
    });
    testsBox.innerHTML = "";
    testsBox.appendChild(frag);
    refreshTestResults();
  }

  function refreshTestResults() {
    var base = parseFloat(state.tests["W0"]);
    TESTS.forEach(function (item) {
      var card = testsBox.querySelector('[data-w="' + item.w + '"]');
      if (!card) return;
      var res = card.querySelector(".tc-res");
      var val = parseFloat(state.tests[item.w]);
      card.classList.toggle("done", !isNaN(val));
      if (isNaN(val)) { res.textContent = ""; res.className = "tc-res"; return; }

      var delta = !isNaN(base) ? (val - base) : null;
      var txt = val.toFixed(2) + "m";
      if (delta != null && item.w !== "W0") {
        txt += " · " + (delta >= 0 ? "+" : "") + (delta * 100).toFixed(0) + "cm";
      }
      var cls = "tc-res";
      if (item.need) {
        if (val >= item.need) { cls += " ok"; txt += " ✓ 达标"; }
        else if (val >= item.need - 0.02) { cls += " near"; txt += " 差 " + Math.round((item.need - val) * 100) + "cm"; }
        else { cls += " bad"; txt += " 差 " + Math.round((item.need - val) * 100) + "cm"; }
      }
      res.textContent = txt;
      res.className = cls;
    });
  }

  testsBox.addEventListener("input", function (e) {
    var input = e.target;
    if (input.tagName !== "INPUT") return;
    var w = input.id.replace("t-", "");
    var v = input.value.trim();
    if (v === "") { delete state.tests[w]; }
    else { state.tests[w] = v; }
    save(KEY.tests, state.tests);
    refreshTestResults();
  });

  /* ---------------- 开始日期 ---------------- */
  function todayISO() {
    var d = new Date();
    var tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  }

  if (!state.start) {
    state.start = todayISO();
    save(KEY.start, state.start);
  }
  startInput.value = state.start;

  startInput.addEventListener("change", function () {
    state.start = startInput.value || todayISO();
    save(KEY.start, state.start);
    renderWeeks();
    updateProgress();
    refreshTestResults();
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!window.confirm("清空所有勾选与测试记录？")) return;
    state.done = {};
    state.tests = {};
    save(KEY.weeks, state.done);
    save(KEY.tests, state.tests);
    renderWeeks();
    renderTests();
    updateProgress();
  });

  /* ---------------- 导航高亮 ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.style.color = ""; a.style.borderBottomColor = "transparent"; });
        var i = sections.indexOf(en.target);
        if (i > -1) {
          navLinks[i].style.color = "#fff";
          navLinks[i].style.borderBottomColor = "var(--orange)";
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }

  /* ---------------- 表格：移动端加 data-label，转成卡片式 ---------------- */
  function labelTables() {
    var tables = document.querySelectorAll("table.data-table");
    Array.prototype.forEach.call(tables, function (table) {
      var heads = Array.prototype.map.call(table.querySelectorAll("thead th"), function (th) {
        return th.textContent.trim();
      });
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (tr) {
        Array.prototype.forEach.call(tr.children, function (td, i) {
          if (heads[i]) td.setAttribute("data-label", heads[i]);
        });
      });
    });
  }

  /* ---------------- init ---------------- */
  labelTables();
  renderWeeks();
  renderTests();
  updateProgress();
})();
