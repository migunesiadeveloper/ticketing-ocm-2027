(function () {
  "use strict";

  var C = window.OCM_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var params = new URLSearchParams(location.search);
  // ?preview=early|regular|closed lets the committee review each state.
  var preview = params.get("preview");
  var now = Date.now();
  var slug = (params.get("category") || "").trim().toLowerCase();
  var cat = C.categories.filter(function (c) { return c.slug === slug; })[0];

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  // The API sends WIB datetimes without an offset ("2027-06-30T23:59:00").
  function wib(s) {
    if (!s) return null;
    var t = Date.parse(/(Z|[+-]\d\d:?\d\d)$/i.test(s) ? s : s + "+07:00");
    return isNaN(t) ? null : t;
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(t) {
    var d = new Date(t + 7 * 3600000); // show in WIB
    return d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }

  /* ---------- currency: USD = IDR price / today's rate ----------
   * Same rate source as the Migunesia embed (PayPal checkout). Excludes the
   * PayPal fee on purpose: the embed shows that fee before payment. The USD
   * button only appears once the rate has loaded. */
  var currency = "IDR";
  var usdRate = null;

  function money(idr) {
    if (idr == null) return "–";
    if (currency === "USD" && usdRate) return "&asymp; USD " + Math.round(idr / usdRate).toLocaleString("en-US");
    return "IDR " + Number(idr).toLocaleString("en-US");
  }

  /* ---------- chooser (no or unknown ?category) ---------- */
  if (!cat) {
    $('[data-view="chooser"]').hidden = false;
    $("[data-cats]").innerHTML = C.categories.map(function (c) {
      return '<li><a class="cat-card" href="?category=' + encodeURIComponent(c.slug) + '">' +
        '<span class="cat-name">' + esc(c.name) + "</span>" +
        (c.sub ? '<span class="cat-sub-small">' + esc(c.sub) + "</span>" : "") +
        '<span class="cat-go" aria-hidden="true">&rarr;</span></a></li>';
    }).join("");
  } else {
    document.title = "OCM 2027 · Registration · " + cat.name;
    $('[data-view="category"]').hidden = false;
    $("[data-cat-name]").textContent = cat.name;
    var subEl = $("[data-cat-sub]");
    if (cat.sub) subEl.textContent = cat.sub; else subEl.hidden = true;
    // "bundles include the lecture" only matters where bundles are sold
    $("[data-bundle-note]").hidden = !cat.items.some(function (item) { return item.kind !== "lecture"; });
  }

  /* ---------- tickets: live price / period / quota from the dashboard ---------- */
  var tickets = {};        // code -> API ticket, or { missing: true } when the code is unknown
  var loaded = false;      // true once every request has finished
  var apiFailed = false;   // a request failed (network / server): fall back to config dates

  function codesOf(item) {
    var out = [];
    [item.ticket.early, item.ticket.regular].forEach(function (c) { if (c && out.indexOf(c) < 0) out.push(c); });
    return out;
  }

  // Where one ticket stands right now.
  function phase(t) {
    if (!t || t.missing) return "na";
    if (t.is_active !== "Y") return "off";
    var s = wib(t.period_start), e = wib(t.period_end);
    if (s && now < s) return "upcoming";
    if (e && now > e) return "ended";
    if (t.quota > 0 && t.quota_used >= t.quota) return "soldout";
    return "open";
  }

  // What a card shows: state, the ticket code to register with, price rows.
  function resolve(item) {
    var codes = codesOf(item);
    if (!codes.length) return { state: "soon", prices: [] };

    var ec = item.ticket.early || codes[0];
    var rc = item.ticket.regular || codes[0];
    var single = ec === rc;
    var e = tickets[ec], r = tickets[rc];

    var prices = single
      ? [{ label: "", idr: e && !e.missing ? e.price : null, code: ec }]
      : [
          { label: "Early Bird", note: e && wib(e.period_end) ? "until " + fmtDate(wib(e.period_end)) : "", idr: e && !e.missing ? e.price : null, code: ec },
          { label: "Regular", note: r && wib(r.period_start) ? "from " + fmtDate(wib(r.period_start)) : "", idr: r && !r.missing ? r.price : null, code: rc }
        ];

    var state, code;
    if (preview === "closed") {
      state = "closed";
    } else if (preview === "early" || preview === "regular") {
      code = preview === "early" ? ec : rc;
      state = phase(tickets[code]) === "off" ? "off" : "open";
    } else if (loaded && !apiFailed) {
      var phases = codes.map(function (c) { return phase(tickets[c]); });
      var open = phases.indexOf("open");
      if (open >= 0) { state = "open"; code = codes[open]; }
      else if (phases.indexOf("soldout") >= 0) state = "soldout";
      else if (phases.indexOf("upcoming") >= 0) state = "upcoming";
      else if (phases.every(function (p) { return p === "off" || p === "na"; })) state = "off";
      else state = "closed";
    } else {
      // loading, or the API could not be reached: pick by the config dates
      var p = now <= Date.parse(C.EARLY_END) ? "early" : now <= Date.parse(C.REGULAR_END) ? "regular" : "closed";
      if (p === "closed") state = "closed";
      else { state = "open"; code = p === "early" ? ec : rc; }
    }

    prices.forEach(function (row) { row.current = !single && state === "open" && row.code === code; });
    return { state: state, code: code, prices: prices };
  }

  var STATUS = {
    soon: "Coming soon",
    soldout: "Sold out",
    upcoming: "Opens soon",
    closed: "Registration closed",
    off: "Not available"
  };

  function renderItems() {
    if (!cat) return;
    $("[data-items]").innerHTML = cat.items.map(function (item, i) {
      var r = resolve(item);
      var priceHtml = r.prices.length
        ? '<dl class="t-prices">' + r.prices.map(function (row) {
            return '<div' + (row.current ? ' class="is-current"' : "") + ">" +
              "<dt>" + (row.label ? esc(row.label) + (row.note ? " <small>" + esc(row.note) + "</small>" : "") : '<span class="sr">Price</span>') + "</dt>" +
              "<dd>" + (loaded || row.idr != null ? money(row.idr) : '<span class="t-loading">Loading…</span>') + "</dd></div>";
          }).join("") + "</dl>"
        : "";
      var action = r.state === "open"
        ? '<button class="btn btn-primary" data-register="' + i + '">Register</button>'
        : '<span class="t-status">' + STATUS[r.state] + "</span>";
      return '<li class="ticket t-' + esc(item.kind) + (r.state === "open" ? "" : " is-unavailable") + '">' +
        '<div class="t-main">' +
          "<h3>" + (item.label ? '<span class="tag">' + esc(item.label) + "</span> " : "") + esc(item.title) + "</h3>" +
          (item.includes ? '<p class="t-inc">' + esc(item.includes) + "</p>" : "") +
          (item.dates ? '<p class="t-dates">' + esc(item.dates) + "</p>" : "") +
          (item.addon ? '<p class="t-addon">' + esc(item.addon) + "</p>" : "") +
        "</div>" +
        '<div class="t-side">' + priceHtml + action + "</div>" +
      "</li>";
    }).join("");
  }

  function renderHotels() {
    if (!cat) return;
    var nights = cat.hotelNights.slice().sort();
    $("[data-hotels]").innerHTML = C.hotels.map(function (h) {
      return '<article class="hotel"><p class="hotel-kicker">' + esc(h.kicker) + "</p><h4>" + esc(h.name) + "</h4><dl>" +
        nights.map(function (n) {
          return "<div><dt>" + n + " nights <span>" + esc(C.stays[n]) + "</span></dt><dd>" + money(h.price[n]) + "</dd></div>";
        }).join("") + "</dl></article>";
    }).join("");
  }

  // Header line: which rate applies now (from the first Early ticket's dates).
  function renderPeriodLabel() {
    if (!cat) return;
    var el = $("[data-period-label]");
    var earlyEnd = Date.parse(C.EARLY_END);
    var regularEnd = Date.parse(C.REGULAR_END);
    cat.items.some(function (item) {
      var e = tickets[item.ticket.early];
      if (!item.ticket.early || item.ticket.early === item.ticket.regular || !e || e.missing) return false;
      earlyEnd = wib(e.period_end) || earlyEnd;
      return true;
    });
    var p = preview || (now <= earlyEnd ? "early" : now <= regularEnd ? "regular" : "closed");
    // one price all along (e.g. Resident, Medical Student): no Early/Regular line
    var hasTiers = cat.items.some(function (item) { return item.ticket.early && item.ticket.regular && item.ticket.early !== item.ticket.regular; });
    el.hidden = !hasTiers && p !== "closed";
    if (p === "early") {
      var days = Math.ceil((earlyEnd - now) / 86400000);
      el.innerHTML = "<b>Early Bird rate</b> until " + fmtDate(earlyEnd) +
        (preview ? "" : ' <span class="countdown">' + (days > 1 ? days + " days left" : "last day") + "</span>");
    } else if (p === "regular") {
      el.innerHTML = "<b>Regular rate</b> applies now";
    } else {
      el.textContent = "Registration has closed";
    }
  }

  function renderFxNote() {
    var el = $("[data-fx-rate]");
    if (el) el.textContent = usdRate ? " Converted at today's rate: 1 USD ≈ IDR " + Math.round(usdRate).toLocaleString("en-US") + "." : "";
  }

  function renderAll() { renderItems(); renderHotels(); renderPeriodLabel(); }

  if (cat) {
    $(".currency").hidden = true; // until today's rate has loaded
    renderAll();

    var all = [];
    cat.items.forEach(function (item) { codesOf(item).forEach(function (c) { if (all.indexOf(c) < 0) all.push(c); }); });
    Promise.all(all.map(function (code) {
      return fetch(C.API_BASE + "tickets/" + encodeURIComponent(code))
        .then(function (res) {
          if (res.status === 404) { tickets[code] = { missing: true }; return; }
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().then(function (t) { tickets[code] = t; });
        })
        .catch(function () { apiFailed = true; });
    })).then(function () { loaded = true; renderAll(); });

    fetch(C.FX_URL)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var idr = data && data.rates && Number(data.rates.IDR);
        if (!(idr > 0)) return;
        usdRate = idr;
        $(".currency").hidden = false;
        renderFxNote();
      })
      .catch(function () { /* IDR only */ });

    $$("[data-currency]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currency = btn.dataset.currency;
        $$("[data-currency]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        renderItems();
        renderHotels();
      });
    });
  }

  /* ---------- registration dialog ---------- */
  var regDialog = $("#reg-dialog");

  function openRegistration(title, code) {
    $("#reg-dialog-title").textContent = title || "Registration";
    var body = $("[data-reg-body]");

    if (!C.EVENT_CODE || !code) {
      body.innerHTML =
        '<div class="reg-soon">' +
        '<p class="reg-soon-title">Registration opens soon</p>' +
        '<p>The registration link will be announced shortly. Meanwhile, reach the secretariat at ' +
        '<a href="https://wa.me/6281331332774" target="_blank" rel="noopener">WhatsApp</a> or ' +
        '<a href="mailto:ocm2027official@gmail.com">ocm2027official@gmail.com</a>.</p></div>';
    } else {
      var url = C.EMBED_BASE + "?event=" + encodeURIComponent(C.EVENT_CODE) +
        "&type=app_2&ticket=" + encodeURIComponent(code);
      body.innerHTML = '<iframe src="' + url + '" title="Registration form" allow="payment; clipboard-write" loading="eager"></iframe>' +
        '<a class="reg-newtab" href="' + url + '" target="_blank" rel="noopener">Having trouble? Open the form in a new tab</a>';
    }
    regDialog.showModal();
    document.body.classList.add("dialog-open");
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-register]");
    if (!b || !cat) return;
    var item = cat.items[Number(b.dataset.register)];
    var r = resolve(item);
    if (r.state !== "open") { renderItems(); return; } // changed since render (e.g. sold out)
    openRegistration((item.label ? item.label + " " : "") + item.title + " · " + cat.name, r.code);
  });


  /* ---------- closing the registration dialog ----------
   * While the embed form is open, every way out (× button, Esc, Android back)
   * asks first, so a buyer does not lose an order by accident and start a
   * second one. The "opens soon"/"closed" messages close straight away. */
  var regConfirm = $("[data-reg-confirm]", regDialog);
  var allowClose = false;

  function embedOpen() { return !!$("[data-reg-body] iframe", regDialog); }

  function askClose() {
    if (!embedOpen()) { allowClose = true; regDialog.close(); return; }
    regConfirm.hidden = false;
    $("[data-confirm-stay]", regConfirm).focus();
  }

  function stay() { regConfirm.hidden = true; }

  regDialog.addEventListener("click", function (e) {
    if (e.target.closest("[data-confirm-stay]")) { stay(); return; }
    if (e.target.closest("[data-confirm-close]")) { allowClose = true; regDialog.close(); return; }
    if (e.target.closest("[data-close]")) askClose();
  });

  // Esc / Android back
  regDialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    if (!regConfirm.hidden) stay(); else askClose();
  });

  regDialog.addEventListener("close", function () {
    if (!allowClose && embedOpen()) {
      // the browser closed it without asking (e.g. repeated Esc): reopen, form intact
      regDialog.showModal();
      askClose();
      return;
    }
    allowClose = false;
    regConfirm.hidden = true;
    document.body.classList.remove("dialog-open");
    $("[data-reg-body]", regDialog).innerHTML = ""; // stop the embed when closed
  });

  // refresh / closing the tab while the form is open
  window.addEventListener("beforeunload", function (e) {
    if (regDialog.open && embedOpen()) { e.preventDefault(); e.returnValue = ""; }
  });
})();
