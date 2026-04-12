const regionSelect = document.getElementById("region");
const addisSubcity = document.getElementById("addis-subcity");
const otherCity = document.getElementById("other-city");

regionSelect.addEventListener("change", () => {
  if (regionSelect.value === "Addis Ababa") {
    addisSubcity.classList.remove("hidden");
    otherCity.classList.add("hidden");
  } else {
    addisSubcity.classList.add("hidden");
    otherCity.classList.remove("hidden");
  }
});

function hideMessage(el) {
  setTimeout(() => {
    el.textContent = "";
  }, 3000);
}

function check_password() {
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;
  const output_message = document.getElementById("output_message");

  if (password === confirm_password) {
    output_message.textContent = "";
    return true;
  } else {
    output_message.textContent = "Passwords do not match";
    hideMessage(output_message);
    return false;
  }
}

function validateAgrement() {
  const check_agrement = document.getElementById("service-agrement");
  if (!check_agrement.checked) {
    alert("You must agree to the Terms & Agreement");
    return false;
  }
  return true;
}

function validate_password() {
  const password = document.getElementById("password").value;
  const Error_message = document.getElementById("Error_message");

  if (password.length < 8) {
    Error_message.textContent = "Password must be at least 8 characters";
    hideMessage(Error_message);
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    Error_message.textContent = "Include at least one uppercase letter";
    hideMessage(Error_message);
    return false;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    Error_message.textContent = "Include at least one special character";
    hideMessage(Error_message);
    return false;
  }

  Error_message.textContent = "";
  return true;
}

function submitcase() {
  const validPassword = validate_password();
  const matchPassword = check_password();
  const agreed = validateAgrement();

  return validPassword && matchPassword && agreed;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (submitcase()) {
      storePharmacyData();
      form.reset();
    }
  });
});


async function storePharmacyData() {
  const API_URL = "http://localhost/smartpharma-backend/smartpharma-backend-with_php/api";

  let message = document.getElementById("pharmacy_message");
  if (!message) {
    message = document.createElement("p");
    message.id = "pharmacy_message";
    message.style.marginTop = "10px";
    document.querySelector("form").appendChild(message);
  }

  try {
    const res = await fetch(`${API_URL}/authentication/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        username: document.querySelector('input[name="first_name"]').value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await res.json();

    if (data.status === "success") {
      message.style.color = "green";
      message.textContent = "Account created. Please login to continue.";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } else {
      message.style.color = "red";
      message.textContent = data.message || "Registration failed";
    }

  } catch (err) {
    message.style.color = "red";
    message.textContent = "Server error. Please try again.";
  }
}


