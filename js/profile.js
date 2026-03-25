document.addEventListener("DOMContentLoaded", () => {
  const localUser = JSON.parse(localStorage.getItem("currentUser"));

  // 🔒 If not logged in → redirect
  if (!localUser) {
    window.location.href = "login.html";
    return;
  }

  const API_URL = "http://localhost/smartpharma-backend-with_php/api";

  // Try to get fresh data from backend
  fetch(`${API_URL}/users/get_profile.php?id=${localUser.id}`)
    .then(res => res.json())
    .then(data => {
      if (data && !data.error) {
        updateProfileUI(data);
      } else {
        // fallback to local data
        updateProfileUI(localUser);
      }
    })
    .catch(() => {
      // backend not ready → fallback
      updateProfileUI(localUser);
    });
});


// ===============================
// UPDATE UI FUNCTION (MAIN LOGIC)
// ===============================
function updateProfileUI(user) {
  // Title
  document.getElementById("title").textContent =
    user.role === "owner" ? "Pharmacy Profile" : "User Profile";

  // Basic info
  document.getElementById("name").textContent =
    user.username || user.pharmacyName || "N/A";

  document.getElementById("email").textContent = user.email || "N/A";
  document.getElementById("phone").textContent = user.phone || "N/A";

  // ===============================
  // USER SECTION (Purchased Medicines)
  // ===============================
  if (user.role === "user") {
    const div = document.getElementById("extra");
    div.innerHTML = "<h3>Purchased Medicines</h3>";

    if (!user.medicines || user.medicines.length === 0) {
      div.innerHTML += "<p>No medicines purchased yet.</p>";
    } else {
      const ul = document.createElement("ul");

      user.medicines.forEach((m) => {
        const li = document.createElement("li");

        // handle both string and object (future-proof)
        if (typeof m === "string") {
          li.textContent = m;
        } else {
          li.textContent = `${m.name} (x${m.quantity || 1})`;
        }

        ul.appendChild(li);
      });

      div.appendChild(ul);
    }
  }

  // ===============================
  // PHARMACY OWNER SECTION
  // ===============================
  if (user.role === "owner") {
    const div = document.getElementById("extra");
    div.innerHTML = "<h3>Your Products</h3>";

    if (!user.products || user.products.length === 0) {
      div.innerHTML += "<p>No products added yet.</p>";
    } else {
      const ul = document.createElement("ul");

      user.products.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - ${p.price}`;
        ul.appendChild(li);
      });

      div.appendChild(ul);
    }
  }
}


// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
