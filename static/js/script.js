document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const THEME_KEY = 'delivery_app_theme';

    // Immediately apply the saved theme on all pages (dark by default)
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    // Handle the toggle button only if it exists on the page
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        updateButtonLabel(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem(THEME_KEY, newTheme);
            updateButtonLabel(newTheme);
        });
    }

    function updateButtonLabel(theme) {
        if (theme === 'dark') {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    }
});