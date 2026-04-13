document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
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

    const API_URL = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

    try {
      const res = await fetch(`${API_URL}/authentication/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.status === "success") {
        // Save user temporarily 
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        message.style.color = "green";
        message.textContent = "Login successful";

        setTimeout(() => {
          if (!data.user) {
  console.error("User not returned from backend:", data);
  message.textContent = "Login failed (no user data)";
  return;
}
          if (data.user.role === "admin") {
            window.location.href = "../Structure_markup/admin_dashboard.html";
          } else if (data.user.role === "owner") {
            window.location.href = "../Structure_markup/pharmacy_dashboard.html";
          } else {
            window.location.href = "../Structure_markup/Home.html";
          }
        }, 1000);

      } else {
        message.style.color = "red";
        message.textContent = data.message || "Invalid credentials";
      }

    } catch (err) {
      console.error(err);
      message.textContent = "Server error";
    }
  });
});
