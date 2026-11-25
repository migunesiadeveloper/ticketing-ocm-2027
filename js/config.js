/*
 * OCM 2027 – mini registration page config.
 *
 * Link per doctor category (used on the committee website):
 *   https://ticketing-ocm-2027.pages.dev/?category=consultant
 *   https://ticketing-ocm-2027.pages.dev/?category=general-ortho
 *   https://ticketing-ocm-2027.pages.dev/?category=gp
 *   https://ticketing-ocm-2027.pages.dev/?category=resident
 *   https://ticketing-ocm-2027.pages.dev/?category=student
 * Without ?category (or an unknown one) the page shows the category chooser.
 *
 * PRICE, SALE PERIOD (Early/Regular), SOLD OUT and ACTIVE come live from the
 * Migunesia dashboard via the API, per ticket code. Change those in the
 * dashboard, not here. This file only says WHICH ticket appears in WHICH
 * category, plus the display text of each card.
 *
 * PACKAGE CONTENTS ("includes" line on a card): the ticket's "Deskripsi tiket"
 * in the dashboard wins when filled; the `includes` text below is only the
 * fallback for tickets without a description.
 *
 * Early and Regular are separate tickets in the dashboard, so each card has two
 * codes. When both are the same code (one price all along), put it twice.
 * A code left "" shows the card as "Coming soon" (ticket not created yet).
 *
 * Each "Register" button opens the embed for ONE ticket:
 *   {EMBED_BASE}?event={EVENT_CODE}&type=app_2&ticket={code}
 */
(function () {
  // Ticket codes from the dashboard. Every doctor category has its own tickets
  // (the committee reports sales per category), even when the content is the same.
  var T = {
    // ---- Orthopaedic Consultants (Sub-Specialist / Clinical Fellow) ----
    con_spine:   { early: "69CnRTTWynveto5Pq9Yj6aAKhqiTVEOsPAzF5dHKI8XMObHVu89dQ4tkV2p7t7SHzLstL6sqDhp", regular: "mfQDEjObCY7n9fI2PC9Wd7uSuKsZlBHBhaZuceG8Culuy0nYbSlqnZhDurV2oBxpEQobOxaiySQ" },
    // SPINE ICL: on hold (committee still confirming, 24 Nov). Card hidden below.
    con_icl:     { early: "", regular: "" },
    con_trauma1: { early: "ojdGMeEAMLoS15Lz2r75c41jU2452iN2UdCC2wJaNK4ogUtb3uPxF1fKtfMD1ievlen3nEtxIeV", regular: "y0StGafhFSNqVM3dspgLBc2uEOmz5nKuvLKIvRSbzBxLrlgsPPUFaE6xh0znYETOPvxoRpiVnRN" },
    con_trauma2: { early: "Z3hvdurt8xsjsmPDtTfGnpUAjzkezrSePFwo1by88AlcqmhbGhnaQzHeyKJp1m9e9MSuAXQWszj", regular: "WJjGirA96Krcp8CfhbvrXCAWtAUPaP49YY3KiUOwoYoNDxWvGvJ8Bo9TfF5cRUuT2vQNuAPYquP" },
    con_trauma3: { early: "zZAN5Zn5enubTgm10KjKuKaZ7mOvtG2OXkPwexFz3gvj6L3yZ88q68VuNSCW4JH4eG9Y5yuA1yC", regular: "T5qjDUWTXBln09XXwrugzc2kDj1UeozVCEuFs49b5C1kGYAuAbJSIdOP0FgZUo9EfOdmxdzVfm6" },
    con_trauma4: { early: "crVbzwESg2D59GfBebZv9cU5dsH8sCRgXrNl7CdWtSXKcGPiE5AqEfAujbRWmMB1Uy0UnzFXIBf", regular: "mmGWyliSLiIqRiha2ix6RHFeEJVrHbFTm37BM20fkIsdGemGe6k8nQYJecS0WZUq45mGChiXLNb" },
    con_pain:    { early: "qEAfAeAxvsUPin5txcyiixt0bEkHleaJ7atpE7K1dNr9izntjZEB1tajByjqwdBzvmJytRGIemT", regular: "a67icZ2TafFWkLt2FQ5Ynb4WqkT6nHkZnXMZ4sQC4CQykm2fuvqK8glDiWEU3cH9ghda8QjAAO8" },
    // One Lecture ticket for Sub-Specialist + Clinical Fellow (client, 24 Nov):
    // the former "Sub-Specialist" tickets, renamed in the dashboard.
    con_lec:     { early: "Axq4ueTZQTP1srt5vlfNNRDpdV4O0G1D14OVBQCx80tnVCRmIyK8hrdsXGdTxHt2j8Ur1FwpcBF", regular: "rVrkTVPFqliMffDfiRYs2jJeP3SC9FEKnYgjlkp2uCgb9GTgajsg7DIxKNxJaNi4z68Qowo5EXq" },

    // ---- General Orthopaedics / Other Specialists ----
    // Own tickets (own price) for Trauma/Pain, same content as Consultants.
    go_trauma1:  { early: "RHqDP5SElaY3jLaq6N81cwZavT0wVdMSLHH5sSWE7kjIJh4iIMT4sA1VP1N4lnSeFBa8JlfiU8I", regular: "NoT8udNwxbJHxSlCrKIqnwB1j1r95lEdxTjS0GBAXm6dInQam6SznI4gvwdZuA5SOF4x9heO9Sq" },
    go_trauma2:  { early: "xSmxbl3ZbNXiq22Gzef7KlPDxJaTSF71JfBnXGqquhQWC1Ls4KtAiqb9OWH5AowBcN8dvdeEp2X", regular: "xPXg42581V94GFIMhK5NauxucODfXgJCzMSjc9TIicUy0FyeQmOncvYB5jy4kSz7rM7N0mztySD" },
    go_trauma3:  { early: "Tm2Uv8o0Mq1lBGs6RTjoYCJjVbubxMOSAwmn8gxOKM0mtVFK7aCdYQDF00Xab2qF61c88uOTHW7", regular: "O0xN7RxAT3LKDFkkQq9EwSSWQMr3KmxO0fkvvOqgilA35CHDm20246J1gJdPVdTiFDoeznE9oNW" },
    go_trauma4:  { early: "hoXNXYCuLzEEwNbZdnwI16mlEcsWt8GDMgnjgRHJVFUukuK00NiQMJ2uesM1RpFyy5kbtKPb6Dq", regular: "HevoUlJ5gt0ApOI904OiimB8pIky3DtdouKbgH1l5qYlvdGkBSFp9PZFSzUK5cEkROrIrlQtqsg" },
    go_pain:     { early: "OlrsllOQh3j9x0dJKFtGFSxHtI8Un798KdAH4tua3EhPJ93j7wHicVksNN7CTb5rgnO3qyf8VtF", regular: "q5lLzMsUAkH4PLam2QreKv9xpoU7Baa3iMRd75sHyoSlHixqWNkSRG6O2OeEq0sOdB22ChsBOgt" },
    go_lec:      { early: "AI0V4KGi22wfWrAEIco9azuWQeFRl430QACVf1gOEPVp1qDgmoWYZZYcUFw77sjnRZF9lQdMbCG", regular: "KX2MWgaApAzYLtNTrW6qyx5r48LNPBzVWGDoOfmFN66AytQI2yngLaijCGnrk40PDe5n57u9ymL" },

    // ---- General Practitioner / Resident / Medical Student ----
    gp_lec:      { early: "s0qb7KWcBvcc91BS7WhMU5L0jiAfWLiGlmGneu7VjlZlh5Fk6OpHtpZitcJ2LkjXyPcpazc2rZW", regular: "ifX46hSHEPPKB9OcKFVNKdBeF7Bc9vojag21No560YdApXdQGeBDBlHTl3QoEvyXtkToH5nPlsO" },
    res_lec:     { early: "BEV6Ea0OTgogTEfyXbuYmzMw0fdmnYXBH2CeoUG8eXwDrJLpKn6JbU7EIFX1wnqWMsjjolwjTK7", regular: "BEV6Ea0OTgogTEfyXbuYmzMw0fdmnYXBH2CeoUG8eXwDrJLpKn6JbU7EIFX1wnqWMsjjolwjTK7" },
    med_lec:     { early: "usqmjV5Fte756F2Xfe751Oqp7WOuLHqGfYjB1rJ3ct0Z6maHaburppUsYd1NfQOgryAnKRdEFQb", regular: "usqmjV5Fte756F2Xfe751Oqp7WOuLHqGfYjB1rJ3ct0Z6maHaburppUsYd1NfQOgryAnKRdEFQb" }
  };

  // Card texts (same programme for every category that offers it).
  var P = {
    spine:   { kind: "spine",  label: "SPINE",  title: "Bundling Package", includes: "Webinar + Live Surgery + Cadaveric Workshop certified by APSS + Scientific Lecture", dates: "11–14 Aug 2027", addon: "Optional add-on in the form: inside the OK Room during Live Surgery (limited seats)" },
    icl:     { kind: "spine",  label: "SPINE",  title: "Interactive Course Lecture (ICL)", dates: "14 Aug 2027" },
    trauma1: { kind: "trauma", label: "TRAUMA", title: "Bundling Package 01", includes: "Cadaveric Workshop + Dry Workshop + Webinar + Scientific Lecture", dates: "11, 13–14 Aug 2027" },
    trauma2: { kind: "trauma", label: "TRAUMA", title: "Bundling Package 02", includes: "Cadaveric Workshop + Webinar + Scientific Lecture", dates: "11, 13–14 Aug 2027" },
    trauma3: { kind: "trauma", label: "TRAUMA", title: "Bundling Package 03", includes: "Dry Workshop + Webinar + Scientific Lecture", dates: "11, 13–14 Aug 2027" },
    trauma4: { kind: "trauma", label: "TRAUMA", title: "Bundling Package 04", includes: "Webinar + Scientific Lecture", dates: "11, 13–14 Aug 2027" },
    pain:    { kind: "pain",   label: "PAIN",   title: "Bundling Package", includes: "Cadaveric & USG Workshop + Scientific Lecture", dates: "11, 13–14 Aug 2027" },
    lecture: { kind: "lecture", label: "",      title: "Scientific Lecture", includes: "2-day scientific symposium at The Westin Surabaya", dates: "13–14 Aug 2027" }
  };

  function card(programme, ticket, extra) {
    var c = {};
    for (var k in programme) c[k] = programme[k];
    for (var e in (extra || {})) c[e] = extra[e];
    c.ticket = ticket;
    return c;
  }

  window.OCM_CONFIG = {
    EMBED_BASE: "https://embed.migunesia-ticket.com/",
    API_BASE: "https://api.migunesia-ticket.com/api/v1/",
    EVENT_CODE: "Ctq0tguRwzdc",

    // "Back" button: the committee website page that lists the categories, so
    // a participant who opened the wrong category can go back and pick again.
    // TEMPORARY link (25 Nov 2026), the committee will send the final one.
    // Leave "" to hide the button (the bottom link then opens our own chooser).
    BACK_URL: "https://claudiastefanus.wixstudio.com/website-10/blank-12",

    // USD on the page = IDR price / today's rate from this source (same as the embed).
    FX_URL: "https://open.er-api.com/v6/latest/USD",

    // Only used when the API cannot be reached (to label Early vs Regular).
    EARLY_END: "2027-06-30T23:59:59+07:00",
    REGULAR_END: "2027-08-14T23:59:59+07:00",

    categories: [
      {
        slug: "consultant",
        name: "Orthopaedic Consultants",
        sub: "Sub-Specialist / Clinical Fellow",
        hotelNights: [5, 3],
        items: [
          card(P.spine, T.con_spine),
          // card(P.icl, T.con_icl),  // on hold, see T.con_icl
          card(P.trauma1, T.con_trauma1),
          card(P.trauma2, T.con_trauma2),
          card(P.trauma3, T.con_trauma3),
          card(P.trauma4, T.con_trauma4),
          card(P.pain, T.con_pain),
          card(P.lecture, T.con_lec, { title: "Scientific Lecture – Orthopaedic Consultants" })
        ]
      },
      {
        slug: "general-ortho",
        name: "General Orthopaedics",
        sub: "Other Specialists",
        hotelNights: [5, 3],
        items: [
          card(P.trauma1, T.go_trauma1),
          card(P.trauma2, T.go_trauma2),
          card(P.trauma3, T.go_trauma3),
          card(P.trauma4, T.go_trauma4),
          card(P.pain, T.go_pain),
          card(P.lecture, T.go_lec, { title: "Scientific Lecture – General Orthopaedics" })
        ]
      },
      { slug: "gp",       name: "General Practitioner", hotelNights: [3], items: [card(P.lecture, T.gp_lec)] },
      { slug: "resident", name: "Resident",             hotelNights: [3], items: [card(P.lecture, T.res_lec)] },
      { slug: "student",  name: "Medical Student",      hotelNights: [3], items: [card(P.lecture, T.med_lec)] }
    ],

    // Information only: the room is booked as an add-on inside the form, where
    // the dashboard price applies. If the hotel price changes in the dashboard,
    // change it here too (IDR).
    hotels: [
      { name: "The Westin Surabaya",     kicker: "Main venue hotel", price: { 5: 13500000, 3: 8000000 } },
      { name: "Four Points by Sheraton", kicker: "Partner hotel",    price: { 5: 8500000,  3: 5000000 } }
    ],
    stays: {
      5: "10–15 Aug 2027",
      3: "12–15 Aug 2027"
    }
  };
})();
