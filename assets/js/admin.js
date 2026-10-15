import { getProducts, getUsers, getOrders } from "./storage.js";
import { createProduct, updateProduct, deleteProduct, money, escapeHTML } from "./products.js";

export function renderAdmin({ productList, userList, stats, onChange }) {
  const products = getProducts();
  const users = getUsers().filter(user => user.role !== "admin");
  stats.products.textContent = products.length;
  stats.users.textContent = users.length;
  stats.orders.textContent = getOrders().length;
  document.querySelector("#catalogue-count").textContent = `${products.length} items`;
  productList.innerHTML = products.map(product => `<div class="admin-product">
    <span class="mini-emoji">${escapeHTML(product.emoji || "🛍️")}</span>
    <div><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.category)} · ${money(product.price)}</small></div>
    <div class="row-actions"><button data-edit="${escapeHTML(product.id)}">Edit</button><button class="delete-product" data-delete="${escapeHTML(product.id)}">Delete</button></div>
  </div>`).join("") || '<p class="muted tiny">No products yet. Add one using the form.</p>';
  userList.innerHTML = users.length ? `<table class="user-table"><thead><tr><th>Name</th><th>Email</th><th>Registered</th></tr></thead><tbody>${users.map(user => `<tr><td>${escapeHTML(user.name)}</td><td>${escapeHTML(user.email)}</td><td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Demo account"}</td></tr>`).join("")}</tbody></table>` : '<p class="muted tiny">No registered users yet.</p>';
  productList.querySelectorAll("[data-edit]").forEach(button => button.addEventListener("click", () => onChange("edit", products.find(p => p.id === button.dataset.edit))));
  productList.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => {
    const product = products.find(p => p.id === button.dataset.delete);
    if (product && confirm(`Delete "${product.name}"?`)) { deleteProduct(product.id); onChange("refresh"); }
  }));
}
export function saveProductForm(fields) {
  const product = { name: fields.name.trim(), category: fields.category.trim(), price: Number(fields.price), emoji: fields.emoji.trim() || "🛍️", description: fields.description.trim() };
  if (!product.name || !product.category || !product.description || !Number.isFinite(product.price) || product.price <= 0) {
    return { ok: false, message: "Enter a name, category, description, and a price greater than zero." };
  }
  if (fields.id) updateProduct(fields.id, product); else createProduct(product);
  return { ok: true, message: fields.id ? "Product updated successfully." : "Product added successfully." };
}
