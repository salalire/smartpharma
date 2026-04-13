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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const validPassword = validate_password();
    const matchPassword = check_password();
    const agreed = validateAgrement();

    if (!validPassword || !matchPassword || !agreed) return;

    const region = document.getElementById("region")?.value || "";

    // Capture all field values BEFORE any reset
    const formData = {
      pharmacy_name: document.querySelector('[name="pharmacy_name"]')?.value || "",
      first_name: document.querySelector('[name="first_name"]')?.value || "",
      middle_name: document.querySelector('[name="Middle_name"]')?.value || "",
      last_name: document.querySelector('[name="Last_name"]')?.value || "",
      tin_number: document.querySelector('[name="Tin_number"]')?.value || "",
      email: document.getElementById("email")?.value || "",
      password: document.getElementById("password")?.value || "",
      region: region,
      city: region === "Addis Ababa"
        ? "Addis Ababa"
        : (document.querySelector('[name="other_city"]')?.value || ""),
      sub_city: document.querySelector('[name="sub_city"]')?.value || null,
      woreda: document.querySelector('[name="woreda"]')?.value || null
    };

    await storePharmacyData(formData);
  });
});


async function storePharmacyData(formData) {
  const API_URL = "http://127.0.0.1/sp/smartpharma-backend/smartpharma-backend-with_php/api";

  let message = document.getElementById("pharmacy_message");
  if (!message) {
    message = document.createElement("p");
    message.id = "pharmacy_message";
    message.style.marginTop = "10px";
    message.style.fontSize = "14px";
    document.querySelector("form").appendChild(message);
  }
  message.textContent = "";

  try {
    // STEP 1: Register account (only saves to users table)
    const registerRes = await fetch(`${API_URL}/authentication/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: formData.first_name,
        email: formData.email,
        password: formData.password
      })
    });

    const registerData = await registerRes.json();

    if (registerData.status !== "success") {
      message.style.color = "red";
      message.textContent = registerData.message || "Registration failed";
      return;
    }

    // STEP 2: Auto-login to establish session
    const loginRes = await fetch(`${API_URL}/authentication/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const loginData = await loginRes.json();

    if (loginData.status !== "success") {
      message.style.color = "red";
      message.textContent = loginData.message || "Auto-login failed";
      return;
    }

    // Save user to localStorage so profile page works
    localStorage.setItem("currentUser", JSON.stringify(loginData.user));

    // STEP 3: Submit pharmacy application (saves to pharmacy_profiles table)
    const applyRes = await fetch(`${API_URL}/owner/apply.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        pharmacy_name: formData.pharmacy_name,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        tin_number: formData.tin_number,
        region: formData.region,
        city: formData.city,
        sub_city: formData.sub_city,
        woreda: formData.woreda
      })
    });

    const applyData = await applyRes.json();

    if (applyData.status === "success") {
      message.style.color = "green";
      message.textContent = "Application submitted! Waiting for admin approval.";

      document.querySelector("form").reset();

      setTimeout(() => {
        window.location.href = "Home.html";
      }, 2000);

    } else {
      message.style.color = "orange";
      message.textContent = "Account created, but application failed: " + applyData.message;
    }

  } catch (err) {
    console.error("Registration error:", err);
    message.style.color = "red";
    message.textContent = "Error: " + err.message;
  }
}

