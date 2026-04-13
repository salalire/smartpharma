const API_URL = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

document.addEventListener("DOMContentLoaded", async () => {
  const localUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!localUser) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/users/get_profile.php`, {
      credentials: "include"
    });

    const data = await res.json();

    if (data && data.id) {
      updateProfileUI(data);
    } else {
      updateProfileUI(localUser);
    }

  } catch (err) {
    updateProfileUI(localUser);
  }

  // Always load pharmacy application status
  loadOwnerStatus();
});


// ===============================
// UPDATE UI
// ===============================
function updateProfileUI(user) {
  document.getElementById("title").textContent =
    user.role === "owner" ? "Pharmacy Profile" : "User Profile";

  document.getElementById("name").textContent = user.username || "N/A";
  document.getElementById("email").textContent = user.email || "N/A";
  document.getElementById("phone").textContent = user.phone || "N/A";

  const extra = document.getElementById("extra");
  if (user.role === "owner") {
    extra.innerHTML = "<h3>Your Products</h3><p>No products yet.</p>";
  } else {
    extra.innerHTML = "<h3>Purchased Medicines</h3><p>No medicines yet.</p>";
  }
}


// ===============================
// OWNER APPLICATION STATUS
// ===============================
async function loadOwnerStatus() {
  const statusDiv = document.getElementById("owner-status");
  if (!statusDiv) return;

  try {
    const res = await fetch(`${API_URL}/owner/status.php`, {
      credentials: "include"
    });

    const data = await res.json();

    if (data.status === "none") {
      statusDiv.innerHTML = `
        <p>Want to sell on SmartPharma? <a href="pharmacyregistration.html">Apply as a Pharmacy Owner</a></p>
      `;
    } else if (data.status === "pending") {
      statusDiv.innerHTML = `
        <p style="color: orange;">⏳ Your pharmacy application is under review.</p>
      `;
    } else if (data.status === "approved") {
      statusDiv.innerHTML = `
        <p style="color: green;">✔ Your pharmacy is approved.</p>
        <button onclick="goToDashboard()">Go to Dashboard</button>
      `;
    } else if (data.status === "rejected") {
      statusDiv.innerHTML = `
        <p style="color: red;">✖ Your application was rejected.</p>
        <a href="pharmacyregistration.html">Apply again</a>
      `;
    }

  } catch (err) {
    statusDiv.innerHTML = `<p style="color:red;">Could not load application status.</p>`;
  }
}


// ===============================
// DASHBOARD
// ===============================
function goToDashboard() {
  window.location.href = "pharmacy_dashboard.html";
}


// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("currentUser");

  fetch(`${API_URL}/authentication/logout.php`, {
    credentials: "include"
  });

  window.location.href = "login.html";
}

