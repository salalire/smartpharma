const API = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

// ── Auth guard ───────────────────────────────────────────────
const user = getUser();
if (!user || user.role !== "admin") {
  window.location.href = "login.html";
}

let allApplications = [];
let currentFilter   = "all";

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const initial = (user.username || "A").charAt(0).toUpperCase();
  document.getElementById("sidebar-avatar").textContent   = initial;
  document.getElementById("sidebar-username").textContent = user.username || "Admin";

  document.getElementById("topbar-date").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      switchSection(item.dataset.section);
    });
  });

  loadStats();
  loadApplications();
  loadUsers();
});

// ── Section switching ────────────────────────────────────────
function switchSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById(`section-${name}`)?.classList.add("active");
  document.querySelector(`.nav-item[data-section="${name}"]`)?.classList.add("active");
  const titles = { overview: "Overview", applications: "Applications", users: "Users" };
  document.getElementById("topbar-title").textContent = titles[name] || name;
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function adminLogout() {
  localStorage.removeItem("currentUser");
  fetch(`${API}/authentication/logout.php`, { credentials: "include" });
  window.location.href = "login.html";
}

// ════════════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════════════
async function loadStats() {
  try {
    const res  = await fetch(`${API}/dashboard/admin_stats.php`, { credentials: "include" });
    const data = await res.json();
    if (data.status !== "success") return;

    document.getElementById("stat-users").textContent    = data.total_users;
    document.getElementById("stat-owners").textContent   = data.total_owners;
    document.getElementById("stat-pending").textContent  = data.pending_apps;
    document.getElementById("stat-products").textContent = data.total_products;
    document.getElementById("stat-approved").textContent = data.approved_apps;
    document.getElementById("stat-rejected").textContent = data.rejected_apps;
    document.getElementById("stat-orders").textContent   = data.total_orders;

    // Badge on sidebar
    const badge = document.getElementById("nav-pending-count");
    if (data.pending_apps > 0) {
      badge.textContent = data.pending_apps;
      badge.classList.add("visible");
    } else {
      badge.classList.remove("visible");
    }
  } catch (e) { console.error("Stats error:", e); }
}

// ════════════════════════════════════════════════════════════
// APPLICATIONS
// ════════════════════════════════════════════════════════════
async function loadApplications() {
  try {
    const res  = await fetch(`${API}/admin/get_application.php`, { credentials: "include" });
    const data = await res.json();
    allApplications = data.data || [];
    renderApplications();
  } catch (e) {
    document.getElementById("applications-tbody").innerHTML =
      `<tr><td colspan="9" class="table-empty">Failed to load applications.</td></tr>`;
  }
}

function filterApps(btn) {
  document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  renderApplications();
}

function renderApplications() {
  const tbody = document.getElementById("applications-tbody");
  const list  = currentFilter === "all"
    ? allApplications
    : allApplications.filter(a => a.status === currentFilter);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="table-empty">No applications found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((app, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escHtml(app.pharmacy_name)}</strong></td>
      <td>${escHtml(app.first_name)} ${escHtml(app.last_name)}</td>
      <td>${escHtml(app.email)}</td>
      <td>${escHtml(app.region)}${app.city ? " / " + escHtml(app.city) : ""}</td>
      <td>${escHtml(app.tin_number)}</td>
      <td>${formatDate(app.created_at)}</td>
      <td><span class="badge ${app.status}">${capitalize(app.status)}</span></td>
      <td>
        <button class="action-btn view" onclick="viewDetail(${app.id})">
          <i class="fas fa-eye"></i>
        </button>
        ${app.status === "pending" ? `
        <button class="action-btn approve" style="margin-left:4px" onclick="approveApp(${app.id})">
          <i class="fas fa-check"></i>
        </button>
        <button class="action-btn reject" style="margin-left:4px" onclick="rejectApp(${app.id})">
          <i class="fas fa-times"></i>
        </button>` : ""}
      </td>
    </tr>
  `).join("");
}

async function approveApp(id) {
  if (!confirm("Approve this pharmacy application?")) return;
  try {
    const res  = await fetch(`${API}/admin/approve_owner.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ application_id: id })
    });
    const data = await res.json();
    if (data.status === "success") {
      showToast("Pharmacy approved successfully!", "success");
      loadApplications();
      loadStats();
    } else {
      showToast(data.message || "Failed.", "error");
    }
  } catch (e) { showToast("Server error.", "error"); }
}

async function rejectApp(id) {
  if (!confirm("Reject this application?")) return;
  try {
    const res  = await fetch(`${API}/admin/reject_owner.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ application_id: id })
    });
    const data = await res.json();
    if (data.status === "success") {
      showToast("Application rejected.", "error");
      loadApplications();
      loadStats();
    } else {
      showToast(data.message || "Failed.", "error");
    }
  } catch (e) { showToast("Server error.", "error"); }
}

// ── Detail Modal ─────────────────────────────────────────────
function viewDetail(id) {
  const app = allApplications.find(a => a.id === id);
  if (!app) return;

  const fields = [
    ["Pharmacy Name",  app.pharmacy_name],
    ["First Name",     app.first_name],
    ["Middle Name",    app.middle_name || "—"],
    ["Last Name",      app.last_name],
    ["Email",          app.email],
    ["TIN Number",     app.tin_number],
    ["Region",         app.region],
    ["City",           app.city || "—"],
    ["Sub City",       app.sub_city || "—"],
    ["Woreda",         app.woreda || "—"],
    ["Status",         `<span class="badge ${app.status}">${capitalize(app.status)}</span>`],
    ["Applied On",     formatDate(app.created_at)]
  ];

  document.getElementById("detail-body").innerHTML = fields.map(([label, value]) => `
    <div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${escHtml(String(value || "—"))
        .replace(/&lt;span/g, "<span").replace(/&gt;/g, ">").replace(/&lt;\/span&gt;/g, "</span>")}</span>
    </div>
  `).join("");

  document.getElementById("detail-footer").innerHTML = app.status === "pending" ? `
    <button class="action-btn approve" onclick="approveApp(${app.id}); closeDetail()">
      <i class="fas fa-check"></i> Approve
    </button>
    <button class="action-btn reject" onclick="rejectApp(${app.id}); closeDetail()">
      <i class="fas fa-times"></i> Reject
    </button>
  ` : `<button class="action-btn view" onclick="closeDetail()">Close</button>`;

  document.getElementById("detail-overlay").classList.remove("hidden");
  document.getElementById("detail-modal").classList.remove("hidden");
}

function closeDetail() {
  document.getElementById("detail-overlay").classList.add("hidden");
  document.getElementById("detail-modal").classList.add("hidden");
}

// ════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════
async function loadUsers() {
  const tbody = document.getElementById("users-tbody");
  try {
    const res  = await fetch(`${API}/admin/get_users.php`, { credentials: "include" });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No users found.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.data.map((u, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escHtml(u.username)}</strong></td>
        <td>${escHtml(u.email)}</td>
        <td><span class="badge ${u.role}">${capitalize(u.role)}</span></td>
        <td>${u.phone || "—"}</td>
        <td>${formatDate(u.created_at)}</td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">Failed to load users.</td></tr>`;
  }
}

// ════════════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════════════
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── Helpers ──────────────────────────────────────────────────
function escHtml(str) {
  return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

