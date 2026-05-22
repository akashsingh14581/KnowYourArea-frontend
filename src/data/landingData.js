import { MdMyLocation, MdSchedule } from "react-icons/md";
import { FaMapMarkedAlt, FaStore, FaRocket } from "react-icons/fa";

// ───── FEATURES ─────
export const FEATURES = [
  {
    icon: "📡",
    colorClass: "fi-b",
    title: "Live location detection",
    desc: "Automatically pinpoint your position and instantly surface shops within walking or driving distance.",
  },
  {
    icon: "🟢",
    colorClass: "fi-g",
    title: "Real-time open / closed",
    desc: "See accurate availability before you step out — no more wasted trips to shuttered shops.",
  },
  {
    icon: "🗺️",
    colorClass: "fi-a",
    title: "Smart interactive map",
    desc: "Filter shops by distance, category, and rating. Pan, zoom, and explore your neighbourhood.",
  },
];

// ───── STEPS ─────
export const STEPS = [
  {
    num: "01",
    title: "Allow location",
    desc: "Grant permission and we detect all nearby shops instantly — no typing needed.",
  },
  {
    num: "02",
    title: "Discover shops",
    desc: "Browse shops on a live map, colour-coded by open/closed status with category filters.",
  },
  {
    num: "03",
    title: "Navigate & go",
    desc: "Tap any pin and get instant directions. No friction, no fuss.",
  },
];

// ───── TESTIMONIALS ─────
export const TESTIMONIALS = [
  {
    text: "Super useful for finding open shops instantly. Saved me so many trips at odd hours. I use it every single day now.",
    name: "Priya Sharma",
    role: "Daily user · Gurugram",
    initials: "PS",
    avatarClass: "ta-b",
  },
  {
    text: "Found an open medical store at 11 PM when I needed it most. Couldn't believe how fast and accurate the results were.",
    name: "Rahul Verma",
    role: "User · Delhi",
    initials: "RV",
    avatarClass: "ta-g",
  },
];

// ───── STATS ─────
export const STATS = [
  { icon: "🏪", value: 2400, suffix: "+", label: "Shops listed",    colorClass: "si-b" },
  { icon: "🌆", value: 14,   suffix: "",  label: "Cities covered",  colorClass: "si-g" },
  { icon: "👥", value: 8500, suffix: "+", label: "Happy users",     colorClass: "si-a" },
  { icon: "🛡️", value: null, suffix: "",  label: "Always & forever",colorClass: "si-p", staticVal: "Free" },
];

// ───── CATEGORIES ─────
export const CATEGORIES = [
  { emoji: "🛒", label: "All" },
  { emoji: "🧴", label: "Grocery" },
  { emoji: "💊", label: "Medical" },
  { emoji: "☕", label: "Café" },
  { emoji: "🔧", label: "Hardware" },
  { emoji: "✂️", label: "Salon" },
];

// ───── LIVE TICKER SHOPS ─────
export const TICKER_SHOPS = [
  { name: "Sharma Kirana",   area: "Sector 14",    open: true  },
  { name: "Apollo Pharmacy", area: "MG Road",       open: true  },
  { name: "Tailor Shop",     area: "Sohna Road",    open: false },
  { name: "Chai Point",      area: "Cyber Hub",     open: true  },
  { name: "Haldiram's",      area: "Sector 29",     open: true  },
  { name: "Book World",      area: "DLF Phase 2",   open: false },
  { name: "Fresh Mart",      area: "Palam Vihar",   open: true  },
  { name: "Meena Salon",     area: "Sector 56",     open: true  },
  { name: "Hardware Hub",    area: "Old Gurugram",  open: false },
  { name: "Lakshmi Sweets",  area: "Iffco Chowk",  open: true  },
];