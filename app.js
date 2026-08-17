/* MCPE Master Recover DB - test shell. ES5, no fetch, works from file:// */
(function () {
  "use strict";

  var TRANS = {
    ru: {
      search: "Поиск по имени...",
      sortName: "Имя", sortSize: "Размер", sortDate: "Дата", sortVer: "Версия", sortSeed: "Сид", sortGt: "Режим игры",
      dirAsc: "По возрастанию", dirDesc: "По убыванию",
      dl: "Скачать", empty: "Ничего не найдено",
      mSize: "Вес мира: ", mDate: "Дата создания: ", mSeed: "Сид: ", mGt: "Режим игры: ",
      vMin: "Минимальная совместимая версия игры: ", vLast: "Последний раз открывалась в игре версии: ", vUndef: "неопределённая",
      mComment: "Комментарий: ",
      gt: { 0: "Выживание", 1: "Креатив", 2: "Приключения", 3: "Зритель" },
      footData: "Данные:", footDb: "обновление БД:", footGen: "generated:",
      about: "The database of content from the well-known program \"MCPE Master\" saved by MrY122 and sorted by MaxRM, TNT ENTERTAINMENT inc organization in 2026 using \"DeepSeek V4 Flash free\" and \"OpenCode\"."
    },
    uk: {
      search: "Пошук за назвою...",
      sortName: "Ім'я", sortSize: "Розмір", sortDate: "Дата", sortVer: "Версія", sortSeed: "Сід", sortGt: "Режим гри",
      dirAsc: "За зростанням", dirDesc: "За спаданням",
      dl: "Завантажити", empty: "Нічого не знайдено",
      mSize: "Вага світу: ", mDate: "Дата створення: ", mSeed: "Сід: ", mGt: "Режим гри: ",
      vMin: "Мінімальна сумісна версія гри: ", vLast: "Востаннє відкривалась у версії гри: ", vUndef: "невизначена",
      mComment: "Коментар: ",
      gt: { 0: "Виживання", 1: "Креатив", 2: "Пригоди", 3: "Спостерігач" },
      footData: "Дані:", footDb: "оновлення БД:", footGen: "створено:",
      about: "The database of content from the well-known program \"MCPE Master\" saved by MrY122 and sorted by MaxRM, TNT ENTERTAINMENT inc organization in 2026 using \"DeepSeek V4 Flash free\" and \"OpenCode\"."
    },
    en: {
      search: "Search by name...",
      sortName: "Name", sortSize: "Size", sortDate: "Date", sortVer: "Version", sortSeed: "Seed", sortGt: "Game mode",
      dirAsc: "Ascending", dirDesc: "Descending",
      dl: "Download", empty: "Nothing found",
      mSize: "World size: ", mDate: "Created: ", mSeed: "Seed: ", mGt: "Game mode: ",
      vMin: "Minimum compatible game version: ", vLast: "Last opened in game version: ", vUndef: "undefined",
      mComment: "Comment: ",
      gt: { 0: "Survival", 1: "Creative", 2: "Adventure", 3: "Spectator" },
      footData: "Data:", footDb: "DB update:", footGen: "generated:",
      about: "The database of content from the well-known program \"MCPE Master\" saved by MrY122 and sorted by MaxRM, TNT ENTERTAINMENT inc organization in 2026 using \"DeepSeek V4 Flash free\" and \"OpenCode\"."
    },
    zh: {
      search: "按名称搜索...",
      sortName: "名称", sortSize: "大小", sortDate: "日期", sortVer: "版本", sortSeed: "种子", sortGt: "游戏模式",
      dirAsc: "升序", dirDesc: "降序",
      dl: "下载", empty: "未找到",
      mSize: "世界大小: ", mDate: "创建日期: ", mSeed: "种子: ", mGt: "游戏模式: ",
      vMin: "最低兼容游戏版本: ", vLast: "上次打开的游戏版本: ", vUndef: "未定义",
      mComment: "评论: ",
      gt: { 0: "生存", 1: "创造", 2: "冒险", 3: "旁观" },
      footData: "数据:", footDb: "数据库更新:", footGen: "生成于:",
      about: "The database of content from the well-known program \"MCPE Master\" saved by MrY122 and sorted by MaxRM, TNT ENTERTAINMENT inc organization in 2026 using \"DeepSeek V4 Flash free\" and \"OpenCode\"."
    },
    pt: {
      search: "Pesquisar por nome...",
      sortName: "Nome", sortSize: "Tamanho", sortDate: "Data", sortVer: "Versão", sortSeed: "Semente", sortGt: "Modo de jogo",
      dirAsc: "Crescente", dirDesc: "Decrescente",
      dl: "Baixar", empty: "Nada encontrado",
      mSize: "Tamanho do mundo: ", mDate: "Data de criação: ", mSeed: "Semente: ", mGt: "Modo de jogo: ",
      vMin: "Versão mínima compatível do jogo: ", vLast: "Última abertura na versão do jogo: ", vUndef: "indefinida",
      mComment: "Comentário: ",
      gt: { 0: "Sobrevivência", 1: "Criativo", 2: "Aventura", 3: "Espectador" },
      footData: "Dados:", footDb: "Atualização do BD:", footGen: "gerado em:",
      about: "The database of content from the well-known program \"MCPE Master\" saved by MrY122 and sorted by MaxRM, TNT ENTERTAINMENT inc organization in 2026 using \"DeepSeek V4 Flash free\" and \"OpenCode\"."
    }
  };

  var LANGS = [
    { code: "ru", label: "Русский" },
    { code: "uk", label: "Українська" },
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "pt", label: "Português" }
  ];

  var WORLDS_ALL = WORLDS.worlds;

  var state = {
    q: "",
    sort: "name",
    dir: 1,
    tags: [],
    lang: "ru"
  };
  var T = TRANS.ru;

  function el(id) { return document.getElementById(id); }

  function saveLang() {
    try { localStorage.setItem("mcpe_lang", state.lang); } catch (e) {}
  }

  function detectLang() {
    try {
      var s = localStorage.getItem("mcpe_lang");
      if (s && TRANS[s]) return s;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "ru").toLowerCase();
    var c = nav.substring(0, 2);
    if (TRANS[c]) return c;
    var full = nav.replace("-", "_");
    if (TRANS[full]) return full;
    return "ru";
  }

  function stripSection(s) {
    return String(s || "").replace(/\u00a7./g, "");
  }

  function gameTypeName(gt) {
    if (gt === null || gt === undefined) return "?";
    return T.gt[gt] ? T.gt[gt] : "? " + gt;
  }

  function verParts(v) {
    var p = String(v || "").split("."), i, out = [];
    for (i = 0; i < p.length; i++) out.push(+p[i] || 0);
    while (out.length < 4) out.push(0);
    return out;
  }

  function cmpVer(a, b) {
    var x = verParts(a), y = verParts(b), i;
    for (i = 0; i < 4; i++) {
      if (x[i] !== y[i]) return x[i] - y[i];
    }
    return 0;
  }

  function cmpNumStr(a, b) {
    if (a === b) return 0;
    if (a === null || a === undefined || a === "") return -1;
    if (b === null || b === undefined || b === "") return 1;
    var neg = (a.charAt(0) === "-") ? -1 : 1, an = a.charAt(0) === "-" ? a.slice(1) : a;
    var bn = b.charAt(0) === "-" ? b.slice(1) : b;
    if (neg === -1 && b.charAt(0) !== "-") return -1;
    if (neg === 1 && b.charAt(0) === "-") return 1;
    if (an.length !== bn.length) return (an.length - bn.length) * neg;
    return (an < bn ? -1 : 1) * neg;
  }

  function dateVal(w) {
    if (!w.d) return 0;
    var m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(w.d);
    if (!m) return 0;
    return +new Date(+m[3], +m[2] - 1, +m[1]);
  }

  function collectTags() {
    var map = {}, i, j, list = [];
    for (i = 0; i < WORLDS_ALL.length; i++) {
      for (j = 0; j < WORLDS_ALL[i].g.length; j++) {
        if (!map[WORLDS_ALL[i].g[j]]) { map[WORLDS_ALL[i].g[j]] = true; list.push(WORLDS_ALL[i].g[j]); }
      }
    }
    list.sort(function (a, b) { return a.localeCompare(b); });
    return list;
  }

  function filtered() {
    var out = [], i, w, ok, j, k;
    var q = state.q.toLowerCase();
    for (i = 0; i < WORLDS_ALL.length; i++) {
      w = WORLDS_ALL[i];
      if (q && stripSection(w.n).toLowerCase().indexOf(q) === -1) continue;
      if (state.tags.length) {
        for (j = 0; j < state.tags.length; j++) {
          ok = false;
          for (k = 0; k < w.g.length; k++) {
            if (w.g[k] === state.tags[j]) { ok = true; break; }
          }
          if (!ok) break;
        }
        if (!ok) continue;
      }
      out.push(w);
    }
    out.sort(function (a, b) {
      var r, d = state.dir;
      if (state.sort === "size") return (a.s - b.s) * d;
      if (state.sort === "date") return (dateVal(a) - dateVal(b)) * d;
      if (state.sort === "ver") return cmpVer(a.lov, b.lov) * d;
      if (state.sort === "seed") return cmpNumStr(a.seed, b.seed) * d;
      if (state.sort === "gt") return ((a.gt === null || a.gt === undefined ? 99 : a.gt) - (b.gt === null || b.gt === undefined ? 99 : b.gt)) * d;
      r = stripSection(a.n).localeCompare(stripSection(b.n)) * d;
      return r || a.f.localeCompare(b.f) * d;
    });
    return out;
  }

  function render() {
    var list = el("list"), out = filtered(), i, w, div, img, meta, g, a, parts = [];
    list.innerHTML = "";
    for (i = 0; i < out.length; i++) {
      w = out[i];
      div = document.createElement("div");
      div.className = "item";

      img = document.createElement("img");
      img.className = "ic";
      img.alt = "";
      img.src = w.i ? "icons/" + encodeURIComponent(w.f) + ".jpg" : "icons/!default_world.png";
      img.onerror = function () { this.src = "icons/!default_world.png"; };
      div.appendChild(img);

      a = document.createElement("a");
      a.className = "dl";
      a.href = WORLDS.base + w.u;
      a.appendChild(document.createTextNode(T.dl));
      div.appendChild(a);

      var h = document.createElement("div");
      h.className = "name";
      h.appendChild(document.createTextNode(stripSection(w.n)));
      div.appendChild(h);

      meta = document.createElement("div");
      meta.className = "meta";
      parts = [T.mSize + (w.sizeHuman || "?")];
      if (w.d) parts.push(T.mDate + w.d);
      if (w.seed !== null && w.seed !== undefined) parts.push(T.mSeed + w.seed);
      parts.push(T.mGt + gameTypeName(w.gt));
      meta.appendChild(document.createTextNode(parts.join(" | ")));
      div.appendChild(meta);

      var ver = document.createElement("div");
      ver.className = "meta";
      var mcv = w.mcv || w.lov;
      ver.appendChild(document.createTextNode(
        T.vMin + (mcv || T.vUndef) +
        (w.lov ? " | " + T.vLast + w.lov : "")
      ));
      div.appendChild(ver);

      if (w.c) {
        var cm = document.createElement("div");
        cm.className = "comment";
        cm.appendChild(document.createTextNode(T.mComment + w.c));
        div.appendChild(cm);
      }

      g = document.createElement("div");
      for (var j = 0; j < w.g.length; j++) {
        var span = document.createElement("span");
        span.className = "genre";
        span.appendChild(document.createTextNode(w.g[j]));
        g.appendChild(span);
      }
      div.appendChild(g);

      list.appendChild(div);
    }
    if (!out.length) {
      var e = document.createElement("div");
      e.className = "empty";
      e.appendChild(document.createTextNode(T.empty));
      list.appendChild(e);
    }
    el("count").textContent = out.length;
  }

  function buildTags() {
    var box = el("tags"), tags = collectTags(), i, b;
    box.innerHTML = "";
    for (i = 0; i < tags.length; i++) {
      b = document.createElement("span");
      b.className = "tag";
      b.setAttribute("data-tag", tags[i]);
      b.appendChild(document.createTextNode(tags[i]));
      (function (btn, name) {
        btn.onclick = function () {
          var pos = state.tags.indexOf(name);
          if (pos === -1) state.tags.push(name); else state.tags.splice(pos, 1);
          refreshTags();
          render();
        };
      })(b, tags[i]);
      box.appendChild(b);
    }
  }

  function refreshTags() {
    var box = el("tags"), i;
    for (i = 0; i < box.childNodes.length; i++) {
      var t = box.childNodes[i];
      if (t.nodeType === 1 && t.getAttribute("data-tag")) {
        t.className = state.tags.indexOf(t.getAttribute("data-tag")) !== -1 ? "tag on" : "tag";
      }
    }
  }

  function buildSortSelect() {
    var sel = el("sort"), items = [
      ["name", T.sortName], ["size", T.sortSize], ["date", T.sortDate],
      ["ver", T.sortVer], ["seed", T.sortSeed], ["gt", T.sortGt]
    ], i, o;
    sel.innerHTML = "";
    for (i = 0; i < items.length; i++) {
      o = document.createElement("option");
      o.value = items[i][0];
      o.appendChild(document.createTextNode(items[i][1]));
      sel.appendChild(o);
    }
    sel.value = state.sort;
  }

  function buildLangSelect() {
    var sel = el("lang"), i, o;
    sel.innerHTML = "";
    for (i = 0; i < LANGS.length; i++) {
      o = document.createElement("option");
      o.value = LANGS[i].code;
      o.appendChild(document.createTextNode(LANGS[i].label));
      sel.appendChild(o);
    }
    sel.value = state.lang;
  }

  function applyLang() {
    T = TRANS[state.lang];
    el("search").placeholder = T.search;
    el("dirBtn").textContent = state.dir === 1 ? T.dirAsc : T.dirDesc;
    el("aboutBox").textContent = T.about;
    el("aboutBtn").title = "About";
    el("footData").textContent = T.footData;
    el("footDb").textContent = T.footDb;
    el("footGen").textContent = T.footGen;
    buildSortSelect();
  }

  el("search").onkeyup = function () { state.q = this.value; render(); };
  el("sort").onchange = function () { state.sort = this.value; render(); };
  el("dirBtn").onclick = function () {
    state.dir = state.dir === 1 ? -1 : 1;
    this.textContent = state.dir === 1 ? T.dirAsc : T.dirDesc;
    render();
  };
  el("aboutBtn").onclick = function () {
    var box = el("aboutBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
  };
  el("lang").onchange = function () {
    state.lang = this.value;
    saveLang();
    applyLang();
    render();
  };

  state.lang = detectLang();
  el("total").textContent = WORLDS_ALL.length;
  el("dbver").textContent = WORLDS.dbVersion;
  el("gen").textContent = WORLDS.generated;
  buildLangSelect();
  applyLang();
  buildTags();
  render();
})();