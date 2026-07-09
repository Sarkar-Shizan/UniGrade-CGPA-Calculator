import type { University } from "@/types";

/*
 * Bangladesh-only university database.
 *
 * Important:
 * - This file stores letter grades, grade points, and marks ranges where available.
 * - AIUB, NSU, IUB, UIU and BUBT use dedicated grading presets below.
 * - Other institutions use the common Bangladesh 4.0 scale as a fallback.
 * - Short names are appended automatically, for example University of Dhaka (DU).
 * - Display priority is curated only to place major universities first within
 *   each division; it is not an official university ranking.
 */

/* ---------------- grading presets ---------------- */

const bdScale4 = [
  { grade: "A+", point: 4.0, minPercent: 80, maxPercent: 100 },
  { grade: "A", point: 3.75, minPercent: 75, maxPercent: 79.99 },
  { grade: "A-", point: 3.5, minPercent: 70, maxPercent: 74.99 },
  { grade: "B+", point: 3.25, minPercent: 65, maxPercent: 69.99 },
  { grade: "B", point: 3.0, minPercent: 60, maxPercent: 64.99 },
  { grade: "B-", point: 2.75, minPercent: 55, maxPercent: 59.99 },
  { grade: "C+", point: 2.5, minPercent: 50, maxPercent: 54.99 },
  { grade: "C", point: 2.25, minPercent: 45, maxPercent: 49.99 },
  { grade: "D", point: 2.0, minPercent: 40, maxPercent: 44.99 },
  { grade: "F", point: 0.0, minPercent: 0, maxPercent: 39.99 },
];

const aiubScale4 = [
  { grade: "A+", point: 4.0, minPercent: 90, maxPercent: 100 },
  { grade: "A", point: 3.75, minPercent: 85, maxPercent: 89.99 },
  { grade: "B+", point: 3.5, minPercent: 80, maxPercent: 84.99 },
  { grade: "B", point: 3.25, minPercent: 75, maxPercent: 79.99 },
  { grade: "C+", point: 3.0, minPercent: 70, maxPercent: 74.99 },
  { grade: "C", point: 2.75, minPercent: 65, maxPercent: 69.99 },
  { grade: "D+", point: 2.5, minPercent: 60, maxPercent: 64.99 },
  { grade: "D", point: 2.25, minPercent: 50, maxPercent: 59.99 },
  { grade: "F", point: 0.0, minPercent: 0, maxPercent: 49.99 },
];

const nsuScale4 = [
  { grade: "A", point: 4.0, minPercent: 93, maxPercent: 100 },
  { grade: "A-", point: 3.7, minPercent: 90, maxPercent: 92.99 },
  { grade: "B+", point: 3.3, minPercent: 87, maxPercent: 89.99 },
  { grade: "B", point: 3.0, minPercent: 83, maxPercent: 86.99 },
  { grade: "B-", point: 2.7, minPercent: 80, maxPercent: 82.99 },
  { grade: "C+", point: 2.3, minPercent: 77, maxPercent: 79.99 },
  { grade: "C", point: 2.0, minPercent: 73, maxPercent: 76.99 },
  { grade: "C-", point: 1.7, minPercent: 70, maxPercent: 72.99 },
  { grade: "D+", point: 1.3, minPercent: 67, maxPercent: 69.99 },
  { grade: "D", point: 1.0, minPercent: 60, maxPercent: 66.99 },
  { grade: "F", point: 0.0, minPercent: 0, maxPercent: 59.99 },
];

/* IUB grade points are retained; marks ranges are not specified in this dataset. */
const iubScale4 = [
  { grade: "A", point: 4.0 },
  { grade: "A-", point: 3.7 },
  { grade: "B+", point: 3.3 },
  { grade: "B", point: 3.0 },
  { grade: "B-", point: 2.7 },
  { grade: "C+", point: 2.3 },
  { grade: "C", point: 2.0 },
  { grade: "C-", point: 1.7 },
  { grade: "D+", point: 1.3 },
  { grade: "D", point: 1.0 },
  { grade: "F", point: 0.0 },
];

const uiuScale4 = [
  { grade: "A", point: 4.0, minPercent: 90, maxPercent: 100 },
  { grade: "A-", point: 3.67, minPercent: 86, maxPercent: 89.99 },
  { grade: "B+", point: 3.33, minPercent: 82, maxPercent: 85.99 },
  { grade: "B", point: 3.0, minPercent: 78, maxPercent: 81.99 },
  { grade: "B-", point: 2.67, minPercent: 74, maxPercent: 77.99 },
  { grade: "C+", point: 2.33, minPercent: 70, maxPercent: 73.99 },
  { grade: "C", point: 2.0, minPercent: 66, maxPercent: 69.99 },
  { grade: "C-", point: 1.67, minPercent: 62, maxPercent: 65.99 },
  { grade: "D+", point: 1.33, minPercent: 58, maxPercent: 61.99 },
  { grade: "D", point: 1.0, minPercent: 55, maxPercent: 57.99 },
  { grade: "F", point: 0.0, minPercent: 0, maxPercent: 54.99 },
];

/* ---------------- university names ---------------- */

const publicUniversityNames = [
  "University of Dhaka",
  "University of Rajshahi",
  "University of Chittagong",
  "Jahangirnagar University",
  "Islamic University, Bangladesh",
  "Khulna University",
  "Jagannath University",
  "Comilla University",
  "Jatiya Kabi Kazi Nazrul Islam University",
  "Bangladesh University of Professionals",
  "Begum Rokeya University, Rangpur",
  "University of Barishal",
  "Rabindra University, Bangladesh",
  "Netrokona University",
  "Kishoreganj University",
  "Meherpur University",
  "Thakurgaon University",
  "Shahjalal University of Science and Technology",
  "Hajee Mohammad Danesh Science and Technology University",
  "Mawlana Bhashani Science and Technology University",
  "Patuakhali Science and Technology University",
  "Noakhali Science and Technology University",
  "Jashore University of Science and Technology",
  "Pabna University of Science and Technology",
  "Gopalganj Science and Technology University",
  "Rangamati Science and Technology University",
  "Jamalpur Science and Technology University",
  "Chandpur Science and Technology University",
  "Sunamganj Science and Technology University",
  "Bogura Science and Technology University",
  "Lakshmipur Science and Technology University",
  "Pirojpur Science and Technology University",
  "Satkhira University of Science and Technology",
  "Narayanganj Science and Technology University",
  "Bangladesh University of Engineering and Technology",
  "Military Institute of Science and Technology",
  "Rajshahi University of Engineering and Technology",
  "Khulna University of Engineering and Technology",
  "Chittagong University of Engineering and Technology",
  "Dhaka University of Engineering and Technology",
  "Bangladesh Agricultural University",
  "Gazipur Agricultural University",
  "Sher-e-Bangla Agricultural University",
  "Sylhet Agricultural University",
  "Khulna Agricultural University",
  "Habiganj Agricultural University",
  "Kurigram Agricultural University",
  "Shariatpur Agriculture University",
  "Bangladesh Medical University",
  "Chittagong Medical University",
  "Rajshahi Medical University",
  "Sylhet Medical University",
  "Khulna Medical University",
  "Chittagong Veterinary and Animal Sciences University",
  "Bangladesh University of Textiles",
  "Bangladesh Maritime University",
  "University of Frontier Technology, Bangladesh",
  "Aviation and Aerospace University Bangladesh",
  "National University Bangladesh",
  "Bangladesh Open University",
  "Islamic Arabic University",
  "Dhaka Central University",
] as const;

const privateUniversityNames = [
  "International University of Business Agriculture and Technology",
  "North South University",
  "Independent University, Bangladesh",
  "American International University-Bangladesh",
  "Dhaka International University",
  "International Islamic University Chittagong",
  "Asian University of Bangladesh",
  "East West University",
  "Gono Bishwabidyalay",
  "People's University of Bangladesh",
  "Queens University",
  "University of Asia Pacific",
  "Chittagong Independent University",
  "Bangladesh University",
  "BGC Trust University Bangladesh",
  "BRAC University",
  "Manarat International University",
  "Premier University, Chittagong",
  "Southern University Bangladesh",
  "Sylhet International University",
  "University of Development Alternative",
  "City University, Bangladesh",
  "Daffodil International University",
  "Green University of Bangladesh",
  "IBAIS University",
  "Leading University",
  "Northern University Bangladesh",
  "Prime University",
  "Southeast University",
  "Stamford University Bangladesh",
  "State University of Bangladesh",
  "Eastern University, Bangladesh",
  "Metropolitan University",
  "The Millennium University",
  "Primeasia University",
  "Royal University of Dhaka",
  "United International University",
  "University of Information Technology and Sciences",
  "University of South Asia, Bangladesh",
  "Presidency University",
  "Uttara University",
  "Victoria University of Bangladesh",
  "World University of Bangladesh",
  "ASA University Bangladesh",
  "Bangladesh Islami University",
  "East Delta University",
  "Northern University of Business and Technology Khulna",
  "Britannia University",
  "Feni University",
  "Khwaja Yunus Ali University",
  "European University of Bangladesh",
  "First Capital University of Bangladesh",
  "BGMEA University of Fashion & Technology",
  "Hamdard University Bangladesh",
  "Ishakha International University",
  "North East University Bangladesh",
  "North Western University, Bangladesh",
  "Port City International University",
  "Varendra University",
  "Sonargaon University",
  "Cox's Bazar International University",
  "Fareast International University",
  "German University Bangladesh",
  "North Bengal International University",
  "Notre Dame University Bangladesh",
  "Ranada Prasad Shaha University",
  "Brahmaputra International University",
  "Times University Bangladesh",
  "Canadian University of Bangladesh",
  "Global University Bangladesh",
  "NPI University of Bangladesh",
  "Rabindra Maitree University",
  "University of Scholars",
  "University of Creative Technology Chittagong",
  "Anwer Khan Modern University",
  "University of Global Village",
  "Khulna Khan Bahadur Ahsanullah University",
  "Trust University, Barishal",
  "University of Brahmanbaria",
  "University of Skill Enrichment and Technology",
  "International Standard University",
  "ZNRF University of Management Sciences",
  "Bandarban University",
  "RTM Al-Kabir Technical University",
  "Teesta University, Rangpur",
  "International Islami University of Science and Technology Bangladesh",
  "Microland University of Science and Technology",
  "Lalon University of Science & Arts",
  "Grameen University",
  "University of Science and Technology Chittagong",
  "Ahsanullah University of Science and Technology",
  "Pundra University of Science and Technology",
  "Bangladesh University of Business and Technology",
  "Atish Dipankar University of Science and Technology",
  "Z.H. Sikder University of Science and Technology",
  "Rajshahi Science and Technology University",
  "Bangladesh Army International University of Science and Technology",
  "Bangladesh Army University of Science and Technology, Khulna",
  "Bangladesh Army University of Science and Technology, Saidpur",
  "CCN University of Science and Technology",
  "Central University of Science and Technology",
  "Dr. Momtaz Begum University of Science and Technology",
  "Central Women's University",
  "Shanto-Mariam University of Creative Technology",
  "University of Liberal Arts Bangladesh",
  "Bangladesh University of Health Sciences",
  "Exim Bank Agricultural University Bangladesh",
  "Bangladesh Army University of Engineering and Technology",
  "Tagore University of Creative Arts",
] as const;

/* ---------------- builders ---------------- */

type UniversityCategory = "Public" | "Private";

type BangladeshDivision =
  | "Dhaka"
  | "Chattogram"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"
  | "Sylhet"
  | "Rangpur"
  | "Mymensingh";

const universityDivisions: Record<string, BangladeshDivision> = {
  "University of Dhaka": "Dhaka",
  "University of Rajshahi": "Rajshahi",
  "University of Chittagong": "Chattogram",
  "Jahangirnagar University": "Dhaka",
  "Islamic University, Bangladesh": "Khulna",
  "Khulna University": "Khulna",
  "Jagannath University": "Dhaka",
  "Comilla University": "Chattogram",
  "Jatiya Kabi Kazi Nazrul Islam University": "Mymensingh",
  "Bangladesh University of Professionals": "Dhaka",
  "Begum Rokeya University, Rangpur": "Rangpur",
  "University of Barishal": "Barishal",
  "Rabindra University, Bangladesh": "Rajshahi",
  "Netrokona University": "Mymensingh",
  "Kishoreganj University": "Dhaka",
  "Meherpur University": "Khulna",
  "Thakurgaon University": "Rangpur",
  "Shahjalal University of Science and Technology": "Sylhet",
  "Hajee Mohammad Danesh Science and Technology University": "Rangpur",
  "Mawlana Bhashani Science and Technology University": "Dhaka",
  "Patuakhali Science and Technology University": "Barishal",
  "Noakhali Science and Technology University": "Chattogram",
  "Jashore University of Science and Technology": "Khulna",
  "Pabna University of Science and Technology": "Rajshahi",
  "Gopalganj Science and Technology University": "Dhaka",
  "Rangamati Science and Technology University": "Chattogram",
  "Jamalpur Science and Technology University": "Mymensingh",
  "Chandpur Science and Technology University": "Chattogram",
  "Sunamganj Science and Technology University": "Sylhet",
  "Bogura Science and Technology University": "Rajshahi",
  "Lakshmipur Science and Technology University": "Chattogram",
  "Pirojpur Science and Technology University": "Barishal",
  "Satkhira University of Science and Technology": "Khulna",
  "Narayanganj Science and Technology University": "Dhaka",
  "Bangladesh University of Engineering and Technology": "Dhaka",
  "Military Institute of Science and Technology": "Dhaka",
  "Rajshahi University of Engineering and Technology": "Rajshahi",
  "Khulna University of Engineering and Technology": "Khulna",
  "Chittagong University of Engineering and Technology": "Chattogram",
  "Dhaka University of Engineering and Technology": "Dhaka",
  "Bangladesh Agricultural University": "Mymensingh",
  "Gazipur Agricultural University": "Dhaka",
  "Sher-e-Bangla Agricultural University": "Dhaka",
  "Sylhet Agricultural University": "Sylhet",
  "Khulna Agricultural University": "Khulna",
  "Habiganj Agricultural University": "Sylhet",
  "Kurigram Agricultural University": "Rangpur",
  "Shariatpur Agriculture University": "Dhaka",
  "Bangladesh Medical University": "Dhaka",
  "Chittagong Medical University": "Chattogram",
  "Rajshahi Medical University": "Rajshahi",
  "Sylhet Medical University": "Sylhet",
  "Khulna Medical University": "Khulna",
  "Chittagong Veterinary and Animal Sciences University": "Chattogram",
  "Bangladesh University of Textiles": "Dhaka",
  "Bangladesh Maritime University": "Dhaka",
  "University of Frontier Technology, Bangladesh": "Dhaka",
  "Aviation and Aerospace University Bangladesh": "Rangpur",
  "National University Bangladesh": "Dhaka",
  "Bangladesh Open University": "Dhaka",
  "Islamic Arabic University": "Dhaka",
  "Dhaka Central University": "Dhaka",
  "International University of Business Agriculture and Technology": "Dhaka",
  "North South University": "Dhaka",
  "Independent University, Bangladesh": "Dhaka",
  "American International University-Bangladesh": "Dhaka",
  "Dhaka International University": "Dhaka",
  "International Islamic University Chittagong": "Chattogram",
  "Asian University of Bangladesh": "Dhaka",
  "East West University": "Dhaka",
  "Gono Bishwabidyalay": "Dhaka",
  "People's University of Bangladesh": "Dhaka",
  "Queens University": "Dhaka",
  "University of Asia Pacific": "Dhaka",
  "Chittagong Independent University": "Chattogram",
  "Bangladesh University": "Dhaka",
  "BGC Trust University Bangladesh": "Chattogram",
  "BRAC University": "Dhaka",
  "Manarat International University": "Dhaka",
  "Premier University, Chittagong": "Chattogram",
  "Southern University Bangladesh": "Chattogram",
  "Sylhet International University": "Sylhet",
  "University of Development Alternative": "Dhaka",
  "City University, Bangladesh": "Dhaka",
  "Daffodil International University": "Dhaka",
  "Green University of Bangladesh": "Dhaka",
  "IBAIS University": "Dhaka",
  "Leading University": "Sylhet",
  "Northern University Bangladesh": "Dhaka",
  "Prime University": "Dhaka",
  "Southeast University": "Dhaka",
  "Stamford University Bangladesh": "Dhaka",
  "State University of Bangladesh": "Dhaka",
  "Eastern University, Bangladesh": "Dhaka",
  "Metropolitan University": "Sylhet",
  "The Millennium University": "Dhaka",
  "Primeasia University": "Dhaka",
  "Royal University of Dhaka": "Dhaka",
  "United International University": "Dhaka",
  "University of Information Technology and Sciences": "Dhaka",
  "University of South Asia, Bangladesh": "Dhaka",
  "Presidency University": "Dhaka",
  "Uttara University": "Dhaka",
  "Victoria University of Bangladesh": "Dhaka",
  "World University of Bangladesh": "Dhaka",
  "ASA University Bangladesh": "Dhaka",
  "Bangladesh Islami University": "Dhaka",
  "East Delta University": "Chattogram",
  "Northern University of Business and Technology Khulna": "Khulna",
  "Britannia University": "Chattogram",
  "Feni University": "Chattogram",
  "Khwaja Yunus Ali University": "Rajshahi",
  "European University of Bangladesh": "Dhaka",
  "First Capital University of Bangladesh": "Khulna",
  "BGMEA University of Fashion & Technology": "Dhaka",
  "Hamdard University Bangladesh": "Dhaka",
  "Ishakha International University": "Dhaka",
  "North East University Bangladesh": "Sylhet",
  "North Western University, Bangladesh": "Khulna",
  "Port City International University": "Chattogram",
  "Varendra University": "Rajshahi",
  "Sonargaon University": "Dhaka",
  "Cox's Bazar International University": "Chattogram",
  "Fareast International University": "Dhaka",
  "German University Bangladesh": "Dhaka",
  "North Bengal International University": "Rajshahi",
  "Notre Dame University Bangladesh": "Dhaka",
  "Ranada Prasad Shaha University": "Dhaka",
  "Brahmaputra International University": "Mymensingh",
  "Times University Bangladesh": "Dhaka",
  "Canadian University of Bangladesh": "Dhaka",
  "Global University Bangladesh": "Barishal",
  "NPI University of Bangladesh": "Dhaka",
  "Rabindra Maitree University": "Khulna",
  "University of Scholars": "Dhaka",
  "University of Creative Technology Chittagong": "Chattogram",
  "Anwer Khan Modern University": "Dhaka",
  "University of Global Village": "Barishal",
  "Khulna Khan Bahadur Ahsanullah University": "Khulna",
  "Trust University, Barishal": "Barishal",
  "University of Brahmanbaria": "Chattogram",
  "University of Skill Enrichment and Technology": "Dhaka",
  "International Standard University": "Dhaka",
  "ZNRF University of Management Sciences": "Dhaka",
  "Bandarban University": "Chattogram",
  "RTM Al-Kabir Technical University": "Sylhet",
  "Teesta University, Rangpur": "Rangpur",
  "International Islami University of Science and Technology Bangladesh": "Dhaka",
  "Microland University of Science and Technology": "Dhaka",
  "Lalon University of Science & Arts": "Khulna",
  "Grameen University": "Dhaka",
  "University of Science and Technology Chittagong": "Chattogram",
  "Ahsanullah University of Science and Technology": "Dhaka",
  "Pundra University of Science and Technology": "Rajshahi",
  "Bangladesh University of Business and Technology": "Dhaka",
  "Atish Dipankar University of Science and Technology": "Dhaka",
  "Z.H. Sikder University of Science and Technology": "Dhaka",
  "Rajshahi Science and Technology University": "Rajshahi",
  "Bangladesh Army International University of Science and Technology": "Chattogram",
  "Bangladesh Army University of Science and Technology, Khulna": "Khulna",
  "Bangladesh Army University of Science and Technology, Saidpur": "Rangpur",
  "CCN University of Science and Technology": "Chattogram",
  "Central University of Science and Technology": "Dhaka",
  "Dr. Momtaz Begum University of Science and Technology": "Rajshahi",
  "Central Women's University": "Dhaka",
  "Shanto-Mariam University of Creative Technology": "Dhaka",
  "University of Liberal Arts Bangladesh": "Dhaka",
  "Bangladesh University of Health Sciences": "Dhaka",
  "Exim Bank Agricultural University Bangladesh": "Rajshahi",
  "Bangladesh Army University of Engineering and Technology": "Rajshahi",
  "Tagore University of Creative Arts": "Dhaka",
};


/* ---------------- short names ---------------- */

const shortNameOverrides: Record<string, string> = {
  "University of Dhaka": "DU",
  "University of Rajshahi": "RU",
  "University of Chittagong": "CU",
  "Jahangirnagar University": "JU",
  "Islamic University, Bangladesh": "IU",
  "Khulna University": "KU",
  "Jagannath University": "JnU",
  "Comilla University": "CoU",
  "Jatiya Kabi Kazi Nazrul Islam University": "JKKNIU",
  "Bangladesh University of Professionals": "BUP",
  "Begum Rokeya University, Rangpur": "BRUR",
  "University of Barishal": "BU",
  "Shahjalal University of Science and Technology": "SUST",
  "Hajee Mohammad Danesh Science and Technology University": "HSTU",
  "Mawlana Bhashani Science and Technology University": "MBSTU",
  "Patuakhali Science and Technology University": "PSTU",
  "Noakhali Science and Technology University": "NSTU",
  "Jashore University of Science and Technology": "JUST",
  "Pabna University of Science and Technology": "PUST",
  "Bangladesh University of Engineering and Technology": "BUET",
  "Military Institute of Science and Technology": "MIST",
  "Rajshahi University of Engineering and Technology": "RUET",
  "Khulna University of Engineering and Technology": "KUET",
  "Chittagong University of Engineering and Technology": "CUET",
  "Dhaka University of Engineering and Technology": "DUET",
  "Bangladesh Agricultural University": "BAU",
  "Gazipur Agricultural University": "GAU",
  "Sher-e-Bangla Agricultural University": "SAU",
  "Sylhet Agricultural University": "SAU",
  "Bangladesh University of Textiles": "BUTEX",
  "Bangladesh Maritime University": "BMU",
  "National University Bangladesh": "NU",
  "Bangladesh Open University": "BOU",
  "International University of Business Agriculture and Technology": "IUBAT",
  "North South University": "NSU",
  "Independent University, Bangladesh": "IUB",
  "American International University-Bangladesh": "AIUB",
  "Dhaka International University": "DIU",
  "International Islamic University Chittagong": "IIUC",
  "East West University": "EWU",
  "University of Asia Pacific": "UAP",
  "BRAC University": "BRACU",
  "Daffodil International University": "DIU",
  "Green University of Bangladesh": "GUB",
  "United International University": "UIU",
  "University of Information Technology and Sciences": "UITS",
  "World University of Bangladesh": "WUB",
  "BGMEA University of Fashion & Technology": "BUFT",
  "Notre Dame University Bangladesh": "NDUB",
  "University of Liberal Arts Bangladesh": "ULAB",
  "University of Science and Technology Chittagong": "USTC",
  "Ahsanullah University of Science and Technology": "AUST",
  "Bangladesh University of Business and Technology": "BUBT",
  "Atish Dipankar University of Science and Technology": "ADUST",
  "Bangladesh Army International University of Science and Technology": "BAIUST",
  "Bangladesh Army University of Engineering and Technology": "BAUET",
};

function makeShortName(name: string) {
  const overridden = shortNameOverrides[name];

  if (overridden) {
    return overridden;
  }

  const ignoredWords = new Set([
    "of",
    "the",
    "and",
    "for",
    "in",
    "at",
  ]);

  const initials = name
    .replace(/&/g, " and ")
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !ignoredWords.has(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || "UNIV";
}

/* ---------------- display priority ---------------- */

/*
 * Lower values appear first inside a division.
 * This is a UI priority, not an official academic ranking.
 */
const featuredPriorityById: Record<string, number> = {
  du: 1,
  buet: 2,
  ju: 3,
  bup: 4,
  mist: 5,
  butex: 6,
  brac: 7,
  nsu: 8,
  aiub: 9,
  iub: 10,
  uiu: 11,
  bubt: 12,

  ru: 1,
  ruet: 2,
  "pabna-university-of-science-and-technology": 3,
  "varendra-university": 4,

  cu: 1,
  "chittagong-university-of-engineering-and-technology": 2,
  "chittagong-veterinary-and-animal-sciences-university": 3,
  "noakhali-science-and-technology-university": 4,
  "international-islamic-university-chittagong": 5,

  "khulna-university": 1,
  "khulna-university-of-engineering-and-technology": 2,
  "jashore-university-of-science-and-technology": 3,
  "islamic-university-bangladesh": 4,

  "university-of-barishal": 1,
  "patuakhali-science-and-technology-university": 2,

  "shahjalal-university-of-science-and-technology": 1,
  "sylhet-agricultural-university": 2,
  "sylhet-medical-university": 3,
  "leading-university": 4,

  "begum-rokeya-university-rangpur": 1,
  "hajee-mohammad-danesh-science-and-technology-university": 2,
  "bangladesh-army-university-of-science-and-technology-saidpur": 3,

  "bangladesh-agricultural-university": 1,
  "jatiya-kabi-kazi-nazrul-islam-university": 2,
  "jamalpur-science-and-technology-university": 3,
  "netrokona-university": 4,
};

const divisionDisplayOrder: BangladeshDivision[] = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const idOverrides: Record<string, string> = {
  "University of Dhaka": "du",
  "University of Rajshahi": "ru",
  "University of Chittagong": "cu",
  "Jahangirnagar University": "ju",
  "Bangladesh University of Engineering and Technology": "buet",
  "North South University": "nsu",
  "Independent University, Bangladesh": "iub",
  "American International University-Bangladesh": "aiub",
  "United International University": "uiu",
  "Bangladesh University of Business and Technology": "bubt",
  "BRAC University": "brac",
  "Bangladesh University of Professionals": "bup",
  "Military Institute of Science and Technology": "mist",
  "Bangladesh University of Textiles": "butex",
  "Khulna University": "khulna-university",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPreset(id: string) {
  switch (id) {
    case "aiub":
      return {
        grades: aiubScale4,
        notes: "Private university. AIUB grading preset.",
      };

    case "nsu":
      return {
        grades: nsuScale4,
        notes: "Private university. NSU grading preset.",
      };

    case "iub":
      return {
        grades: iubScale4,
        notes: "Private university. IUB letter-grade point preset.",
      };

    case "uiu":
      return {
        grades: uiuScale4,
        notes: "Private university. UIU grading preset; confirm program-specific rules.",
      };

    case "bubt":
      return {
        grades: bdScale4,
        notes: "Private university. BUBT grading preset.",
      };

    default:
      return null;
  }
}

function makeUniversity(
  name: string,
  category: UniversityCategory
): University {
  const id = idOverrides[name] ?? slugify(name);
  const preset = getPreset(id);

  const shortName = makeShortName(name);

  return {
    id,
    name: `${name} (${shortName})`,
    country: "Bangladesh",
    division: universityDivisions[name],
    scale: 4.0,
    gradingType: "letter",
    passingGrade: "D",
    grades: preset?.grades ?? bdScale4,
    notes:
      preset?.notes ??
      `${category} university. Common Bangladesh 4.0 scale is used as a fallback; verify the university's current academic regulations.`,
  };
}

/* ---------------- exports ---------------- */

export const publicUniversities: University[] =
  publicUniversityNames.map((name) =>
    makeUniversity(name, "Public")
  );

export const privateUniversities: University[] =
  privateUniversityNames.map((name) =>
    makeUniversity(name, "Private")
  );

function compareUniversities(
  first: University,
  second: University
) {
  const firstDivisionIndex = divisionDisplayOrder.indexOf(
    first.division as BangladeshDivision
  );

  const secondDivisionIndex = divisionDisplayOrder.indexOf(
    second.division as BangladeshDivision
  );

  if (firstDivisionIndex !== secondDivisionIndex) {
    return firstDivisionIndex - secondDivisionIndex;
  }

  const firstPriority =
    featuredPriorityById[first.id] ?? Number.MAX_SAFE_INTEGER;

  const secondPriority =
    featuredPriorityById[second.id] ?? Number.MAX_SAFE_INTEGER;

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority;
  }

  return first.name.localeCompare(second.name);
}

export const universities: University[] = [
  ...publicUniversities,
  ...privateUniversities,
].sort(compareUniversities);
