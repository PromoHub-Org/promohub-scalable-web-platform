// Master Flash Sale Event Target Date (Set to 14 Days to D-Day)
export const EVENT_START_DATE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_DEALS = [
  {
    id: 1,
    brand: "Sony",
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling headphones with dual processors, 8 microphones, and 30-hour battery.",
    price: 149.99,
    original_price: 399.99,
    total_stock: 50,
    stock_remaining: 50, // Available stock
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Audio",
    interested_count: 1080,
    is_interested: false
  },
  {
    id: 2,
    brand: "Apple",
    title: "Apple Watch Series 9 GPS 45mm",
    description: "Always-on Retina display, S9 SiP chip, double tap gesture, and comprehensive health monitoring.",
    price: 199.00,
    original_price: 429.00,
    total_stock: 30,
    stock_remaining: 30, // Available stock
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Wearables",
    interested_count: 420,
    is_interested: false
  },
  {
    id: 3,
    brand: "Keychron",
    title: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    description: "Custom QMK/VIA full-aluminum hot-swappable keyboard with double-gasket design and RGB backlight.",
    price: 69.50,
    original_price: 199.00,
    total_stock: 100,
    stock_remaining: 100, // Available stock
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Peripherals",
    interested_count: 890,
    is_interested: false
  },
  {
    id: 4,
    brand: "Anker",
    title: "Anker 737 Power Bank (PowerCore 24K)",
    description: "24,000mAh 140W 3-port ultra-fast portable charger with smart digital display.",
    price: 49.99,
    original_price: 149.99,
    total_stock: 80,
    stock_remaining: 80, // Available stock
    start_time: new Date(Date.now() - 1800000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: false,
    category: "Accessories",
    interested_count: 210,
    is_interested: false
  },
  {
    id: 5,
    brand: "Samsung",
    title: "Samsung T7 Shield 2TB Portable SSD",
    description: "Rugged external solid-state drive with read speeds up to 1,050MB/s, IP65 water and dust resistance.",
    price: 79.99,
    original_price: 219.99,
    total_stock: 40,
    stock_remaining: 40, // Available stock
    start_time: new Date(Date.now() - 500000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Storage",
    interested_count: 560,
    is_interested: false
  },
  {
    id: 6,
    brand: "Bose",
    title: "Bose QuietComfort Ultra Wireless Earbuds",
    description: "World-class active noise cancellation with spatial audio, CustomTune technology, and touch controls.",
    price: 129.00,
    original_price: 299.00,
    total_stock: 25,
    stock_remaining: 25, // Available stock
    start_time: new Date(Date.now() - 14400000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: false,
    category: "Audio",
    interested_count: 300,
    is_interested: false
  },
  {
    id: 7,
    brand: "Logitech",
    title: "Logitech MX Master 3S Performance Wireless Mouse",
    description: "8K DPI track-on-glass sensor, Quiet Clicks, and electromagnetic MagSpeed scrolling wheel.",
    price: 39.99,
    original_price: 99.99,
    total_stock: 60,
    stock_remaining: 60, // Available stock
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: false,
    category: "Peripherals",
    interested_count: 750,
    is_interested: false
  },
  {
    id: 8,
    brand: "Dyson",
    title: "Dyson Supersonic Airwrap Multi-Styler Complete",
    description: "Engineered for multiple hair types with Coanda airflow control, intelligent heat control, and storage case.",
    price: 249.00,
    original_price: 599.00,
    total_stock: 15,
    stock_remaining: 15, // Available stock
    start_time: new Date(Date.now() - 1800000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Lifestyle",
    interested_count: 240,
    is_interested: false
  },
  {
    id: 9,
    brand: "Nintendo",
    title: "Nintendo Switch OLED Model Special Edition",
    description: "Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, and 64GB internal storage.",
    price: 179.99,
    original_price: 349.99,
    total_stock: 35,
    stock_remaining: 35, // Available stock
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: true,
    category: "Gaming",
    interested_count: 420,
    is_interested: false
  },
  {
    id: 10,
    brand: "LG",
    title: "LG UltraGear 27\" QHD Gaming Monitor 165Hz",
    description: "Nano IPS 1ms G-SYNC compatible display with HDR400 and ultra-thin bezel design.",
    price: 159.00,
    original_price: 379.00,
    total_stock: 20,
    stock_remaining: 20, // Available stock
    start_time: new Date(Date.now() - 1000000).toISOString(),
    end_time: EVENT_START_DATE,
    is_featured: false,
    category: "Displays",
    interested_count: 180,
    is_interested: false
  }
];
