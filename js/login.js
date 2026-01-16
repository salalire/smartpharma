document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];

    const userMatch = users.find(
      u => u.email === email && u.password === password
    );

    const pharmacyMatch = pharmacies.find(
      p => p.email === email && p.password === password
    );

    let message = document.getElementById("login_message");
    if (!message) {
      message = document.createElement("p");
      message.id = "login_message";
      message.style.color = "red";
      message.style.marginTop = "10px";
      form.appendChild(message);
    }

    if (userMatch || pharmacyMatch) {
      message.style.color = "green";
      message.textContent = "Login successful";

      setTimeout(() => {
        window.location.href = "Home.html";
      }, 1000);
    } else {
      message.style.color = "red";
      message.textContent = "User does not exist or incorrect password";

      setTimeout(() => {
        message.textContent = "";
      }, 3000);
    }
  });
});
