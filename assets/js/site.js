/* ==========================================================================
   Precision FC — rendering.
   Reads CLUB / SQUAD / FIXTURES / STORY from data.js. You should not need to
   edit this file to update the site's content.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- helpers ---------------- */

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  function parseDate(s) {
    if (!s) return null;
    var p = String(s).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fmtDate(s) {
    var d = parseDate(s);
    if (!d) return "TBC";
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtDay(s) {
    var d = parseDate(s);
    return d ? DAYS[d.getDay()] : "";
  }
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function el(id) { return document.getElementById(id); }

  /* ---------------- derived data ---------------- */

  var played = FIXTURES.filter(function (f) { return f.status === "played"; })
    .sort(function (a, b) { return (a.date > b.date) - (a.date < b.date); });

  var upcoming = FIXTURES.filter(function (f) { return f.status === "upcoming"; })
    .sort(function (a, b) { return (a.date > b.date) - (a.date < b.date); });

  function score(f) {
    var gf = 0, ga = 0;
    (f.events || []).forEach(function (e) { e.team === "PFC" ? gf++ : ga++; });
    return { gf: gf, ga: ga };
  }
  function result(f) {
    var s = score(f);
    return s.gf > s.ga ? "W" : s.gf < s.ga ? "L" : "D";
  }

  var totals = played.reduce(function (t, f) {
    var s = score(f), r = result(f);
    t.p++; t.gf += s.gf; t.ga += s.ga;
    t[r === "W" ? "w" : r === "D" ? "d" : "l"]++;
    if (s.ga === 0) t.cs++;
    return t;
  }, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, cs: 0 });
  totals.gd = totals.gf - totals.ga;
  totals.ppg = totals.p ? ((totals.w * 3 + totals.d) / totals.p) : 0;
  totals.winPct = totals.p ? Math.round((totals.w / totals.p) * 100) : 0;

  var form = played.slice(-5).map(result);

  // goals / assists / appearances per named player
  var byPlayer = {};
  function bucket(name) {
    if (!byPlayer[name]) byPlayer[name] = { name: name, goals: 0, assists: 0 };
    return byPlayer[name];
  }
  played.forEach(function (f) {
    (f.events || []).forEach(function (e) {
      if (e.team !== "PFC") return;
      if (e.player) bucket(e.player).goals++;
      if (e.assist) bucket(e.assist).assists++;
    });
  });
  var scorers = Object.keys(byPlayer).map(function (k) { return byPlayer[k]; })
    .sort(function (a, b) { return b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name); });

  function statsFor(name) {
    return byPlayer[name] || { goals: 0, assists: 0 };
  }

  // record per opponent
  var byOpponent = {};
  played.forEach(function (f) {
    var o = byOpponent[f.opponent] || (byOpponent[f.opponent] = { name: f.opponent, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 });
    var s = score(f), r = result(f);
    o.p++; o.gf += s.gf; o.ga += s.ga;
    o[r === "W" ? "w" : r === "D" ? "d" : "l"]++;
  });
  var opponents = Object.keys(byOpponent).map(function (k) { return byOpponent[k]; })
    .sort(function (a, b) { return b.p - a.p || a.name.localeCompare(b.name); });

  /* ---------------- chrome: nav, footer, draft flag ---------------- */

  function chrome() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var y = el("year");
    if (y) y.textContent = new Date().getFullYear();

    document.querySelectorAll("[data-club-name]").forEach(function (n) { n.textContent = CLUB.name; });
    document.querySelectorAll("[data-club-ground]").forEach(function (n) { n.textContent = CLUB.ground; });
    document.querySelectorAll("[data-club-city]").forEach(function (n) { n.textContent = CLUB.city; });
    document.querySelectorAll("[data-club-founded]").forEach(function (n) { n.textContent = CLUB.founded; });

    if (CLUB.draft) {
      var b = document.createElement("div");
      b.setAttribute("role", "note");
      b.style.cssText =
        "background:#c7f03f;color:#071523;font:600 13px/1.5 " +
        "system-ui,sans-serif;padding:10px 24px;text-align:center;";
      b.innerHTML =
        "<strong>Draft data.</strong> Match dates, scores and goal times in " +
        "<code>assets/js/data.js</code> are placeholders. Replace them, then set " +
        "<code>draft: false</code> to remove this notice.";
      document.body.insertBefore(b, document.body.firstChild);
    }
  }

  /* ---------------- components ---------------- */

  function formHTML(list) {
    if (!list.length) return '<span style="color:var(--ink-3)">No matches yet</span>';
    return list.map(function (r) {
      return '<span class="pill pill--' + r.toLowerCase() + '" title="' +
        (r === "W" ? "Win" : r === "D" ? "Draw" : "Loss") + '">' + r + "</span>";
    }).join("");
  }

  function matchHTML(f, opts) {
    opts = opts || {};
    var s = score(f);
    var isUp = f.status === "upcoming";
    var home = f.home;
    var left = home ? CLUB.name : f.opponent;
    var right = home ? f.opponent : CLUB.name;
    var line = isUp ? "" :
      (home ? s.gf + " &ndash; " + s.ga : s.ga + " &ndash; " + s.gf);

    var meta = [
      isUp ? "" : result(f) === "W" ? "Win" : result(f) === "D" ? "Draw" : "Loss",
      f.comp,
      home ? CLUB.ground : "Away"
    ].filter(Boolean).join(" &middot; ");

    var detail = "";
    if (!isUp && opts.expandable !== false) {
      var evs = (f.events || []).slice().sort(function (a, b) { return (a.minute || 0) - (b.minute || 0); });
      var rows = evs.length ? evs.map(function (e) {
        var who = e.player ? esc(e.player) : "<em>Scorer not recorded</em>";
        var team = e.team === "PFC" ? CLUB.short : f.opponent;
        var assist = e.assist ? " <small>assist " + esc(e.assist) + "</small>" : "";
        return '<li><span class="min">' + (e.minute != null ? e.minute + "&prime;" : "&mdash;") + '</span>' +
          '<span class="dot' + (e.team === "PFC" ? " dot--pfc" : "") + '"></span>' +
          '<span class="who">' + who + ' <small>&mdash; ' + esc(team) + "</small>" + assist + "</span></li>";
      }).join("") : '<li><span class="min">&mdash;</span><span class="dot"></span><span class="who"><em>No goal detail recorded for this match.</em></span></li>';
      detail =
        '<div class="match-detail">' +
        (f.note ? "<p style=\"margin-bottom:14px;color:var(--ink-2);font-size:14.5px\">" + esc(f.note) + "</p>" : "") +
        '<ul class="timeline">' + rows + "</ul></div>";
    }

    return '<article class="match' + (isUp ? " match--upcoming" : "") + '">' +
      '<button class="match-main" type="button"' + (detail ? ' aria-expanded="false"' : " disabled") + ">" +
      '<span class="match-date"><b>' + fmtDate(f.date) + "</b>" + (isUp ? (f.kickoff ? "Kick-off " + esc(f.kickoff) : fmtDay(f.date)) : fmtDay(f.date)) + "</span>" +
      '<span class="match-teams">' + esc(left) + " <span style=\"color:var(--ink-3);font-weight:400\">v</span> " + esc(right) +
      "<small>" + meta + "</small></span>" +
      (isUp ? '<span class="score score--upcoming">Upcoming</span>' : '<span class="score">' + line + "</span>") +
      '<span class="chev" aria-hidden="true">' + (detail ? "&#9660;" : "") + "</span>" +
      "</button>" + detail + "</article>";
  }

  function wireMatches(root) {
    (root || document).querySelectorAll(".match .match-main").forEach(function (btn) {
      if (btn.disabled) return;
      btn.addEventListener("click", function () {
        var card = btn.closest(".match");
        var open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------------- page: home ---------------- */

  function home() {
    var next = el("next-match");
    if (next) {
      if (upcoming.length) {
        var f = upcoming[0];
        next.innerHTML =
          '<p class="eyebrow">Next fixture</p>' +
          '<div class="vs"><strong>' + esc(CLUB.short) + " v " + esc(f.opponent) + "</strong>" +
          '<em>' + esc(f.comp || "Fixture") + "</em></div>" +
          '<dl class="kv">' +
          "<div><dt>Date</dt><dd>" + fmtDay(f.date) + " " + fmtDate(f.date) + "</dd></div>" +
          (f.kickoff ? "<div><dt>Kick-off</dt><dd>" + esc(f.kickoff) + "</dd></div>" : "") +
          "<div><dt>Venue</dt><dd>" + esc(f.home ? CLUB.ground : "Away") + "</dd></div>" +
          "</dl>";
      } else {
        next.innerHTML =
          '<p class="eyebrow">Next fixture</p>' +
          '<div class="vs"><strong>Nothing scheduled</strong></div>' +
          "<p style=\"color:rgba(255,255,255,.7);margin:0\">Add the next match to <code>data.js</code> and it appears here.</p>";
      }
    }

    var fh = el("form-home");
    if (fh) fh.innerHTML = formHTML(form);

    var st = el("home-stats");
    if (st) {
      st.innerHTML = [
        [totals.p, "Matches played"],
        [totals.w, "Wins"],
        [totals.gf, "Goals scored"],
        [totals.gd > 0 ? "+" + totals.gd : totals.gd, "Goal difference"]
      ].map(function (r) {
        return '<div class="stat"><b>' + r[0] + "</b><span>" + r[1] + "</span></div>";
      }).join("");
    }

    var rec = el("recent-results");
    if (rec) {
      var last = played.slice(-3).reverse();
      rec.innerHTML = last.length
        ? last.map(function (f) { return matchHTML(f); }).join("")
        : '<p style="color:var(--ink-2)">No results recorded yet.</p>';
      wireMatches(rec);
    }

    var ts = el("top-scorers-home");
    if (ts) {
      var top = scorers.filter(function (s) { return s.goals > 0; }).slice(0, 5);
      ts.innerHTML = top.length
        ? '<table class="data"><thead><tr><th class="rank">#</th><th>Player</th><th class="num">Goals</th><th class="num">Assists</th></tr></thead><tbody>' +
          top.map(function (s, i) {
            return "<tr><td class=\"rank\">" + (i + 1) + '</td><td class="name">' + esc(s.name) +
              '</td><td class="num">' + s.goals + '</td><td class="num">' + s.assists + "</td></tr>";
          }).join("") + "</tbody></table>"
        : '<p style="color:var(--ink-2)">No goalscorers recorded yet.</p>';
    }
  }

  /* ---------------- page: fixtures ---------------- */

  function fixtures() {
    var up = el("list-upcoming");
    if (up) {
      up.innerHTML = upcoming.length
        ? upcoming.map(function (f) { return matchHTML(f); }).join("")
        : '<p style="color:var(--ink-2)">No fixtures scheduled. Add one to <code>assets/js/data.js</code>.</p>';
      wireMatches(up);
    }

    var res = el("list-results");
    if (res) {
      res.innerHTML = played.length
        ? played.slice().reverse().map(function (f) { return matchHTML(f); }).join("")
        : '<p style="color:var(--ink-2)">No results recorded yet.</p>';
      wireMatches(res);
    }

    var sum = el("season-summary");
    if (sum) {
      sum.innerHTML = [
        [totals.p, "Played"],
        [totals.w, "Won"],
        [totals.d, "Drawn"],
        [totals.l, "Lost"],
        [totals.gf, "For"],
        [totals.ga, "Against"],
        [totals.gd > 0 ? "+" + totals.gd : totals.gd, "Difference"],
        [totals.winPct + "%", "Win rate"]
      ].map(function (r) {
        return '<div class="stat"><b>' + r[0] + "</b><span>" + r[1] + "</span></div>";
      }).join("");
    }

    var fo = el("form-fixtures");
    if (fo) fo.innerHTML = formHTML(form);

    var op = el("opponent-table");
    if (op) {
      op.innerHTML = opponents.length
        ? '<table class="data"><thead><tr><th>Opponent</th><th class="num">P</th><th class="num">W</th><th class="num">D</th><th class="num">L</th><th class="num">GF</th><th class="num">GA</th></tr></thead><tbody>' +
          opponents.map(function (o) {
            return '<tr><td class="name">' + esc(o.name) + '</td><td class="num">' + o.p +
              '</td><td class="num">' + o.w + '</td><td class="num">' + o.d + '</td><td class="num">' + o.l +
              '</td><td class="num">' + o.gf + '</td><td class="num">' + o.ga + "</td></tr>";
          }).join("") + "</tbody></table>"
        : '<p style="color:var(--ink-2)">No opponents recorded yet.</p>';
    }
  }

  /* ---------------- page: squad ---------------- */

  function squad() {
    var grid = el("squad-grid");
    if (!grid) return;

    function cards(filter) {
      var list = SQUAD.filter(function (p) { return filter === "ALL" || p.pos === filter; });
      if (!list.length) {
        return '<div class="card" style="grid-column:1/-1;color:var(--ink-2)">No players in this position yet.</div>';
      }
      return list.map(function (p) {
        var s = statsFor(p.name);
        return '<article class="player' + (p.captain ? " player--captain" : "") + '">' +
          (p.no != null ? '<span class="num" aria-hidden="true">' + esc(p.no) + "</span>" : "") +
          '<p class="pos">' + esc(p.pos || "") + (p.captain ? " &middot; Captain" : "") + "</p>" +
          "<h3>" + esc(p.name) + "</h3>" +
          '<p class="role">' + esc(p.role || "") + "</p>" +
          '<div class="pstats"><div><b>' + s.goals + "</b>Goals</div><div><b>" + s.assists + "</b>Assists</div></div>" +
          "</article>";
      }).join("") +
      '<article class="card" style="border-style:dashed">' +
      '<strong style="display:block;margin-bottom:6px;font-size:15px">Add a player</strong>' +
      '<p style="color:var(--ink-2);font-size:13.5px;line-height:1.55;margin:0">' +
      "Copy the commented block in <code>data.js</code> into the <code>SQUAD</code> list. " +
      "Goals and assists fill in from the match log.</p></article>";
    }

    grid.innerHTML = cards("ALL");

    var bar = el("squad-filter");
    if (bar) {
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        grid.innerHTML = cards(b.dataset.pos);
      });
    }

    var tbl = el("squad-table");
    if (tbl) {
      var rows = scorers.filter(function (s) { return s.goals || s.assists; });
      tbl.innerHTML = rows.length
        ? '<table class="data"><thead><tr><th class="rank">#</th><th>Player</th><th class="num">Goals</th><th class="num">Assists</th><th class="num">Contributions</th></tr></thead><tbody>' +
          rows.map(function (s, i) {
            return '<tr><td class="rank">' + (i + 1) + '</td><td class="name">' + esc(s.name) +
              '</td><td class="num">' + s.goals + '</td><td class="num">' + s.assists +
              '</td><td class="num">' + (s.goals + s.assists) + "</td></tr>";
          }).join("") + "</tbody></table>"
        : '<p style="color:var(--ink-2)">No goal contributions recorded yet.</p>';
    }
  }

  /* ---------------- page: about ---------------- */

  function about() {
    var s = el("story");
    if (s && typeof STORY !== "undefined") {
      s.innerHTML = STORY.map(function (b) {
        return "<h3>" + esc(b.heading) + "</h3><p>" + esc(b.body) + "</p>";
      }).join("");
    }
    var f = el("club-facts");
    if (f) {
      var rows = [
        ["Founded", CLUB.founded],
        ["Sport", CLUB.sport],
        ["Home", CLUB.ground],
        ["Based in", CLUB.city],
        ["Rivalry", CLUB.rival ? "El Clasico v " + CLUB.rival : "&mdash;"],
        ["Matches logged", totals.p],
        ["Record", totals.w + "W " + totals.d + "D " + totals.l + "L"],
        ["Goals for / against", totals.gf + " / " + totals.ga]
      ];
      f.innerHTML = rows.map(function (r) {
        return "<li><span>" + r[0] + "</span><b>" + r[1] + "</b></li>";
      }).join("");
    }
  }

  /* ---------------- boot ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    try {
      chrome();
      home();
      fixtures();
      squad();
      about();
    } catch (err) {
      console.error("Precision FC site error:", err);
    }
  });
})();
