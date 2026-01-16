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
      alert("Pharmacy registration successful!");
      form.reset();
    }
  });
});


function storePharmacyData() {
  const pharmacyData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  let pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
  pharmacies.push(pharmacyData);
  localStorage.setItem("pharmacies", JSON.stringify(pharmacies));
}


