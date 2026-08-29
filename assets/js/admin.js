/* ==========================================================================
   Precision FC — squad manager (add / edit / remove players)
   --------------------------------------------------------------------------
   The site is static, so there is no server to save to. This panel keeps a
   working copy of the squad in THIS browser, and gives you an updated
   data.js to download when you are happy with it. Commit that file and the
   change is live for everyone.

   To open it, add ?admin=1 to the squad page URL:
       squad.html?admin=1
   It then stays open on this browser until you press "Close manager".
   Visitors never see it.
   ========================================================================== */

(function () {
  "use strict";

  var FLAG = "pfc.admin";
  var POS = [
    ["GK", "Goalkeeper"],
    ["DEF", "Defender"],
    ["WING", "Winger"],
    ["PIVOT", "Pivot"],
    ["UNI", "Universal"]
  ];

  function flagOn() {
    try { return window.localStorage.getItem(FLAG) === "1"; } catch (e) { return false; }
  }
  function setFlag(v) {
    try {
      if (v) window.localStorage.setItem(FLAG, "1");
      else window.localStorage.removeItem(FLAG);
    } catch (e) {}
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------- serialise back to data.js ---------------- */

  var TEMPLATE_COMMENT =
    "\n  // ,{\n" +
    "  //   no: 1,\n" +
    '  //   name: "Full Name",\n' +
    '  //   pos: "GK",\n' +
    '  //   role: "Short description, or leave as an empty string",\n' +
    '  //   photo: "assets/img/players/full-name.png",\n' +
    "  //   captain: false,\n" +
    "  //   joined: 2019\n" +
    "  // }\n";

  function serialise(list) {
    var body = list.map(function (p) {
      return "  {\n" +
        "    no: " + (p.no == null || p.no === "" ? "null" : Number(p.no)) + ",\n" +
        "    name: " + JSON.stringify(p.name) + ",\n" +
        "    pos: " + JSON.stringify(p.pos || "UNI") + ",\n" +
        "    role: " + JSON.stringify(p.role || "") + ",\n" +
        "    photo: " + (p.photo ? JSON.stringify(p.photo) : "null") + ",\n" +
        "    captain: " + (p.captain ? "true" : "false") + ",\n" +
        "    joined: " + (p.joined == null || p.joined === "" ? "null" : Number(p.joined)) + "\n" +
        "  }";
    }).join(",\n");
    return "const SQUAD = [\n" + body + "\n" + TEMPLATE_COMMENT + "];";
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function exportDataFile(list, say) {
    var block = serialise(list);
    fetch("assets/js/data.js", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (text) {
        var re = /const SQUAD = \[[\s\S]*?\n\];/;
        if (!re.test(text)) throw new Error("Could not find the SQUAD list in data.js");
        download("data.js", text.replace(re, block), "text/javascript;charset=utf-8");
        say("data.js downloaded. Replace assets/js/data.js with it, then commit.");
      })
      .catch(function () {
        // opened from the file system, or data.js not reachable — hand over
        // just the SQUAD block instead.
        download("squad-block.js", block, "text/javascript;charset=utf-8");
        say("Downloaded squad-block.js — paste it over the SQUAD list in data.js.");
      });
  }

  /* ---------------- image handling ---------------- */

  function shrink(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var W = 600, H = 800;
        var c = document.createElement("canvas");
        c.width = W; c.height = H;
        var ctx = c.getContext("2d");
        // cover-crop, anchored to the top so heads survive
        var scale = Math.max(W / img.width, H / img.height);
        var w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (W - w) / 2, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  /* ---------------- UI ---------------- */

  var state = { editing: null };

  function build() {
    var host = document.getElementById("squad-grid");
    if (!host || !window.PFC) return;

    /* toolbar --------------------------------------------------------- */
    var bar = document.createElement("div");
    bar.className = "admin-bar";
    bar.innerHTML =
      '<div class="admin-bar-title"><strong>Squad manager</strong>' +
      '<span id="admin-count"></span></div>' +
      '<div class="admin-bar-actions">' +
      '<button type="button" class="btn btn--lime" id="admin-add">Add player</button>' +
      '<button type="button" class="btn btn--ghost" id="admin-export">Download data.js</button>' +
      '<button type="button" class="btn btn--ghost" id="admin-reset">Reset to file</button>' +
      '<button type="button" class="btn btn--ghost" id="admin-close">Close manager</button>' +
      "</div>" +
      '<p class="admin-note" id="admin-note"></p>';

    var filterRow = document.getElementById("squad-filter");
    (filterRow ? filterRow.parentNode : host.parentNode).insertBefore(bar, filterRow || host);

    /* modal ----------------------------------------------------------- */
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "admin-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="modal-backdrop" data-close></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">' +
      '<h3 id="admin-modal-title">Add player</h3>' +
      '<form id="admin-form">' +
      '<div class="field-row">' +
      '<label class="field field--sm"><span>Shirt no.</span>' +
      '<input type="number" name="no" min="0" max="99" inputmode="numeric" placeholder="10"></label>' +
      '<label class="field"><span>Name</span>' +
      '<input type="text" name="name" required maxlength="60" placeholder="Full name"></label>' +
      "</div>" +
      '<div class="field-row">' +
      '<label class="field"><span>Position</span><select name="pos">' +
      POS.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + "</option>"; }).join("") +
      "</select></label>" +
      '<label class="field field--sm check"><span>Captain</span>' +
      '<input type="checkbox" name="captain"></label>' +
      "</div>" +
      '<label class="field"><span>Role <em>(optional)</em></span>' +
      '<input type="text" name="role" maxlength="60" placeholder="e.g. Club top scorer"></label>' +
      '<label class="field"><span>Photo path <em>(optional)</em></span>' +
      '<input type="text" name="photo" placeholder="assets/img/players/name.png"></label>' +
      '<div class="field"><span>…or upload one</span>' +
      '<input type="file" name="file" accept="image/*">' +
      '<p class="hint">Uploads are cropped to 3:4 and embedded straight into data.js. ' +
      "Handy for one or two, but a file in the players folder keeps data.js small.</p></div>" +
      '<div class="modal-actions">' +
      '<button type="submit" class="btn btn--lime">Save player</button>' +
      '<button type="button" class="btn btn--ghost" data-close>Cancel</button>' +
      '<button type="button" class="btn btn--danger" id="admin-delete" hidden>Remove player</button>' +
      "</div></form></div>";
    document.body.appendChild(modal);

    var form = modal.querySelector("#admin-form");
    var noteEl = bar.querySelector("#admin-note");
    var deleteBtn = modal.querySelector("#admin-delete");

    function say(msg) {
      noteEl.textContent = msg || "";
      noteEl.hidden = !msg;
    }

    function refreshCount() {
      var n = window.PFC.getSquad().length;
      bar.querySelector("#admin-count").textContent =
        n + (n === 1 ? " player" : " players") +
        (window.PFC.isLocal() ? " · unsaved changes in this browser" : " · matching data.js");
      bar.classList.toggle("is-dirty", window.PFC.isLocal());
    }

    function openModal(player) {
      state.editing = player || null;
      modal.querySelector("#admin-modal-title").textContent = player ? "Edit player" : "Add player";
      form.reset();
      deleteBtn.hidden = !player;
      deleteBtn.textContent = "Remove player";
      deleteBtn.dataset.armed = "";
      if (player) {
        form.no.value = player.no == null ? "" : player.no;
        form.name.value = player.name || "";
        form.pos.value = player.pos || "UNI";
        form.role.value = player.role || "";
        form.photo.value = player.photo || "";
        form.captain.checked = !!player.captain;
      }
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setTimeout(function () { form.name.focus(); }, 30);
    }

    function closeModal() {
      modal.hidden = true;
      state.editing = null;
      document.body.style.overflow = "";
    }

    /* events ---------------------------------------------------------- */

    bar.querySelector("#admin-add").addEventListener("click", function () { openModal(null); });

    bar.querySelector("#admin-export").addEventListener("click", function () {
      exportDataFile(window.PFC.getSquad(), say);
    });

    bar.querySelector("#admin-reset").addEventListener("click", function () {
      window.PFC.resetSquad();
      refreshCount();
      say("Back to whatever data.js says. Local changes discarded.");
    });

    bar.querySelector("#admin-close").addEventListener("click", function () {
      setFlag(false);
      location.href = location.pathname;
    });

    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    form.file.addEventListener("change", function () {
      var f = form.file.files && form.file.files[0];
      if (!f) return;
      say("Processing image…");
      shrink(f, function (dataUrl) {
        if (!dataUrl) { say("That image could not be read."); return; }
        form.photo.value = dataUrl;
        say("Image ready (" + Math.round(dataUrl.length / 1024) + " KB embedded).");
      });
    });

    deleteBtn.addEventListener("click", function () {
      if (!state.editing) return;
      if (deleteBtn.dataset.armed !== "1") {
        deleteBtn.dataset.armed = "1";
        deleteBtn.textContent = "Tap again to confirm";
        return;
      }
      var name = state.editing.name;
      window.PFC.setSquad(window.PFC.getSquad().filter(function (p) { return p.name !== name; }));
      closeModal();
      refreshCount();
      say(name + " removed. Their goals stay in the match log — download data.js to keep this.");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      if (!name) return;

      var player = {
        no: form.no.value === "" ? null : Number(form.no.value),
        name: name,
        pos: form.pos.value,
        role: form.role.value.trim(),
        photo: form.photo.value.trim() || null,
        captain: form.captain.checked,
        joined: state.editing ? (state.editing.joined == null ? null : state.editing.joined) : null
      };

      var list = window.PFC.getSquad();
      var clash = list.filter(function (p) {
        return p.name !== (state.editing && state.editing.name) &&
          p.no != null && player.no != null && +p.no === +player.no;
      })[0];

      if (state.editing) {
        var was = state.editing.name;
        list = list.map(function (p) { return p.name === was ? player : p; });
      } else {
        if (list.some(function (p) { return p.name.toLowerCase() === name.toLowerCase(); })) {
          say(name + " is already in the squad.");
          return;
        }
        list.push(player);
      }

      if (player.captain) {
        list = list.map(function (p) {
          return p.name === player.name ? p : Object.assign({}, p, { captain: false });
        });
      }

      window.PFC.setSquad(list);
      closeModal();
      refreshCount();
      say(
        (state.editing ? "Saved " : "Added ") + name +
        (clash ? " (number " + player.no + " is also on " + clash.name + ")" : "") +
        ". Download data.js to make it permanent."
      );
    });

    /* per-card edit buttons ------------------------------------------- */

    function decorate() {
      document.querySelectorAll("#squad-grid .player").forEach(function (card) {
        if (card.querySelector(".player-edit")) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "player-edit";
        btn.textContent = "Edit";
        btn.setAttribute("aria-label", "Edit " + card.dataset.player);
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var p = window.PFC.getSquad().filter(function (x) { return x.name === card.dataset.player; })[0];
          if (p) openModal(p);
        });
        card.appendChild(btn);
      });
      var add = document.querySelector("#squad-grid .player-add");
      if (add && !add.dataset.wired) {
        add.dataset.wired = "1";
        add.style.cursor = "pointer";
        add.addEventListener("click", function () { openModal(null); });
      }
    }

    document.addEventListener("pfc:squad-rendered", decorate);
    decorate();
    refreshCount();
    document.body.classList.add("admin-on");
  }

  /* ---------------- boot ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(location.search);
    if (params.get("admin") === "1") setFlag(true);
    if (!flagOn()) return;
    try {
      build();
    } catch (err) {
      console.error("Squad manager failed to start:", err);
    }
  });
})();
