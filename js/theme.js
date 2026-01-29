// Theme toggle logic for vanilla JS modular structure
window.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        html.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('light-theme');
        const isLight = html.classList.contains('light-theme');
        themeIcon.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});
