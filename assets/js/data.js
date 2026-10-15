// Seed catalogue and demo admin account.
export const DEFAULT_PRODUCTS = [
  {id:"p101",name:"Studio Wireless Headphones",category:"Electronics",price:79.99,emoji:"🎧",description:"Comfortable wireless sound for work, travel, and downtime."},
  {id:"p102",name:"Everyday Smart Watch",category:"Electronics",price:119.00,emoji:"⌚",description:"Keep your day on track with a clean, modern smartwatch."},
  {id:"p103",name:"Classic Canvas Sneakers",category:"Fashion",price:54.50,emoji:"👟",description:"Versatile low-top sneakers made for everyday adventures."},
  {id:"p104",name:"Minimal Desk Lamp",category:"Home",price:32.00,emoji:"💡",description:"Warm, focused lighting for your desk or bedside table."},
  {id:"p105",name:"Insulated Travel Bottle",category:"Lifestyle",price:24.99,emoji:"🧴",description:"A reusable bottle to keep your drink ready on the go."},
  {id:"p106",name:"Compact Digital Camera",category:"Electronics",price:249.00,emoji:"📷",description:"Capture everyday memories with a pocket-friendly camera."},
  {id:"p107",name:"Soft Knit Backpack",category:"Fashion",price:46.75,emoji:"🎒",description:"A lightweight carry-all for classes, commutes, and weekends."},
  {id:"p108",name:"Ceramic Coffee Set",category:"Home",price:28.00,emoji:"☕",description:"A simple two-piece set for a calmer coffee ritual."}
];

export const ADMIN_ACCOUNT = {
  name: "ShopSphere Admin",
  email: "admin@shopsphere.demo",
  // Demo-only password. Never store plain-text passwords in a real application.
  password: "Admin123!",
  role: "admin"
};
