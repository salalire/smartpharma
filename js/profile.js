const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("title").textContent =
  user.role === "pharmacy" ? "Pharmacy Profile" : "User Profile";

document.getElementById("name").textContent =
  user.username || user.pharmacyName || "";
document.getElementById("email").textContent = user.email;
document.getElementById("phone").textContent = user.phone || "";

if (user.role === "user") {
  const div = document.getElementById("extra");
  div.innerHTML = "<h3>Purchased Medicines</h3>";
  if (!user.medicines || user.medicines.length === 0) {
    div.innerHTML += "<p>No medicines purchased yet.</p>";
  } else {
    const ul = document.createElement("ul");
    user.medicines.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      ul.appendChild(li);
    });
    div.appendChild(ul);
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
