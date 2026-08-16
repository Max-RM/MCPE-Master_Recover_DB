/* MCPE Master Recover DB - test shell. ES5, no fetch, works from file:// */
(function () {
  "use strict";

  var WORLDS_ALL = WORLDS.worlds;

  var state = {
    q: "",
    sort: "name",
    dir: 1,
    tags: []
  };

  function el(id) { return document.getElementById(id); }

  function stripSection(s) {
    return String(s || "").replace(/\u00a7./g, "");
  }

  function gameTypeName(gt) {
    var map = { 0: "Выживание", 1: "Креатив", 2: "Приключения", 3: "Зритель" };
    if (gt === null || gt === undefined) return "?";
    return map[gt] ? map[gt] : "Тип " + gt;
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
      a.appendChild(document.createTextNode("Скачать"));
      div.appendChild(a);

      var h = document.createElement("div");
      h.className = "name";
      h.appendChild(document.createTextNode(stripSection(w.n)));
      div.appendChild(h);

      meta = document.createElement("div");
      meta.className = "meta";
      parts = ["Вес мира: " + (w.sizeHuman || "?")];
      if (w.d) parts.push("Дата создания: " + w.d);
      if (w.seed !== null && w.seed !== undefined) parts.push("Сид: " + w.seed);
      parts.push("Режим игры: " + gameTypeName(w.gt));
      meta.appendChild(document.createTextNode(parts.join(" | ")));
      div.appendChild(meta);

      var ver = document.createElement("div");
      ver.className = "meta";
      var mcv = w.mcv || w.lov;
      ver.appendChild(document.createTextNode(
        "Минимальная совместимая версия игры: " + (mcv || "неопределённая") +
        (w.lov ? " | Последний раз открывалась в игре версии: " + w.lov : "")
      ));
      div.appendChild(ver);

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
      e.appendChild(document.createTextNode("Ничего не найдено"));
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

  el("search").onkeyup = function () { state.q = this.value; render(); };
  el("sort").onchange = function () { state.sort = this.value; render(); };
  el("dirBtn").onclick = function () {
    state.dir = state.dir === 1 ? -1 : 1;
    this.textContent = state.dir === 1 ? "По возрастанию" : "По убыванию";
    render();
  };
  el("aboutBtn").onclick = function () {
    var box = el("aboutBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
  };

  el("total").textContent = WORLDS_ALL.length;
  el("dbver").textContent = WORLDS.dbVersion;
  el("gen").textContent = WORLDS.generated;
  buildTags();
  render();
})();