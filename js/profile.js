document.addEventListener("DOMContentLoaded", async () => {
  const localUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!localUser) {
    window.location.href = "login.html";
    return;
  }

  const API_URL = "http://localhost/smartpharma-backend/smartpharma-backend-with_php/api";

  try {
    const res = await fetch(`${API_URL}/users/get_profile.php?id=${localUser.id}`, {
      credentials: "include"
    });

    const data = await res.json();

    if (data && data.id) {
      updateProfileUI(data);
      loadOwnerStatus();
    } else {
      updateProfileUI(localUser);
      loadOwnerStatus();
    }

  } catch (err) {
    updateProfileUI(localUser);
    loadOwnerStatus();
  }
});


// ===============================
// UPDATE UI
// ===============================
function updateProfileUI(user) {

  document.getElementById("title").textContent =
    user.role === "owner" ? "Pharmacy Profile" : "User Profile";

  document.getElementById("name").textContent =
    user.username || "N/A";

  document.getElementById("email").textContent = user.email || "N/A";
  document.getElementById("phone").textContent = user.phone || "N/A";


  // USER SECTION
  if (user.role === "user") {
    const div = document.getElementById("extra");
    div.innerHTML = "<h3>Purchased Medicines</h3><p>No medicines yet.</p>";
  }

  // OWNER SECTION
  if (user.role === "owner") {
    const div = document.getElementById("extra");
    div.innerHTML = "<h3>Your Products</h3><p>No products yet.</p>";
  }
}


// ===============================
// OWNER STATUS
// ===============================
async function loadOwnerStatus() {

  const API_URL = "http://localhost/smartpharma-backend/smartpharma-backend-with_php/api";
  const statusDiv = document.getElementById("owner-status");

  try {
    const res = await fetch(`${API_URL}/owner/status.php`, {
      credentials: "include"
    });

    const data = await res.json();

    // NOT APPLIED
    if (data.status === "none") {
      statusDiv.innerHTML = `
        <p>You are not registered as a pharmacy.</p>
        <button onclick="applyForPharmacy()">Apply as Pharmacy</button>
      `;
    }

    // PENDING
    else if (data.status === "pending") {
      statusDiv.innerHTML = `
        <p style="color: orange;">
          Your application is under review.
        </p>
      `;
    }

    // APPROVED
    else if (data.status === "approved") {
      statusDiv.innerHTML = `
        <p style="color: green;">Approved ✔</p>
        <button onclick="goToDashboard()">Go to Dashboard</button>
      `;
    }

    // REJECTED
    else if (data.status === "rejected") {
      statusDiv.innerHTML = `
        <p style="color: red;">
          Your application was rejected.
        </p>
      `;
    }

  } catch (err) {
    statusDiv.innerHTML = `<p style="color:red;">Failed to load status</p>`;
  }
}


// ===============================
// APPLY
// ===============================
async function applyForPharmacy() {

  const API_URL = "http://localhost/smartpharma-backend/smartpharma-backend-with_php/api";

  try {
    const res = await fetch(`${API_URL}/owner/apply.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        pharmacy_name: "My Pharmacy",
        first_name: "Owner",
        last_name: "User",
        tin_number: "123456",
        region: "Addis Ababa",
        city: "Addis Ababa"
      })
    });

    const data = await res.json();

    alert(data.message);
    location.reload();

  } catch (err) {
    alert("Server error");
  }
}


// ===============================
// DASHBOARD
// ===============================
function goToDashboard() {
  window.location.href = "owner-dashboard.html";
}


// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("currentUser");

  fetch("http://localhost/smartpharma-backend/smartpharma-backend-with_php/api/authentication/logout.php", {
    credentials: "include"
  });

  window.location.href = "login.html";
}