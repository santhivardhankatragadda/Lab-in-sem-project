// Centralized Local Storage access. This is suitable for a class demo, not production authentication.
import { DEFAULT_PRODUCTS, ADMIN_ACCOUNT } from "./data.js";

const KEYS = { users: "shopsphere_users", products: "shopsphere_products", session: "shopsphere_session", cart: "shopsphere_cart", orders: "shopsphere_orders" };

function read(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

export function initializeStorage() {
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, [ADMIN_ACCOUNT]);
  else {
    const users = read(KEYS.users, []);
    if (!users.some(u => u.email.toLowerCase() === ADMIN_ACCOUNT.email)) {
      users.push(ADMIN_ACCOUNT); write(KEYS.users, users);
    }
  }
  if (!localStorage.getItem(KEYS.products)) write(KEYS.products, DEFAULT_PRODUCTS);
  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, []);
  if (!localStorage.getItem(KEYS.cart)) write(KEYS.cart, []);
}
export const getUsers = () => read(KEYS.users, []);
export const saveUsers = users => write(KEYS.users, users);
export const getProducts = () => read(KEYS.products, []);
export const saveProducts = products => write(KEYS.products, products);
export const getSession = () => read(KEYS.session, null);
export const saveSession = session => write(KEYS.session, session);
export const clearSession = () => localStorage.removeItem(KEYS.session);
export const getCart = () => read(KEYS.cart, []);
export const saveCart = cart => write(KEYS.cart, cart);
export const getOrders = () => read(KEYS.orders, []);
export const saveOrders = orders => write(KEYS.orders, orders);
export const clearCart = () => saveCart([]);
