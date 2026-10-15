import { getCart, saveCart, getProducts, clearCart, getOrders, saveOrders } from "./storage.js";
import { money, escapeHTML } from "./products.js";

export function addToCart(productId) {
  const product = getProducts().find(item => item.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  saveCart(cart);
}
export function updateQuantity(productId, delta) {
  const cart = getCart().map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
    .filter(item => item.quantity > 0);
  saveCart(cart);
}
export function removeFromCart(productId) { saveCart(getCart().filter(item => item.productId !== productId)); }
export function cartCount() { return getCart().reduce((sum, item) => sum + item.quantity, 0); }
export function renderCart(container, subtotalNode, totalNode, onChange) {
  const products = getProducts();
  const cart = getCart().map(item => ({ ...item, product: products.find(p => p.id === item.productId) })).filter(item => item.product);
  if (!cart.length) {
    container.innerHTML = '<div class="empty-cart"><strong>Your cart is empty.</strong>Head to the shop and add something you like.</div>';
  } else {
    container.innerHTML = cart.map(item => `<article class="cart-row">
      <div class="cart-emoji">${escapeHTML(item.product.emoji || "🛍️")}</div>
      <div><h3>${escapeHTML(item.product.name)}</h3><p>${money(item.product.price)} each</p><div class="quantity"><button data-qty="-1" data-id="${escapeHTML(item.productId)}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="1" data-id="${escapeHTML(item.productId)}" aria-label="Increase quantity">＋</button></div></div>
      <div class="cart-price">${money(item.product.price * item.quantity)}<button class="remove-btn" data-remove="${escapeHTML(item.productId)}">Remove</button></div>
    </article>`).join("");
  }
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  subtotalNode.textContent = money(subtotal); totalNode.textContent = money(subtotal);
  container.querySelectorAll("[data-qty]").forEach(button => button.addEventListener("click", () => { updateQuantity(button.dataset.id, Number(button.dataset.qty)); onChange(); }));
  container.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => { removeFromCart(button.dataset.remove); onChange(); }));
  return subtotal;
}
export function placeDemoOrder() {
  const cart = getCart();
  if (!cart.length) return { ok: false, message: "Your cart is empty." };
  const products = getProducts();
  const items = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { name: product.name, price: product.price, quantity: item.quantity } : null;
  }).filter(Boolean);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orders = getOrders();
  orders.push({ id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), items, total });
  saveOrders(orders); clearCart();
  return { ok: true, total };
}
