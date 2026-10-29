/** The chapters, in order: their anchors, numerals and titles. The header, the contents sheet and the page all read this. */
export const chapters = {
  place: { id: "the-place", no: "I", short: "The Place", title: "A Place for the Everyday Extraordinary" },
  coffee: { id: "coffee", no: "II", short: "Coffee", title: "The Coffee Department" },
  breakfast: { id: "breakfast", no: "III", short: "Breakfast", title: "The Breakfast Department" },
  lunch: { id: "lunch", no: "IV", short: "Lunch", title: "Lunch, Please" },
  little: { id: "little-things", no: "V", short: "Little Things", title: "The Little Things" },
  welcome: { id: "welcome", no: "VI", short: "Welcome", title: "A Very Welcome Table" },
  visitors: { id: "visitors", no: "VII", short: "Visitors", title: "Word from Our Visitors" },
  menu: { id: "menu", no: "VIII", short: "Menu", title: "The Menu" },
  visit: { id: "find-us", no: "IX", short: "Find Us", title: "Find Us in Amble" },
} as const;
