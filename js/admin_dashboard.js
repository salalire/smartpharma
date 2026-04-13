const API_URL = "http://localhost/sp/smartpharma-backend/smartpharma-backend-with_php/api";
const user = getUser();

if (!user || user.role !== "admin") {
  window.location.href = "login.html";
}

async function loadApplications() {
  const res = await fetch(`${API_URL}/admin/get_application.php`, { credentials: "include" });
  const data = await res.json();

  const table = document.getElementById("applications");
  table.innerHTML = "";

  data.data.forEach(app => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.pharmacy_name}</td>
      <td>${app.email}</td>
      <td>${app.status}</td>
      <td>
        <button onclick="approve(${app.id})">Approve</button>
        <button onclick="reject(${app.id})">Reject</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function approve(id) {
  await fetch(`${API_URL}/admin/approve_owner.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ application_id: id })
  });
  loadApplications();
}

async function reject(id) {
  await fetch(`${API_URL}/admin/reject_owner.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ application_id: id })
  });
  loadApplications();
}

loadApplications();
