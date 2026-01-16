document.addEventListener("DOMContentLoaded", () => {

  fetch("../Structure_markup/Structure_markup/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }

      const user = JSON.parse(localStorage.getItem("currentUser"));
      const signInBtn = navLinks.querySelector('a.btn');
      const signUpDropdown = navLinks.querySelector('.signup-dropdown');

      if (user) {
        if (signInBtn) signInBtn.style.display = "none";
        if (signUpDropdown) signUpDropdown.style.display = "none";

        const profileWrapper = document.createElement("div");
        profileWrapper.className = "signup-dropdown";

        const profileBtn = document.createElement("button");
        profileBtn.className = "btn signup-btn";
        profileBtn.textContent = user.username || "Profile";

        const dropdown = document.createElement("div");
        dropdown.className = "dropdown-menu";

        const emailItem = document.createElement("a");
        emailItem.textContent = user.email;
        emailItem.style.pointerEvents = "none";

        const roleItem = document.createElement("a");
        roleItem.textContent =
          user.role === "pharmacy" ? "Pharmacy Account" : "User Account";
        roleItem.style.pointerEvents = "none";

        const logoutItem = document.createElement("a");
        logoutItem.textContent = "Logout";

        logoutItem.addEventListener("click", () => {
          localStorage.removeItem("currentUser");
          window.location.href = "../Structure_markup/login.html";
        });

        dropdown.append(emailItem, roleItem, logoutItem);
        profileWrapper.append(profileBtn, dropdown);

        navLinks.insertBefore(profileWrapper, navLinks.querySelector(".cart-icon"));
      }

    });

  fetch("../Structure_markup/Structure_markup/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
    });

});
