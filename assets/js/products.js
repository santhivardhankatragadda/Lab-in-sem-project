import { getProducts, saveProducts } from "./storage.js";

export function renderProducts(container, { search = "", category = "all", onAdd } = {}) {
  const normalizedSearch = search.trim().toLowerCase();
  const products = getProducts().filter(product => {
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalizedSearch);
    return matchesSearch && (category === "all" || product.category === category);
  });
  container.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-art"><span class="category-tag">${escapeHTML(product.category)}</span><span aria-hidden="true">${escapeHTML(product.emoji || "🛍️")}</span></div>
      <div class="product-info"><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.description)}</p>
        <div class="product-bottom"><span class="price">${money(product.price)}</span><button class="add-btn" data-add="${escapeHTML(product.id)}">＋ Add</button></div>
      </div>
    </article>`).join("");
  container.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => onAdd?.(button.dataset.add)));
  return products.length;
}
export function getProductCategories() {
  return [...new Set(getProducts().map(product => product.category))].sort((a, b) => a.localeCompare(b));
}
export function createProduct(product) {
  const products = getProducts();
  products.unshift({ ...product, id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` });
  saveProducts(products);
}
export function updateProduct(id, updated) {
  saveProducts(getProducts().map(product => product.id === id ? { ...product, ...updated, id } : product));
}
export function deleteProduct(id) { saveProducts(getProducts().filter(product => product.id !== id)); }
export function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0); }
export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
