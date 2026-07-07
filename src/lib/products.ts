export type Category = "Electronics" | "Fashion" | "Home" | "Beauty" | "Sports" | "Books";

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

/** Curated catalog. Images are direct Unsplash CDN URLs (stable). */
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

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
    image: u("photo-1583394838336-acd977736f90"),
    gallery: [u("photo-1583394838336-acd977736f90"), u("photo-1590658268037-6bf12165a8df"), u("photo-1546435770-a3e426bf472b")],
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
    image: u("photo-1517336714731-489689fd1ca8"),
    gallery: [u("photo-1517336714731-489689fd1ca8"), u("photo-1496181133206-80ce9b88a853"), u("photo-1541807084-5c52b6b3adef")],
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
    image: u("photo-1592750475338-74b7b21085ab"),
    gallery: [u("photo-1592750475338-74b7b21085ab"), u("photo-1511707171634-5f897ff02aa9"), u("photo-1510557880182-3d4d3cba35a5")],
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
    image: u("photo-1610945415295-d9bbf067e59c"),
    gallery: [u("photo-1610945415295-d9bbf067e59c"), u("photo-1580910051074-3eb694886505"), u("photo-1567581935884-3349723552ca")],
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
    image: u("photo-1524592094714-0f0654e20314"),
    gallery: [u("photo-1524592094714-0f0654e20314"), u("photo-1523170335258-f5ed11844a49"), u("photo-1547996160-81dfa63595aa")],
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
    image: u("photo-1520903920243-00d872a2d1c9"),
    gallery: [u("photo-1520903920243-00d872a2d1c9"), u("photo-1601925260368-ae2f83cf8b7f"), u("photo-1580537782894-c1a2c1d1f9d1")],
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
    image: u("photo-1542291026-7eec264c27ff"),
    gallery: [u("photo-1542291026-7eec264c27ff"), u("photo-1600185365483-26d7a4cc7519"), u("photo-1595950653106-6c9ebd614d3a")],
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
    image: u("photo-1533867617858-e7b97e060509"),
    gallery: [u("photo-1533867617858-e7b97e060509"), u("photo-1614252369475-531eba835eb1"), u("photo-1449505278894-297fdb3edbc1")],
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
    image: u("photo-1519947486511-46149fa0a254"),
    gallery: [u("photo-1519947486511-46149fa0a254"), u("photo-1567538096630-e0c55bd6374c"), u("photo-1555041469-a586c61ea9bc")],
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
    image: u("photo-1513506003901-1e6a229e2d15"),
    gallery: [u("photo-1513506003901-1e6a229e2d15"), u("photo-1524578271613-d550eacf6090"), u("photo-1567016432779-094069958ea5")],
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
    image: u("photo-1578500494198-246f612d3b3d"),
    gallery: [u("photo-1578500494198-246f612d3b3d"), u("photo-1493663284031-b7e3aefcae8e"), u("photo-1616486338812-3dadae4b4ace")],
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
    image: u("photo-1602874801007-aa27a288a86a"),
    gallery: [u("photo-1602874801007-aa27a288a86a"), u("photo-1608181831718-c9ffd8728e5f"), u("photo-1611409408119-e2ee7f6dbafd")],
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
    image: u("photo-1620916566398-39f1143ab7be"),
    gallery: [u("photo-1620916566398-39f1143ab7be"), u("photo-1556228720-195a672e8a03"), u("photo-1571781926291-c477ebfd024b")],
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
    image: u("photo-1541643600914-78b084683601"),
    gallery: [u("photo-1541643600914-78b084683601"), u("photo-1592945403244-b3fbafd7f539"), u("photo-1594035910387-fea47794261f")],
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
    image: u("photo-1592432678016-e910b452f9a2"),
    gallery: [u("photo-1592432678016-e910b452f9a2"), u("photo-1518611012118-696072aa579a"), u("photo-1601925260368-ae2f83cf8b7f")],
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
    image: u("photo-1512820790803-83ca734da794"),
    gallery: [u("photo-1512820790803-83ca734da794"), u("photo-1524578271613-d550eacf6090"), u("photo-1519681393784-d120267933ba")],
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
    image: u("photo-1517701550927-30cf4ba1dba5"),
    gallery: [u("photo-1517701550927-30cf4ba1dba5"), u("photo-1544787219-7f47ccb76574"), u("photo-1495474472287-4d71bcdd2085")],
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
    image: u("photo-1553062407-98eeb64c6a62"),
    gallery: [u("photo-1553062407-98eeb64c6a62"), u("photo-1548036328-c9fa89d128fa"), u("photo-1622560481158-95c1bd6c5eb2")],
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
    image: u("photo-1592434134753-a70baf7979d5"),
    gallery: [u("photo-1592434134753-a70baf7979d5"), u("photo-1512820790803-83ca734da794"), u("photo-1519682337058-a94d519337bc")],
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
    image: u("photo-1608043152269-423dbba4e7e1"),
    gallery: [u("photo-1608043152269-423dbba4e7e1"), u("photo-1545454675-3531b543be5d"), u("photo-1558379852-f0e9e5e6f39d")],
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
