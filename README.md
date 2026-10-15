# ShopSphere — Modular E-commerce Web Application

A GitHub-ready front-end project built with **HTML, CSS, and vanilla JavaScript ES modules**. It demonstrates signup/login, Local Storage, protected product access, DOM-rendered product cards, a shopping cart, and separate user/admin experiences.

## Features

### User module
- Sign up with name, email, and password.
- Account details are stored in browser Local Storage.
- Login validation and logout.
- Product catalogue is created dynamically with JavaScript DOM manipulation.
- Search products and filter by category.
- Add products to cart, adjust quantities, remove items, and place a demo order.
- Store access is gated behind login.

### Admin module
- Separate admin navigation and dashboard.
- Add, edit, and delete products.
- View product, registered-user, and demo-order counts.
- View registered users (passwords are not displayed).

### Project modules
- `assets/js/auth.js` — signup, login, logout.
- `assets/js/storage.js` — Local Storage persistence.
- `assets/js/products.js` — catalogue rendering and product operations.
- `assets/js/cart.js` — cart and demo orders.
- `assets/js/admin.js` — admin catalogue and user dashboard.
- `assets/js/data.js` — seed products and demo admin.
- `assets/js/app.js` — navigation and application integration.

## Run locally

Because this project uses JavaScript ES modules, use a local web server rather than opening `index.html` directly.

### Option 1: VS Code
1. Extract the ZIP.
2. Open the `ecommerce-web-app` folder in VS Code.
3. Install/enable the **Live Server** extension if you do not already have it.
4. Right-click `index.html` → **Open with Live Server**.

### Option 2: Python
Open a terminal in the project folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Demo admin account

- **Email:** `admin@shopsphere.demo`
- **Password:** `Admin123!`

Create a normal user through the **Create account** tab.

## Push to GitHub

1. Create a new empty repository on GitHub.
2. Extract the ZIP and open the extracted folder in a terminal.
3. Run:

```bash
git init
git add .
git commit -m "Build modular ShopSphere e-commerce demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own repository URL.

## Important security note

This is an **educational front-end demonstration**, not production authentication. Local Storage can be inspected and changed by the browser user, and the demo stores passwords as plain text. Do not use real passwords or personal data. A real e-commerce system should use a backend, server-side authorization, password hashing, secure sessions, validation, and a payment provider. Admin access in this static demo is not secure against a determined user.

## Reset demo data

In your browser's developer tools, clear Local Storage for the local site and reload. The seed products and demo admin account will be recreated.

## Tech stack

- HTML5
- CSS3 (responsive layout)
- Vanilla JavaScript with ES modules
- Browser Local Storage
- Git / GitHub
"# Lab-in-sem-project" 
