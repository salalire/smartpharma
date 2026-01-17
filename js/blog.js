// Wrap everything to run after the DOM is loaded6
document.addEventListener("DOMContentLoaded", function() {

    // -----------------------------
    // Toggle "Read More" content
    // -----------------------------
    function toggleDetail(el, id) {
        const detail = document.getElementById(id);
        if (!detail) return; // Safety check

        const isOpen = detail.style.display === 'block';
        detail.style.display = isOpen ? 'none' : 'block';
        el.innerText = isOpen ? 'Read More' : 'Show Less';
    }

    // Make toggleDetail accessible globally for inline onclick
    window.toggleDetail = toggleDetail;


    // Category filter functionality

    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons, add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;

            // Show/hide blog cards based on category
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

});