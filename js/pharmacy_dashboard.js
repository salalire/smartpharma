const user = getUser();

if (!user || user.role !== "owner") {
  window.location.href = "login.html";
}

document.getElementById("welcome").textContent =
  "Welcome Owner: " + user.username;