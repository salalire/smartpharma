6document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isPasswordMatch = password_check();
    const isStrongPassword = char_check();

    if (isPasswordMatch && isStrongPassword) {
      storeUserData();
      alert("Registration successful!");
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

function storeUserData() {
  const userData = {
    role: "user",
    email: getInput("useremail").value,
    phone: getInput("phone").value,
    username: getInput("username").value,
    password: getInput("password").value,
    medicines: []
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(userData));

  window.location.href = "Home.html";
}
