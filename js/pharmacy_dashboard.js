const API = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

// ── Auth guard ───────────────────────────────────────────────
const user = getUser();
if (!user || user.role !== "owner") {
  window.location.href = "login.html";
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Set user info in sidebar
  const initial = (user.username || "O").charAt(0).toUpperCase();
  document.getElementById("sidebar-avatar").textContent   = initial;
  document.getElementById("sidebar-username").textContent = user.username || "Owner";

  // Set date
  document.getElementById("topbar-date").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Sidebar nav clicks
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      switchSection(item.dataset.section);
    });
  });

  loadStats();
  loadProducts();
  loadOrders();
});

// ── Section switching ────────────────────────────────────────
function switchSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  document.getElementById(`section-${name}`)?.classList.add("active");
  document.querySelector(`.nav-item[data-section="${name}"]`)?.classList.add("active");

  const titles = { overview: "Overview", products: "Products", orders: "Orders" };
  document.getElementById("topbar-title").textContent = titles[name] || name;
}

// ── Sidebar toggle (mobile) ──────────────────────────────────
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// ── Logout ───────────────────────────────────────────────────
function dashboardLogout() {
  localStorage.removeItem("currentUser");
  fetch(`${API}/authentication/logout.php`, { credentials: "include" });
  window.location.href = "login.html";
}

// ════════════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════════════
async function loadStats() {
  try {
    const res  = await fetch(`${API}/dashboard/owner_stats.php`, { credentials: "include" });
    const data = await res.json();

    if (data.status !== "success") return;

    document.getElementById("stat-products").textContent = data.total_products;
    document.getElementById("stat-orders").textContent   = data.total_orders;
    document.getElementById("stat-pending").textContent  = data.pending_orders;
    document.getElementById("stat-revenue").textContent  = "ETB " + data.revenue;
    document.getElementById("sidebar-pharmacy-name").textContent = data.pharmacy_name;
  } catch (e) {
    console.error("Stats error:", e);
  }
}

// ════════════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════════════
async function loadProducts() {
  const tbody = document.getElementById("products-tbody");
  try {
    const res  = await fetch(`${API}/products/get_product.php`, { credentials: "include" });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No products yet. Add your first product.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.data.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escHtml(p.name)}</strong></td>
        <td>ETB ${parseFloat(p.price).toFixed(2)}</td>
        <td>${p.requires_prescription == 1
          ? '<span class="badge pending">Required</span>'
          : '<span class="badge completed">No</span>'}</td>
        <td>${formatDate(p.created_at)}</td>
        <td>
          <button class="action-btn secondary" style="padding:6px 12px;font-size:12px"
            onclick="openProductModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <i class="fas fa-pen"></i>
          </button>
          <button class="action-btn danger" style="padding:6px 12px;font-size:12px;margin-left:6px"
            onclick="deleteProduct(${p.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">Failed to load products.</td></tr>`;
  }
}

// ── Product Modal ────────────────────────────────────────────
function openProductModal(product = null) {
  document.getElementById("modal-product-id").value    = product ? product.id : "";
  document.getElementById("modal-name").value          = product ? product.name : "";
  document.getElementById("modal-price").value         = product ? product.price : "";
  document.getElementById("modal-image").value         = product ? (product.image || "") : "";
  document.getElementById("modal-prescription").checked = product ? product.requires_prescription == 1 : false;
  document.getElementById("modal-title").textContent   = product ? "Edit Product" : "Add Product";
  document.getElementById("modal-msg").textContent     = "";

  document.getElementById("product-modal-overlay").classList.remove("hidden");
  document.getElementById("product-modal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal-overlay").classList.add("hidden");
  document.getElementById("product-modal").classList.add("hidden");
}

async function saveProduct() {
  const id    = document.getElementById("modal-product-id").value;
  const name  = document.getElementById("modal-name").value.trim();
  const price = document.getElementById("modal-price").value;
  const image = document.getElementById("modal-image").value.trim();
  const rx    = document.getElementById("modal-prescription").checked ? 1 : 0;
  const msg   = document.getElementById("modal-msg");

  if (!name || !price) {
    msg.style.color = "red";
    msg.textContent = "Name and price are required.";
    return;
  }

  const endpoint = id ? `${API}/products/update_product.php` : `${API}/products/add_product.php`;
  const body     = { name, price: parseFloat(price), image: image || null, requires_prescription: rx };
  if (id) body.id = parseInt(id);

  try {
    const res  = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.status === "success") {
      msg.style.color = "green";
      msg.textContent = id ? "Product updated!" : "Product added!";
      setTimeout(() => {
        closeProductModal();
        loadProducts();
        loadStats();
      }, 800);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Failed.";
    }
  } catch (e) {
    msg.style.color = "red";
    msg.textContent = "Server error.";
  }
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  try {
    const res  = await fetch(`${API}/products/delete_product.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.status === "success") {
      loadProducts();
      loadStats();
    }
  } catch (e) {
    alert("Server error.");
  }
}

// ════════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════════
async function loadOrders() {
  const tbody = document.getElementById("orders-tbody");
  try {
    const res  = await fetch(`${API}/orders/get_orders.php`, { credentials: "include" });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No orders yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.data.map((o, i) => `
      <tr>
        <td>#${o.id}</td>
        <td>
          <strong>${escHtml(o.customer_name)}</strong><br>
          <small style="color:#94a3b8">${escHtml(o.customer_email)}</small>
        </td>
        <td>ETB ${parseFloat(o.total_price || 0).toFixed(2)}</td>
        <td><span class="badge ${o.status}">${capitalize(o.status)}</span></td>
        <td>${formatDate(o.created_at)}</td>
        <td>
          <select class="status-select" onchange="updateOrderStatus(${o.id}, this.value)">
            <option value="pending"    ${o.status === "pending"    ? "selected" : ""}>Pending</option>
            <option value="processing" ${o.status === "processing" ? "selected" : ""}>Processing</option>
            <option value="completed"  ${o.status === "completed"  ? "selected" : ""}>Completed</option>
            <option value="cancelled"  ${o.status === "cancelled"  ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">Failed to load orders.</td></tr>`;
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`${API}/orders/update_status.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ order_id: orderId, status })
    });
    loadStats();
    loadOrders();
  } catch (e) {
    alert("Failed to update status.");
  }
}

// ── Helpers ──────────────────────────────────────────────────
function escHtml(str) {
  return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

