const user = getUser();

if (!user || user.role !== "user") {
  window.location.href = "login.html";
}

document.getElementById("welcome").textContent =
  "Welcome " + user.username;


