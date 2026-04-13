const PANEL_API = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

document.addEventListener("DOMContentLoaded", () => {

  fetch("../Structure_markup/Structure_markup/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks   = document.querySelector('.nav-links');
      if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
      }

      let user = null;
      try {
        const stored = localStorage.getItem("currentUser");
        user = stored ? JSON.parse(stored) : null;
      } catch (e) { user = null; }

      if (user) {
        const signInBtn      = navLinks.querySelector('a.btn');
        const signUpDropdown = navLinks.querySelector('.signup-dropdown');
        if (signInBtn)      signInBtn.style.display      = "none";
        if (signUpDropdown) signUpDropdown.style.display = "none";

        const profileBtn = document.createElement("button");
        profileBtn.className = "profile-nav-btn";
        const initial = (user.username || "U").charAt(0).toUpperCase();
        profileBtn.textContent = initial;
        profileBtn.title = user.username || "Profile";
        profileBtn.addEventListener("click", openProfilePanel);

        navLinks.insertBefore(profileBtn, navLinks.querySelector(".cart-icon"));
        buildProfilePanel(user);
      }
    });

  fetch("../Structure_markup/Structure_markup/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
    });
});


// ── Build Panel ─────────────────────────────────────────────
function buildProfilePanel(user) {
  const overlay = document.createElement("div");
  overlay.id = "profile-overlay";
  overlay.addEventListener("click", closeProfilePanel);

  const panel = document.createElement("div");
  panel.id = "profile-panel";

  panel.innerHTML = `
    <button class="panel-close-btn" onclick="closeProfilePanel()">&#10005;</button>

    <div class="panel-avatar"><i class="fas fa-user-circle"></i></div>
    <h3 class="panel-name" id="panel-username">${user.username || "User"}</h3>
    <p class="panel-email" id="panel-email">${user.email || ""}</p>
    <span class="panel-role-badge ${user.role}" id="panel-role">${getRoleLabel(user.role)}</span>

    <hr class="panel-divider">

    <!-- Full info section -->
    <div class="panel-info-section" id="panel-info-section">
      <div class="panel-info-collapsed" id="panel-info-collapsed">
        <div class="panel-info-row"><span class="info-label">Phone</span><span class="info-value" id="pi-phone">—</span></div>
        <div class="panel-info-row"><span class="info-label">Role</span><span class="info-value" id="pi-role">—</span></div>
      </div>
      <div class="panel-info-expanded hidden" id="panel-info-expanded">
        <div class="panel-info-row"><span class="info-label">First Name</span><span class="info-value" id="pi-first">—</span></div>
        <div class="panel-info-row"><span class="info-label">Last Name</span><span class="info-value" id="pi-last">—</span></div>
        <div class="panel-info-row"><span class="info-label">Phone</span><span class="info-value" id="pi-phone2">—</span></div>
        <div class="panel-info-row"><span class="info-label">Email</span><span class="info-value" id="pi-email">—</span></div>
        <div class="panel-info-row"><span class="info-label">Role</span><span class="info-value" id="pi-role2">—</span></div>
        <div class="panel-info-row" id="pi-pharmacy-row" style="display:none">
          <span class="info-label">Pharmacy</span><span class="info-value" id="pi-pharmacy">—</span>
        </div>
        <div class="panel-info-row" id="pi-region-row" style="display:none">
          <span class="info-label">Region</span><span class="info-value" id="pi-region">—</span>
        </div>
      </div>
      <button class="panel-more-btn" id="panel-more-btn" onclick="togglePanelInfo()">More ▾</button>
    </div>

    <!-- Edit form (hidden by default) -->
    <div class="panel-edit-form hidden" id="panel-edit-form">
      <input class="panel-input" id="edit-username" placeholder="Username" />
      <input class="panel-input" id="edit-phone" placeholder="Phone" />
      <div class="panel-edit-actions">
        <button class="panel-save-btn" onclick="saveProfileEdit()">Save</button>
        <button class="panel-cancel-edit-btn" onclick="toggleEditForm()">Cancel</button>
      </div>
      <p class="panel-edit-msg" id="panel-edit-msg"></p>
    </div>

    <button class="panel-edit-toggle-btn" id="panel-edit-toggle-btn" onclick="toggleEditForm()">
      <i class="fas fa-pen"></i> Edit Profile
    </button>

    <hr class="panel-divider">

    <div id="panel-status-box">
      <p class="panel-loading-text">Loading...</p>
    </div>

    <hr class="panel-divider">

    <button class="panel-logout-btn" onclick="panelLogout()">
      <i class="fas fa-sign-out-alt"></i> Logout
    </button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  loadPanelProfile(user);
  loadPanelStatus(user);
}

function getRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "owner") return "Pharmacy Owner";
  return "User";
}


// ── Load full profile info ──────────────────────────────────
async function loadPanelProfile(user) {
  try {
    const res  = await fetch(`${PANEL_API}/users/get_profile.php`, { credentials: "include" });
    const data = await res.json();
    const u    = (data && data.id) ? data : user;

    setText("pi-phone",  u.phone    || "—");
    setText("pi-role",   getRoleLabel(u.role));
    setText("pi-first",  u.first_name || u.username || "—");
    setText("pi-last",   u.last_name  || "—");
    setText("pi-phone2", u.phone      || "—");
    setText("pi-email",  u.email      || "—");
    setText("pi-role2",  getRoleLabel(u.role));

    // Pre-fill edit form
    const editUser = document.getElementById("edit-username");
    const editPhone = document.getElementById("edit-phone");
    if (editUser)  editUser.value  = u.username || "";
    if (editPhone) editPhone.value = u.phone    || "";

  } catch (e) {
    setText("pi-phone", "—");
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


// ── Load pharmacy status ────────────────────────────────────
async function loadPanelStatus(user) {
  const box = document.getElementById("panel-status-box");
  if (!box) return;

  if (user.role === "admin") {
    box.innerHTML = `<a href="../Structure_markup/admin_dashboard.html" class="panel-dashboard-btn">
      <i class="fas fa-tachometer-alt"></i> Admin Dashboard
    </a>`;
    return;
  }

  try {
    const res  = await fetch(`${PANEL_API}/owner/status.php`, { credentials: "include" });
    const data = await res.json();

    if (data.status === "none") {
      // Regular user — no application
      box.innerHTML = `<p class="panel-status-text">No pharmacy application.</p>`;
    } else if (data.status === "pending") {
      box.innerHTML = `
        <p class="panel-status-text pending">⏳ Your account is waiting for approval.</p>
        <p class="panel-status-sub">We'll notify you once the admin reviews your application.</p>
      `;
    } else if (data.status === "approved") {
      box.innerHTML = `
        <p class="panel-status-text approved">✔ Pharmacy Approved</p>
        <a href="../Structure_markup/pharmacy_dashboard.html" class="panel-dashboard-btn">
          <i class="fas fa-tachometer-alt"></i> Go to Dashboard
        </a>
      `;
    } else if (data.status === "rejected") {
      box.innerHTML = `
        <p class="panel-status-text rejected">✖ Application Rejected</p>
        <p class="panel-status-sub">Please contact support or re-apply.</p>
      `;
    }
  } catch (e) {
    box.innerHTML = `<p class="panel-status-text" style="color:#aaa;">Could not load status.</p>`;
  }
}


// ── Toggle More / Less info ─────────────────────────────────
function togglePanelInfo() {
  const collapsed = document.getElementById("panel-info-collapsed");
  const expanded  = document.getElementById("panel-info-expanded");
  const btn       = document.getElementById("panel-more-btn");

  const isExpanded = !expanded.classList.contains("hidden");
  if (isExpanded) {
    expanded.classList.add("hidden");
    collapsed.classList.remove("hidden");
    btn.textContent = "More ▾";
  } else {
    collapsed.classList.add("hidden");
    expanded.classList.remove("hidden");
    btn.textContent = "Less ▴";
  }
}


// ── Toggle Edit Form ────────────────────────────────────────
function toggleEditForm() {
  const form    = document.getElementById("panel-edit-form");
  const editBtn = document.getElementById("panel-edit-toggle-btn");
  const infoSec = document.getElementById("panel-info-section");

  const isOpen = !form.classList.contains("hidden");
  if (isOpen) {
    form.classList.add("hidden");
    infoSec.classList.remove("hidden");
    editBtn.innerHTML = `<i class="fas fa-pen"></i> Edit Profile`;
  } else {
    form.classList.remove("hidden");
    infoSec.classList.add("hidden");
    editBtn.innerHTML = `<i class="fas fa-times"></i> Cancel Edit`;
  }
}


// ── Save Edit ───────────────────────────────────────────────
async function saveProfileEdit() {
  const username = document.getElementById("edit-username")?.value.trim();
  const phone    = document.getElementById("edit-phone")?.value.trim();
  const msg      = document.getElementById("panel-edit-msg");

  if (!username) {
    msg.style.color = "red";
    msg.textContent = "Username cannot be empty.";
    return;
  }

  try {
    const res  = await fetch(`${PANEL_API}/users/update_profile.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, phone })
    });
    const data = await res.json();

    if (data.status === "success") {
      msg.style.color = "green";
      msg.textContent = "Saved!";

      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("currentUser") || "{}");
      stored.username = username;
      stored.phone    = phone;
      localStorage.setItem("currentUser", JSON.stringify(stored));

      // Update panel display
      setText("panel-username", username);
      setText("pi-first",  username);
      setText("pi-phone",  phone || "—");
      setText("pi-phone2", phone || "—");

      setTimeout(() => {
        msg.textContent = "";
        toggleEditForm();
      }, 1500);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Update failed.";
    }
  } catch (e) {
    msg.style.color = "red";
    msg.textContent = "Server error.";
  }
}


// ── Open / Close ────────────────────────────────────────────
function openProfilePanel() {
  document.getElementById("profile-panel")?.classList.add("open");
  document.getElementById("profile-overlay")?.classList.add("open");
}

function closeProfilePanel() {
  document.getElementById("profile-panel")?.classList.remove("open");
  document.getElementById("profile-overlay")?.classList.remove("open");
}


// ── Logout ──────────────────────────────────────────────────
function panelLogout() {
  localStorage.removeItem("currentUser");
  fetch(`${PANEL_API}/authentication/logout.php`, { credentials: "include" });
  window.location.href = "../Structure_markup/login.html";
}

