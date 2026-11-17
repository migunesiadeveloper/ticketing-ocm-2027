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
  EVENT_CODE: "",

  // WIB (UTC+7). Early ends at the end of this day; regular runs until REGULAR_END.
  EARLY_END: "2027-06-30T23:59:59+07:00",
  REGULAR_END: "2027-08-14T23:59:59+07:00",

  // prices: [IDR, USD reference]
  workshops: {
    spine:  { name: "Spine Bundle (APSS) + 2-Day Symposium", early: [22500000, 1235], regular: [25000000, 1372], ticket: { early: "", regular: "" } },
    trauma: { name: "Cadaveric Workshop – Trauma",          early: [6000000, 330],    regular: [7000000, 384],    ticket: { early: "", regular: "" } },
    pain:   { name: "Cadaveric Workshop – Pain Intervention", early: [6500000, 358],  regular: [7500000, 412],    ticket: { early: "", regular: "" } }
  },

  lecture: [
    { id: "sub",  name: "Sub-Specialist",        early: [4500000, 248], regular: [5500000, 302], ticket: { early: "", regular: "" } },
    { id: "cf",   name: "Clinical Fellow",       early: [4500000, 248], regular: [5500000, 302], ticket: { early: "", regular: "" } },
    { id: "go",   name: "General Orthopaedic",   early: [3500000, 192], regular: [4500000, 248], ticket: { early: "", regular: "" } },
    { id: "gp",   name: "General Practitioner",  early: [1500000, 84],  regular: [2000000, 110], ticket: { early: "", regular: "" } },
    { id: "res",  name: "Resident",              early: [1000000, 55],  regular: [1000000, 55],  ticket: { early: "", regular: "" } },
    { id: "med",  name: "Medical Student",       early: [750000, 42],   regular: [750000, 42],   ticket: { early: "", regular: "" } }
  ]
};
