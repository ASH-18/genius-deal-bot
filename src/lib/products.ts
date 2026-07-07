export type Category = "Electronics" | "Fashion" | "Home" | "Beauty" | "Sports" | "Books";

import imgSonic from "@/assets/products/sonic-pro-x.jpg";
import imgMac from "@/assets/products/macbook-air-15.jpg";
import imgVega from "@/assets/products/iphone-vega.jpg";
import imgNova from "@/assets/products/galaxy-nova.jpg";
import imgWatch from "@/assets/products/watch-atlas.jpg";
import imgScarf from "@/assets/products/cashmere-scarf.jpg";
import imgSneaker from "@/assets/products/sneaker-run.jpg";
import imgLoafer from "@/assets/products/loafer-oslo.jpg";
import imgChair from "@/assets/products/chair-arne.jpg";
import imgLamp from "@/assets/products/lamp-nara.jpg";
import imgVase from "@/assets/products/vase-terra.jpg";
import imgCandle from "@/assets/products/candle-oud.jpg";
import imgSerum from "@/assets/products/serum-glow.jpg";
import imgPerfume from "@/assets/products/perfume-noir.jpg";
import imgYoga from "@/assets/products/yoga-mat.jpg";
import imgBook from "@/assets/products/book-atlas.jpg";
import imgKettle from "@/assets/products/kettle-copper.jpg";
import imgBackpack from "@/assets/products/backpack-drift.jpg";
import imgKindle from "@/assets/products/kindle-air.jpg";
import imgSpeaker from "@/assets/products/speaker-pebble.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subcategory: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  colors?: string[];
  sizes?: string[];
  tags: string[];
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  stock: number;
  deliveryDays: number;
  bestseller?: boolean;
  newArrival?: boolean;
  flashDeal?: boolean;
}

/** Curated catalog. Images are locally generated product renders. */

export const PRODUCTS: Product[] = [
  {
    id: "sonic-pro-x",
    name: "Sonic Pro X Wireless Headphones",
    brand: "Aureal",
    category: "Electronics",
    subcategory: "Audio",
    price: 12999,
    mrp: 19999,
    rating: 4.6,
    reviews: 2841,
    image: imgSonic,
    gallery: [imgSonic],
    colors: ["Obsidian", "Ivory", "Copper"],
    tags: ["noise-cancelling", "over-ear", "premium", "bluetooth-5.3"],
    description: "Studio-grade sound with adaptive noise cancellation and 40-hour battery life.",
    highlights: ["Adaptive ANC", "40h battery", "LDAC + AAC", "Multipoint pairing"],
    specs: { Driver: "40mm dynamic", Weight: "265g", Bluetooth: "5.3", Battery: "40h ANC on" },
    stock: 42, deliveryDays: 2, bestseller: true,
  },
  {
    id: "macbook-air-15",
    name: "Aurora 15 Ultrabook, M-Class Silicon",
    brand: "Kōan",
    category: "Electronics", subcategory: "Laptops",
    price: 129900, mrp: 149900, rating: 4.8, reviews: 1203,
    image: imgMac,
    gallery: [imgMac],
    colors: ["Midnight", "Starlight"],
    tags: ["laptop", "programming", "creator", "18h-battery"],
    description: "A featherlight 15\" ultrabook engineered for developers, designers, and long flights.",
    highlights: ["18h battery", "Liquid Retina", "16GB unified memory", "Silent, fanless"],
    specs: { CPU: "10-core", RAM: "16GB", SSD: "512GB", Display: "15.3\" 2880×1864" },
    stock: 15, deliveryDays: 3, bestseller: true,
  },
  {
    id: "iphone-vega",
    name: "Vega Pro Smartphone",
    brand: "Kōan",
    category: "Electronics", subcategory: "Smartphones",
    price: 89900, mrp: 99900, rating: 4.7, reviews: 5412,
    image: imgVega,
    gallery: [imgVega],
    colors: ["Titanium", "Obsidian", "Copper"],
    tags: ["smartphone", "camera", "premium"],
    description: "Titanium body, triple-lens computational camera, and all-day intelligence.",
    highlights: ["48MP triple camera", "Titanium frame", "USB-C", "Action button"],
    specs: { Display: "6.1\" OLED", Chip: "A-series 3nm", Storage: "256GB", Camera: "48+12+12MP" },
    stock: 28, deliveryDays: 2, bestseller: true, flashDeal: true,
  },
  {
    id: "galaxy-nova",
    name: "Nova Ultra Smartphone",
    brand: "Helio",
    category: "Electronics", subcategory: "Smartphones",
    price: 84999, mrp: 109999, rating: 4.5, reviews: 3891,
    image: imgNova,
    gallery: [imgNova],
    colors: ["Phantom", "Cream", "Violet"],
    tags: ["smartphone", "android", "s-pen"],
    description: "200MP camera, S-Pen support, and a 6.8\" adaptive Dynamic AMOLED display.",
    highlights: ["200MP camera", "S-Pen included", "5000mAh", "7-year updates"],
    specs: { Display: "6.8\" AMOLED 120Hz", Chip: "Octa-core", Storage: "512GB", Camera: "200+12+10+10MP" },
    stock: 33, deliveryDays: 2,
  },
  {
    id: "watch-atlas",
    name: "Atlas Chronograph Watch",
    brand: "Meridian",
    category: "Fashion", subcategory: "Watches",
    price: 8499, mrp: 12999, rating: 4.4, reviews: 621,
    image: imgWatch,
    gallery: [imgWatch],
    colors: ["Cognac", "Onyx"],
    tags: ["watch", "leather", "gift"],
    description: "A hand-finished chronograph with Italian leather strap and sapphire crystal.",
    highlights: ["Sapphire crystal", "Italian leather", "50m water resistant", "2-year warranty"],
    specs: { Case: "42mm", Movement: "Japanese quartz", Strap: "Italian leather" },
    stock: 60, deliveryDays: 3,
  },
  {
    id: "cashmere-scarf",
    name: "Everest Cashmere Scarf",
    brand: "Hima",
    category: "Fashion", subcategory: "Accessories",
    price: 3499, mrp: 5999, rating: 4.7, reviews: 1204,
    image: imgScarf,
    gallery: [imgScarf],
    colors: ["Amber", "Charcoal", "Ivory"],
    tags: ["cashmere", "gift", "winter"],
    description: "100% Mongolian cashmere, hand-loomed in Kathmandu. Impossibly soft.",
    highlights: ["Mongolian cashmere", "Hand-loomed", "OEKO-TEX certified"],
    specs: { Material: "100% cashmere", Size: "200 × 70 cm", Weight: "180g" },
    stock: 120, deliveryDays: 4, newArrival: true,
  },
  {
    id: "sneaker-run",
    name: "Trail Runner V2",
    brand: "Kite",
    category: "Sports", subcategory: "Footwear",
    price: 2799, mrp: 4499, rating: 4.3, reviews: 3391,
    image: imgSneaker,
    gallery: [imgSneaker],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: ["Coral", "Midnight", "Sand"],
    tags: ["running", "sneakers", "under-3000"],
    description: "Responsive foam midsole and breathable engineered mesh for daily miles.",
    highlights: ["Responsive foam", "Recycled mesh", "Grippy outsole"],
    specs: { Drop: "8mm", Weight: "245g", Use: "Road / mixed terrain" },
    stock: 200, deliveryDays: 3, flashDeal: true,
  },
  {
    id: "loafer-oslo",
    name: "Oslo Suede Loafers",
    brand: "Nord",
    category: "Fashion", subcategory: "Footwear",
    price: 4499, mrp: 6999, rating: 4.5, reviews: 812,
    image: imgLoafer,
    gallery: [imgLoafer],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: ["Camel", "Espresso"],
    tags: ["loafers", "formal", "leather"],
    description: "Italian suede, hand-stitched in Portugal. A wardrobe classic reimagined.",
    highlights: ["Italian suede", "Blake stitched", "Leather insole"],
    specs: { Upper: "Suede", Sole: "Rubber", Made: "Portugal" },
    stock: 45, deliveryDays: 5,
  },
  {
    id: "chair-arne",
    name: "Arne Lounge Chair",
    brand: "Studio Fjord",
    category: "Home", subcategory: "Furniture",
    price: 34999, mrp: 49999, rating: 4.8, reviews: 214,
    image: imgChair,
    gallery: [imgChair],
    colors: ["Bouclé Ivory", "Camel Leather"],
    tags: ["lounge", "living-room", "premium"],
    description: "A sculptural lounge chair with hand-turned oak frame and bouclé upholstery.",
    highlights: ["Solid oak frame", "Bouclé upholstery", "Made to order"],
    specs: { Frame: "Solid oak", Upholstery: "Bouclé", Dimensions: "78 × 82 × 88 cm" },
    stock: 8, deliveryDays: 14, newArrival: true,
  },
  {
    id: "lamp-nara",
    name: "Nara Paper Floor Lamp",
    brand: "Studio Fjord",
    category: "Home", subcategory: "Lighting",
    price: 6499, mrp: 8999, rating: 4.6, reviews: 342,
    image: imgLamp,
    gallery: [imgLamp],
    tags: ["lighting", "living-room", "gift"],
    description: "Handmade Japanese washi paper diffuses light into a soft warm glow.",
    highlights: ["Handmade washi", "Warm 2700K", "Dimmable"],
    specs: { Bulb: "E27 LED", Height: "150cm", Material: "Washi + oak" },
    stock: 22, deliveryDays: 5,
  },
  {
    id: "vase-terra",
    name: "Terra Ceramic Vase",
    brand: "Ando",
    category: "Home", subcategory: "Decor",
    price: 1999, mrp: 2999, rating: 4.5, reviews: 156,
    image: imgVase,
    gallery: [imgVase],
    tags: ["decor", "ceramic", "gift"],
    description: "Wheel-thrown stoneware vase with a soft matte glaze.",
    highlights: ["Wheel-thrown", "Food-safe glaze"],
    specs: { Material: "Stoneware", Height: "24 cm" },
    stock: 88, deliveryDays: 3,
  },
  {
    id: "candle-oud",
    name: "Oud & Amber Candle",
    brand: "Maison Ilm",
    category: "Home", subcategory: "Fragrance",
    price: 1499, mrp: 2200, rating: 4.7, reviews: 943,
    image: imgCandle,
    gallery: [imgCandle],
    tags: ["candle", "gift", "under-2000", "eco"],
    description: "Hand-poured coconut wax candle with notes of oud, amber, and smoked cedar.",
    highlights: ["Coconut wax", "50h burn time", "Cotton wick"],
    specs: { Wax: "Coconut", "Burn time": "50h", Notes: "Oud, amber, cedar" },
    stock: 300, deliveryDays: 2, bestseller: true,
  },
  {
    id: "serum-glow",
    name: "Radiance Vitamin C Serum",
    brand: "Kori",
    category: "Beauty", subcategory: "Skincare",
    price: 1299, mrp: 1899, rating: 4.6, reviews: 4180,
    image: imgSerum,
    gallery: [imgSerum],
    tags: ["skincare", "vitamin-c", "eco"],
    description: "A stabilised 15% vitamin C serum with ferulic acid. Brightens in 4 weeks.",
    highlights: ["15% Vitamin C", "Ferulic acid", "Fragrance-free"],
    specs: { Volume: "30 ml", Skin: "All types", Vegan: "Yes" },
    stock: 500, deliveryDays: 2,
  },
  {
    id: "perfume-noir",
    name: "Noir 27 Eau de Parfum",
    brand: "Maison Ilm",
    category: "Beauty", subcategory: "Fragrance",
    price: 4899, mrp: 6499, rating: 4.7, reviews: 611,
    image: imgPerfume,
    gallery: [imgPerfume],
    tags: ["perfume", "gift", "unisex"],
    description: "Smoky vetiver, black pepper, and warm leather. A signature evening scent.",
    highlights: ["50ml EDP", "8h wear", "Unisex"],
    specs: { Notes: "Vetiver, pepper, leather", Volume: "50 ml" },
    stock: 75, deliveryDays: 3,
  },
  {
    id: "yoga-mat",
    name: "Alba Cork Yoga Mat",
    brand: "Prana",
    category: "Sports", subcategory: "Yoga",
    price: 2499, mrp: 3999, rating: 4.6, reviews: 1520,
    image: imgYoga,
    gallery: [imgYoga],
    tags: ["yoga", "eco", "sport"],
    description: "Natural cork on a recycled-rubber base. Grippier when wet.",
    highlights: ["Natural cork", "Recycled rubber", "5mm cushioning"],
    specs: { Size: "183 × 61 cm", Thickness: "5 mm", Weight: "2.4 kg" },
    stock: 210, deliveryDays: 3,
  },
  {
    id: "book-atlas",
    name: "The Atlas of Small Cities",
    brand: "Editions Kite",
    category: "Books", subcategory: "Non-fiction",
    price: 999, mrp: 1499, rating: 4.8, reviews: 233,
    image: imgBook,
    gallery: [imgBook],
    tags: ["book", "gift", "under-2000"],
    description: "A photographic atlas of 34 small cities you've never heard of.",
    highlights: ["Hardcover", "288 pages", "Signed edition"],
    specs: { Pages: "288", Format: "Hardcover", ISBN: "978-1-000-00000-0" },
    stock: 150, deliveryDays: 4, newArrival: true,
  },
  {
    id: "kettle-copper",
    name: "Copper Pour-Over Kettle",
    brand: "Ando",
    category: "Home", subcategory: "Kitchen",
    price: 3299, mrp: 4499, rating: 4.5, reviews: 401,
    image: imgKettle,
    gallery: [imgKettle],
    tags: ["kitchen", "coffee", "gift"],
    description: "A slender goose-neck kettle for precise pour-over technique.",
    highlights: ["Goose-neck", "Copper body", "1L capacity"],
    specs: { Capacity: "1 L", Material: "Copper", Stove: "Gas + induction" },
    stock: 40, deliveryDays: 3,
  },
  {
    id: "backpack-drift",
    name: "Drift 22L Travel Backpack",
    brand: "Kite",
    category: "Fashion", subcategory: "Bags",
    price: 3799, mrp: 5499, rating: 4.6, reviews: 1811,
    image: imgBackpack,
    gallery: [imgBackpack],
    colors: ["Olive", "Black", "Sand"],
    tags: ["backpack", "travel", "laptop-15"],
    description: "Weather-resistant recycled ripstop, laptop sleeve, and lay-flat opening.",
    highlights: ["Recycled ripstop", "15\" laptop sleeve", "YKK zips"],
    specs: { Capacity: "22 L", Weight: "0.9 kg", Material: "Recycled ripstop" },
    stock: 120, deliveryDays: 3, bestseller: true,
  },
  {
    id: "kindle-air",
    name: "Read Air E-Reader",
    brand: "Aureal",
    category: "Electronics", subcategory: "Reading",
    price: 14999, mrp: 17999, rating: 4.7, reviews: 902,
    image: imgKindle,
    gallery: [imgKindle],
    tags: ["ereader", "reading", "gift"],
    description: "300 ppi glare-free display, warm light, and 10-week battery.",
    highlights: ["300 ppi", "Warm light", "Waterproof IPX8"],
    specs: { Display: "7\" E-ink", Storage: "32 GB", Battery: "10 weeks" },
    stock: 60, deliveryDays: 2, newArrival: true,
  },
  {
    id: "speaker-pebble",
    name: "Pebble Bluetooth Speaker",
    brand: "Aureal",
    category: "Electronics", subcategory: "Audio",
    price: 4999, mrp: 6999, rating: 4.4, reviews: 2210,
    image: imgSpeaker,
    gallery: [imgSpeaker],
    colors: ["Sand", "Slate"],
    tags: ["speaker", "portable", "under-5000"],
    description: "360° room-filling sound in a pocketable form. IP67 dust and waterproof.",
    highlights: ["360° sound", "IP67", "20h battery"],
    specs: { Drivers: "40mm × 2", Battery: "20h", Weight: "580g" },
    stock: 180, deliveryDays: 2,
  },
];

export const CATEGORIES: Category[] = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books"];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function discount(p: Product) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function similarProducts(p: Product, n = 4) {
  return PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category).slice(0, n);
}

export function frequentlyBought(p: Product, n = 3) {
  // Naive: pick same-category cheaper accessories
  return PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category)
    .sort((a, b) => a.price - b.price)
    .slice(0, n);
}

export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
