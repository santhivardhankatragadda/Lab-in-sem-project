import { initializeStorage, getSession, getProducts, getUsers } from "./storage.js";
import { registerUser, loginUser, logoutUser } from "./auth.js";
import { renderProducts, getProductCategories, money } from "./products.js";
import { addToCart, cartCount, renderCart, placeDemoOrder } from "./cart.js";
import { renderAdmin, saveProductForm } from "./admin.js";

initializeStorage();
const $ = selector => document.querySelector(selector);
const views = { auth: $("#auth-view"), shop: $("#shop-view"), cart: $("#cart-view"), admin: $("#admin-view") };
let activeView = "auth";
let toastTimer;

function toast(message) {
  const node = $("#toast"); node.textContent = message; node.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
}
function showMessage(node, message, success = false) {
  node.textContent = message; node.classList.toggle("success", success);
}
function setAuthTab(tab) {
  const login = tab === "login";
  $("#login-form").classList.toggle("hidden", !login);
  $("#signup-form").classList.toggle("hidden", login);
  document.querySelectorAll("[data-auth-tab]").forEach(button => button.classList.toggle("active", button.dataset.authTab === tab));
  showMessage($("#auth-message"), "");
}
function currentUser() { return getSession(); }
function canAccess(view) {
  const user = currentUser();
  if (!user && view !== "auth") { toast("Please log in before accessing the store."); return false; }
  if (view === "admin" && user?.role !== "admin") { toast("Admin access is required."); return false; }
  return true;
}
function navigate(view) {
  if (!canAccess(view)) view = currentUser() ? "shop" : "auth";
  activeView = view;
  Object.entries(views).forEach(([key, node]) => node.classList.toggle("hidden", key !== view));
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  if (view === "shop") refreshShop();
  if (view === "cart") refreshCart();
  if (view === "admin") refreshAdmin();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function updateHeader() {
  const user = currentUser();
  $("#shop-nav").classList.toggle("hidden", !user);
  $("#cart-nav").classList.toggle("hidden", !user);
  $("#admin-nav").classList.toggle("hidden", user?.role !== "admin");
  $("#logout-btn").classList.toggle("hidden", !user);
  $("#welcome-label").textContent = user ? `Hi, ${user.name.split(" ")[0]}` : "";
  $("#cart-count").textContent = cartCount();
  document.querySelectorAll('[data-view="auth"]').forEach(button => button.classList.toggle("active", activeView === "auth"));
}
function refreshShop() {
  const categories = getProductCategories();
  const select = $("#category-filter"), previous = select.value || "all";
  select.innerHTML = '<option value="all">All categories</option>' + categories.map(category => `<option value="${category.replace(/"/g, "&quot;")}">${category}</option>`).join("");
  select.value = categories.includes(previous) ? previous : "all";
  const count = renderProducts($("#product-grid"), { search: $("#search-input").value, category: select.value, onAdd: id => {
    addToCart(id); updateHeader(); toast("Added to your cart.");
  }});
  $("#empty-products").classList.toggle("hidden", count > 0);
}
function refreshCart() {
  renderCart($("#cart-items"), $("#cart-subtotal"), $("#cart-total"), () => { refreshCart(); updateHeader(); });
  updateHeader();
}
function resetProductForm() {
  $("#product-form").reset(); $("#product-id").value = ""; $("#product-emoji").value = "🛍️";
  $("#product-form-title").textContent = "Add a product"; $("#save-product-btn").textContent = "Save product";
  $("#cancel-edit-btn").classList.add("hidden");
}
function refreshAdmin(action, product) {
  if (action === "edit" && product) {
    $("#product-id").value = product.id; $("#product-name").value = product.name; $("#product-category").value = product.category;
    $("#product-price").value = product.price; $("#product-emoji").value = product.emoji || "🛍️"; $("#product-description").value = product.description;
    $("#product-form-title").textContent = "Edit product"; $("#save-product-btn").textContent = "Update product"; $("#cancel-edit-btn").classList.remove("hidden");
    $("#product-name").focus();
  }
  renderAdmin({ productList: $("#admin-product-list"), userList: $("#admin-user-list"),
    stats: { products: $("#stat-products"), users: $("#stat-users"), orders: $("#stat-orders") },
    onChange: (nextAction, nextProduct) => { if (nextAction === "edit") refreshAdmin("edit", nextProduct); else refreshAdmin(); }
  });
}
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
document.querySelectorAll("[data-auth-tab]").forEach(button => button.addEventListener("click", () => setAuthTab(button.dataset.authTab)));
document.querySelectorAll("[data-switch-auth]").forEach(button => button.addEventListener("click", () => setAuthTab(button.dataset.switchAuth)));
$("#signup-form").addEventListener("submit", event => {
  event.preventDefault();
  const result = registerUser({ name: $("#signup-name").value, email: $("#signup-email").value, password: $("#signup-password").value });
  if (!result.ok) return showMessage($("#auth-message"), result.message);
  $("#signup-form").reset(); updateHeader(); toast("Account created. Welcome to ShopSphere!"); navigate("shop");
});
$("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  const result = loginUser({ email: $("#login-email").value, password: $("#login-password").value });
  if (!result.ok) return showMessage($("#auth-message"), result.message);
  $("#login-form").reset(); updateHeader(); toast("Login successful."); navigate(result.user.role === "admin" ? "admin" : "shop");
});
$("#logout-btn").addEventListener("click", () => { logoutUser(); updateHeader(); navigate("auth"); setAuthTab("login"); toast("You have logged out."); });
$("#search-input").addEventListener("input", refreshShop);
$("#category-filter").addEventListener("change", refreshShop);
$("#checkout-btn").addEventListener("click", () => {
  const result = placeDemoOrder();
  if (!result.ok) return toast(result.message);
  refreshCart(); refreshAdmin(); toast(`Demo order placed: ${money(result.total)}. No payment collected.`);
});
$("#product-form").addEventListener("submit", event => {
  event.preventDefault();
  const result = saveProductForm({ id: $("#product-id").value, name: $("#product-name").value, category: $("#product-category").value,
    price: $("#product-price").value, emoji: $("#product-emoji").value, description: $("#product-description").value });
  showMessage($("#admin-message"), result.message, result.ok);
  if (result.ok) { resetProductForm(); refreshAdmin(); refreshShop(); }
});
$("#cancel-edit-btn").addEventListener("click", resetProductForm);

// A direct URL load starts at login unless a valid demo session exists in Local Storage.
updateHeader();
if (currentUser()) navigate(currentUser().role === "admin" ? "admin" : "shop");
else navigate("auth");
