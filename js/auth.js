function getUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  fetch("http://localhost/sp/smartpharma-backend/smartpharma-backend-with_php/api/authentication/logout.php", {
    credentials: "include"
  }).then(() => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}