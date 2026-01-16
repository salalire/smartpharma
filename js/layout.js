document.addEventListener("DOMContentLoaded", () => {

  fetch("../Structure_markup/Structure_markup/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;
    });

  fetch("../Structure_markup/Structure_markup/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
    });

});
