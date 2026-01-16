

document.querySelector('.hero .glass-btn:nth-child(1)').addEventListener('click', () => {
    window.location.href = 'medicineshop/medication.html';
});
document.querySelector('.hero .glass-btn:nth-child(2)').addEventListener('click', () => {
    window.location.href = 'blog.html';
});


document.querySelector('.blog-btn').addEventListener('click', () => {
    window.location.href = 'blog.html';
});


document.querySelectorAll('.category-card .shop-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = 'medicineshop/medication.html';
    });
});
