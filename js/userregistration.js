document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isPasswordMatch = password_check();
    const isStrongPassword = char_check();

    if (isPasswordMatch && isStrongPassword) {
      storeUserData();
      form.reset();
      clearMessages();
    }
  });
});

function getInput(name) {
  return document.querySelector(`input[name="${name}"]`);
}

function getMessageElement(id, afterElement, color) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("p");
    el.id = id;
    el.style.color = color;
    el.style.fontSize = "14px";
    el.style.marginTop = "5px";
    afterElement.parentNode.appendChild(el);
  }
  return el;
}

function showTempMessage(el, message) {
  el.textContent = message;
  setTimeout(() => {
    el.textContent = "";
  }, 3000);
}

function clearMessages() {
  const error = document.getElementById("Error_message");
  const warning = document.getElementById("Warning_message");
  if (error) error.textContent = "";
  if (warning) warning.textContent = "";
}

function password_check() {
  const password = getInput("password").value;
  const confirmPassword = getInput("user_password").value;

  const errorMessage = getMessageElement(
    "Error_message",
    getInput("user_password"),
    "red"
  );

  if (password === confirmPassword) {
    errorMessage.textContent = "";
    return true;
  } else {
    showTempMessage(errorMessage, "Your passwords do not match.");
    return false;
  }
}

function char_check() {
  const password = getInput("password").value;

  const warningMessage = getMessageElement(
    "Warning_message",
    getInput("password"),
    "orange"
  );

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+?.,><~`]/.test(password);

  if (hasUpper && hasLower && hasNumber && hasSpecial) {
    warningMessage.textContent = "";
    return true;
  } else {
    showTempMessage(
      warningMessage,
      "Password must contain uppercase, lowercase, number, and special character."
    );
    return false;
  }
}

async function storeUserData() {
  const userData = {
    username: getInput("username").value,
    email: getInput("useremail").value,
    phone: getInput("phone").value,
    password: getInput("password").value
  };

  const API_URL = "http://localhost/smartpharma-backend/smartpharma-backend-with_php/api";

  try {
    const res = await fetch(`${API_URL}/authentication/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // 🔥 important
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("Registration successful!");
      window.location.href = "login.html"; // better UX
    } else {
      alert(data.message || "Registration failed");
    }

  } catch (err) {
    console.error("Registration error:", err);
    alert("Server error");
  }
}
