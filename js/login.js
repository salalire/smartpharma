document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let message = document.getElementById("login_message");
    if (!message) {
      message = document.createElement("p");
      message.id = "login_message";
      message.style.color = "red";
      message.style.marginTop = "10px";
      form.appendChild(message);
    }
  const API_URL = "http://localhost/smartpharma-backend-with_php/api";
    
    fetch(`${API_URL}/authentication/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Save logged-in user
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        message.style.color = "green";
        message.textContent = "Login successful";

        setTimeout(() => {
          // Optional: role-based redirect
          if (data.user.role === "owner") {
            window.location.href = "owner-dashboard.html";
          } else {
            window.location.href = "Home.html";
          }
        }, 1000);

      } else {
        message.style.color = "red";
        message.textContent = data.message || "Invalid credentials";
      }
    })
    .catch(err => {
      console.error(err);
      message.textContent = "Server error";
    });
  });
});
