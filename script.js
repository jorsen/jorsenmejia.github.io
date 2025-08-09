document.addEventListener('DOMContentLoaded', function() {
    const THEME_KEY = 'jm_theme';

    // Elements
    const burgerBtn = document.getElementById('burgerBtn') || document.getElementById('burger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobilePanel = document.getElementById('mobilePanel');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = Array.from(document.querySelectorAll('.mobile-link'));

    /**
     * THEME HANDLING
     */
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');

        const isDark = theme === 'dark';
        document.querySelectorAll('.theme-toggle-icon').forEach(el => el.textContent = isDark ? '☀️' : '🌙');
        document.querySelectorAll('.theme-toggle-text').forEach(el => el.textContent = isDark ? 'Light' : 'Dark');

        localStorage.setItem(THEME_KEY, theme);
    }

    // Initialize theme
    (function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) {
            applyTheme(saved);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    })();

    // Toggle theme when clicking desktop or mobile buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.theme-toggle, #mobileThemeBtn, #mobileThemeToggle')) {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        }
    });

    /**
     * MOBILE DRAWER
     */
    function openMobileDrawer() {
        if (!mobileDrawer || !mobilePanel) return;
        mobileDrawer.classList.remove('hidden');
        document.documentElement.classList.add('no-scroll');
        requestAnimationFrame(() => mobilePanel.classList.remove('-translate-x-full'));
        if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileDrawer() {
        if (!mobileDrawer || !mobilePanel) return;
        mobilePanel.classList.add('-translate-x-full');
        setTimeout(() => {
            mobileDrawer.classList.add('hidden');
            document.documentElement.classList.remove('no-scroll');
        }, 220);
        if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('hidden')) openMobileDrawer();
            else closeMobileDrawer();
        });
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMobileDrawer);
    if (mobileOverlay) mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMobileDrawer();
    });

    // Close drawer when clicking a link
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileDrawer));

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileDrawer.classList.contains('hidden')) {
            closeMobileDrawer();
        }
    });

    /**
     * REVEAL ANIMATION
     */
    const revealEls = document.querySelectorAll('.reveal, .card, article, section');
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
});