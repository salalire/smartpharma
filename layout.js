document.addEventListener("DOMContentLoaded", () => {

  fetch("../html/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      const toggle = document.getElementById("menu-toggle");
      const links = document.getElementById("nav-links");

      toggle.addEventListener("click", () => {
        links.classList.toggle("active");
      });
    });

  fetch("../html/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
    });

});
