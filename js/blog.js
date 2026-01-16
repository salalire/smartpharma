<!-- JS -->
<script>
  // Toggle read more content
  function toggleDetail(el, id) {
      const detail = document.getElementById(id);
      detail.style.display = detail.style.display === 'block' ? 'none' : 'block';
      el.innerText = detail.style.display === 'block' ? 'Show Less' : 'Read More';
  }

  // Category filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const category = btn.dataset.filter;
          blogCards.forEach(card => {
              if (category === 'all' || card.dataset.category === category) {
                  card.style.display = 'block';
              } else {
                  card.style.display = 'none';
              }
          });
      });
  });
</script>
