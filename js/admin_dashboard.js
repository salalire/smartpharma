const user = getUser();

if (!user || user.role !== "admin") {
  window.location.href = "login.html";
}

// Load applications
async function loadApplications() {
  const res = await fetch(
    "http://localhost/smartpharma-backend/api/admin/get_applications.php",
    { credentials: "include" }
  );

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
  await fetch(
    "http://localhost/smartpharma-backend/api/admin/approve_owner.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ application_id: id })
    }
  );

  loadApplications();
}

async function reject(id) {
  await fetch(
    "http://localhost/smartpharma-backend/api/admin/reject_owner.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ application_id: id })
    }
  );

  loadApplications();
}

loadApplications();