document
  .querySelector(".hero .glass-btn:nth-child(1)")
  .addEventListener("click", () => {
    window.location.href = "medication.html";
  });
document
  .querySelector(".hero .glass-btn:nth-child(2)")
  .addEventListener("click", () => {
    window.location.href = "Blog.html";
  });

document.querySelector(".blog-btn").addEventListener("click", () => {
  window.location.href = "Blog.html";
});

document.querySelectorAll(".category-card .shop-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "medication.html";
  });
});

// SEARCH REDIRECTION LOGIC
const homeSearchInput = document.getElementById("home-search-input");
const homeSearchBtn = document.getElementById("home-search-btn");

function performSearch() {
  const query = homeSearchInput.value.trim();
  if (query) {
    window.location.href = `medication.html?search=${encodeURIComponent(query)}`;
  } else {
    window.location.href = "medication.html";
  }
}

if (homeSearchBtn) {
  homeSearchBtn.addEventListener("click", performSearch);
}

if (homeSearchInput) {
  homeSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}
