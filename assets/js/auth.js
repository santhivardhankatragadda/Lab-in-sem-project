import { getUsers, saveUsers, saveSession, clearSession } from "./storage.js";

const cleanEmail = email => email.trim().toLowerCase();

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const normalizedEmail = cleanEmail(email);
  if (users.some(user => cleanEmail(user.email) === normalizedEmail)) {
    return { ok: false, message: "An account with this email already exists." };
  }
  const user = { id: `u_${Date.now()}`, name: name.trim(), email: normalizedEmail, password, role: "user", createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  saveSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  return { ok: true, user: getSessionUser(user) };
}
export function loginUser({ email, password }) {
  const user = getUsers().find(item => cleanEmail(item.email) === cleanEmail(email) && item.password === password);
  if (!user) return { ok: false, message: "Email or password is incorrect." };
  const session = getSessionUser(user);
  saveSession(session);
  return { ok: true, user: session };
}
function getSessionUser(user) { return { id: user.id || "admin", name: user.name, email: user.email, role: user.role }; }
export function logoutUser() { clearSession(); }
