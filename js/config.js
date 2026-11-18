/*
 * OCM 2027 – registration config.
 * The only file to edit when the event is set up in the Migunesia dashboard.
 *
 * Each "Register" button opens the Migunesia embed for ONE ticket:
 *   {EMBED_BASE}/?event={EVENT_CODE}&type=app_2&ticket={ticket code}
 * Early and Regular are separate tickets (different sale periods), so each
 * item has two ticket codes. The page picks the one for the current period
 * (Asia/Jakarta time).
 *
 * Leave EVENT_CODE empty while registration is not open: buttons then show a
 * "registration opens soon" message instead of the form.
 */
window.OCM_CONFIG = {
  EMBED_BASE: "https://embed.migunesia-ticket.com/",
  EVENT_CODE: "Ctq0tguRwzdc",

  // WIB (UTC+7). Early ends at the end of this day; regular runs until REGULAR_END.
  EARLY_END: "2027-06-30T23:59:59+07:00",
  REGULAR_END: "2027-08-14T23:59:59+07:00",

  // USD on the page = IDR price / today's rate from this source (same as the embed).
  FX_URL: "https://open.er-api.com/v6/latest/USD",

  // prices: [IDR, USD reference]. The USD reference (flyer figures) is shown
  // only when today's rate cannot be loaded.
  workshops: {
    spine:  { name: "Spine Bundle (APSS) + 2-Day Symposium", early: [22500000, 1235], regular: [25000000, 1372], ticket: { early: "69CnRTTWynveto5Pq9Yj6aAKhqiTVEOsPAzF5dHKI8XMObHVu89dQ4tkV2p7t7SHzLstL6sqDhp", regular: "mfQDEjObCY7n9fI2PC9Wd7uSuKsZlBHBhaZuceG8Culuy0nYbSlqnZhDurV2oBxpEQobOxaiySQ" } },
    trauma: { name: "Cadaveric Workshop – Trauma",          early: [6000000, 330],    regular: [7000000, 384],    ticket: { early: "7KFePWoES44ykBROp6h3C8PhFo6JoxgQmqurQCDa45p0WNJyBeAw1Il93aIl2b24ez0DHsgbAzH", regular: "Zbq2YSDOkLX7NjB1HYl0kuAJtN3M4oOEfVAojIe93NqvDRJ78952g8fG4xmCnA7R6eOBeMezoUT" } },
    pain:   { name: "Cadaveric Workshop – Pain Intervention", early: [6500000, 358],  regular: [7500000, 412],    ticket: { early: "qEAfAeAxvsUPin5txcyiixt0bEkHleaJ7atpE7K1dNr9izntjZEB1tajByjqwdBzvmJytRGIemT", regular: "a67icZ2TafFWkLt2FQ5Ynb4WqkT6nHkZnXMZ4sQC4CQykm2fuvqK8glDiWEU3cH9ghda8QjAAO8" } }
  },

  lecture: [
    { id: "sub",  name: "Sub-Specialist",        early: [4500000, 248], regular: [5500000, 302], ticket: { early: "Axq4ueTZQTP1srt5vlfNNRDpdV4O0G1D14OVBQCx80tnVCRmIyK8hrdsXGdTxHt2j8Ur1FwpcBF", regular: "rVrkTVPFqliMffDfiRYs2jJeP3SC9FEKnYgjlkp2uCgb9GTgajsg7DIxKNxJaNi4z68Qowo5EXq" } },
    { id: "cf",   name: "Clinical Fellow",       early: [4500000, 248], regular: [5500000, 302], ticket: { early: "WntzKyNarVbUqEEefoAFAJ78821qkA5Drak5Vk0gU1QE0xU1lqNt9RwvHN3rPrVqKxEYGTk5LXI", regular: "hzlmQwV9NrnvNQzb4CFggAD1TnWTZgjf0ugXqri0hGulzQ8TJfu3RzLpOzDr5bASSr6fyQ8nLtB" } },
    { id: "go",   name: "General Orthopaedic",   early: [3500000, 192], regular: [4500000, 248], ticket: { early: "AI0V4KGi22wfWrAEIco9azuWQeFRl430QACVf1gOEPVp1qDgmoWYZZYcUFw77sjnRZF9lQdMbCG", regular: "KX2MWgaApAzYLtNTrW6qyx5r48LNPBzVWGDoOfmFN66AytQI2yngLaijCGnrk40PDe5n57u9ymL" } },
    { id: "gp",   name: "General Practitioner",  early: [1500000, 84],  regular: [2000000, 110], ticket: { early: "s0qb7KWcBvcc91BS7WhMU5L0jiAfWLiGlmGneu7VjlZlh5Fk6OpHtpZitcJ2LkjXyPcpazc2rZW", regular: "ifX46hSHEPPKB9OcKFVNKdBeF7Bc9vojag21No560YdApXdQGeBDBlHTl3QoEvyXtkToH5nPlsO" } },
    { id: "res",  name: "Resident",              early: [1000000, 55],  regular: [1000000, 55],  ticket: { early: "BEV6Ea0OTgogTEfyXbuYmzMw0fdmnYXBH2CeoUG8eXwDrJLpKn6JbU7EIFX1wnqWMsjjolwjTK7", regular: "BEV6Ea0OTgogTEfyXbuYmzMw0fdmnYXBH2CeoUG8eXwDrJLpKn6JbU7EIFX1wnqWMsjjolwjTK7" } },
    { id: "med",  name: "Medical Student",       early: [750000, 42],   regular: [750000, 42],   ticket: { early: "usqmjV5Fte756F2Xfe751Oqp7WOuLHqGfYjB1rJ3ct0Z6maHaburppUsYd1NfQOgryAnKRdEFQb", regular: "usqmjV5Fte756F2Xfe751Oqp7WOuLHqGfYjB1rJ3ct0Z6maHaburppUsYd1NfQOgryAnKRdEFQb" } }
  ]
};
