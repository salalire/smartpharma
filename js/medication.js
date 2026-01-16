// ===============================
// SHOP PAGE JAVASCRIPT
// ===============================

// Get elements
const searchInput = document.querySelector(".search-box input");
const productCards = document.querySelectorAll(".product-card");
const addToCartButtons = document.querySelectorAll(".shop-btn");

// CART DATA
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// SEARCH FUNCTIONALITY
// ===============================
searchInput.addEventListener("keyup", () => {
  const searchValue = searchInput.value.toLowerCase();

  productCards.forEach(card => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = productName.includes(searchValue) ? "flex" : "none";
  });
});

// ===============================
// ADD TO CART FUNCTIONALITY
// ===============================
addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.parentElement;

    const product = {
      name: card.querySelector("h3").textContent,
      price: card.querySelector(".price").textContent,
      image: card.querySelector("img").src,
      quantity: 1
    };

    addToCart(product);
    showAddToCartMessage(product.name);

  });
});

// ===============================
// CART LOGIC
// ===============================
function addToCart(product) {
  const existingProduct = cart.find(item => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===============================
// CART COUNT (Navbar-ready)
// ===============================
function updateCartCount() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector(".cart-count");
  const cartIcon = document.querySelector(".cart-icon i");

  if (!cartBadge) return;

  if (cartCount > 0) {
    cartBadge.style.display = "block";
    cartBadge.textContent = cartCount;

    // Animate cart icon
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => {
      cartIcon.classList.remove("cart-bounce");
    }, 400);
  } else {
    cartBadge.style.display = "none";
  }
}


updateCartCount();

// ===============================
// PHARMACY LOGIC (OPTIONAL)
// ===============================

// Medicines requiring prescription
const prescriptionMedicines = [
  "Insulin Injection",
  "Antibiotic Syrup"
];

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const productName = button.parentElement.querySelector("h3").textContent;

    if (prescriptionMedicines.includes(productName)) {
      alert("⚠ Prescription required for this medicine.");
    }
  });
});

function showAddToCartMessage(name) {
  const message = document.createElement("div");
  message.className = "add-message";
  message.textContent = `${name} added to cart 🛒`;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

