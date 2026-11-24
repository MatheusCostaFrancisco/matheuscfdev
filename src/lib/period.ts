const MONTHS: Readonly<Record<string, string>> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
  Fev: "02",
  Abr: "04",
  Mai: "05",
  Ago: "08",
  Set: "09",
  Out: "10",
  Dez: "12",
};

/** Converts "Feb 2025" into "2025-02". Returns null for non-date text such as "Present". */
export function toDateTime(label: string): string | null {
  const match = /^([A-Z][a-z]{2}) (\d{4})$/.exec(label);
  if (!match) return null;
  const month = MONTHS[match[1]];
  return month ? `${match[2]}-${month}` : null;
}
