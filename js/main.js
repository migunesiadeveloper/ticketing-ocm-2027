(function () {
  "use strict";

  var C = window.OCM_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- period (WIB) ---------- */
  // ?preview=early|regular|closed lets the committee review each state.
  var preview = new URLSearchParams(location.search).get("preview");
  var now = Date.now();
  var period = preview || (now <= Date.parse(C.EARLY_END) ? "early"
    : now <= Date.parse(C.REGULAR_END) ? "regular" : "closed");
  document.documentElement.dataset.period = period;

  var currency = "IDR";

  function money(pair) {
    if (currency === "USD") return "USD " + pair[1].toLocaleString("en-US");
    return "IDR " + pair[0].toLocaleString("en-US");
  }

  /* ---------- workshop prices ---------- */
  function renderWorkshopPrices() {
    $$("[data-price]").forEach(function (el) {
      var w = C.workshops[el.dataset.price];
      var active = period === "regular" ? "regular" : "early";
      var other = active === "early" ? "regular" : "early";
      el.innerHTML =
        '<span class="price-label">' + (active === "early" ? "Early rate · until 30 June 2027" : "Regular rate · until 14 August 2027") + "</span>" +
        '<span class="price-now">' + money(w[active]) + "</span>" +
        '<span class="price-other">' + (other === "regular" ? "Regular " : "Early ") + money(w[other]) + "</span>";
    });
  }

  /* ---------- lecture table ---------- */
  function renderLectureRows() {
    var body = $("[data-reg-rows]");
    body.innerHTML = C.lecture.map(function (row) {
      var same = row.early[0] === row.regular[0];
      return '<tr>' +
        '<th scope="row">' + row.name + '</th>' +
        '<td data-col="early" data-label="Early · until 30 Jun">' + money(row.early) + '</td>' +
        '<td data-col="regular" data-label="Regular · until 14 Aug">' + (same ? '<span class="same">' + money(row.regular) + '</span>' : money(row.regular)) + '</td>' +
        '<td><button class="btn btn-small" data-register-lecture="' + row.id + '">Register</button></td>' +
        '</tr>';
    }).join("");

    $$("[data-col]").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.col === period);
    });
  }

  function renderPeriodLabel() {
    var el = $("[data-period-label]");
    var mob = $("[data-mobile-cta-note]");
    if (period === "early") {
      el.innerHTML = "<b>Early rate</b> applies now";
    } else if (period === "regular") {
      el.innerHTML = "<b>Regular rate</b> applies now";
      if (mob) mob.textContent = "Regular rate until 14 Aug";
    } else {
      el.textContent = "Registration has closed";
      if (mob) mob.textContent = "Registration closed";
    }
  }

  /* ---------- countdown to early deadline ---------- */
  function renderCountdown() {
    var el = $("[data-countdown]");
    if (!el) return;
    if (period !== "early") { $("[data-deadline]").hidden = true; return; }
    var days = Math.ceil((Date.parse(C.EARLY_END) - now) / 86400000);
    el.textContent = days > 1 ? days + " days left" : "last day";
  }

  /* ---------- currency toggle ---------- */
  $$("[data-currency]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currency = btn.dataset.currency;
      $$("[data-currency]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      renderWorkshopPrices();
      renderLectureRows();
    });
  });

  /* ---------- registration dialog ---------- */
  var regDialog = $("#reg-dialog");

  function openRegistration(item) {
    var code = item && item.ticket[period === "regular" ? "regular" : "early"];
    $("#reg-dialog-title").textContent = item ? item.name : "Registration";
    var body = $("[data-reg-body]");

    if (period === "closed") {
      body.innerHTML = '<div class="reg-soon"><p class="reg-soon-title">Registration has closed</p><p>Please contact the secretariat for on-site arrangements.</p></div>';
    } else if (!C.EVENT_CODE || !code) {
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
    var w = e.target.closest("[data-register]");
    if (w) { openRegistration(C.workshops[w.dataset.register]); return; }
    var l = e.target.closest("[data-register-lecture]");
    if (l) {
      var row = C.lecture.filter(function (r) { return r.id === l.dataset.registerLecture; })[0];
      openRegistration({ name: "Scientific Lecture – " + row.name, ticket: row.ticket });
    }
  });

  /* ---------- welcome messages: inline "continue reading" ---------- */
  $$(".msg-more").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var body = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") !== "true";
      body.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show less" : "Continue reading";
    });
  });

  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) {
      if (e.target === d || e.target.closest("[data-close]")) d.close();
    });
    d.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
      var body = $("[data-reg-body]", d);
      if (body) body.innerHTML = ""; // stop the embed when closed
    });
  });

  /* ---------- tabs (programme days, welcome messages) ---------- */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus({ preventScroll: true });
      // keep the chosen chip visible inside a scrolling strip, without moving the page
      var l = tab.offsetLeft - list.offsetLeft, r = l + tab.offsetWidth;
      if (l < list.scrollLeft || r > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: Math.max(0, l - 16), behavior: "smooth" });
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) select(tabs[(i + d + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- mobile nav ---------- */
  var toggle = $(".nav-toggle");
  var mnav = $("#mobile-nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.hidden = !open;
    document.body.classList.toggle("nav-open", open);
  }
  toggle.addEventListener("click", function () { setNav(mnav.hidden); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mnav.hidden) setNav(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (m) { if (m.matches) setNav(false); });
  $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });

  /* ---------- header + sticky CTA state ---------- */
  var header = $(".site-header");
  var cta = $(".mobile-cta");
  var reg = $("#registration");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    // phones: the bar appears once the buttons under the banner are out of view
    var bar = $(".hero-bar").getBoundingClientRect();
    var r = reg.getBoundingClientRect();
    var atReg = r.top < window.innerHeight && r.bottom > 0;
    cta.classList.toggle("is-visible", bar.bottom < 0 && !atReg);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  renderWorkshopPrices();
  renderLectureRows();
  renderPeriodLabel();
  renderCountdown();
  onScroll();
})();
