"use strict";
// Main TypeScript file for the personal website
/**
 * Class to handle the website's core functionality
 */
class WebsiteController {
    constructor() {
        // Initialize DOM elements
        this.header = document.getElementById('main-header');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.closeSidebarButton = document.getElementById('close-sidebar');
        this.mobileSidebar = document.getElementById('mobile-sidebar');
        this.themeToggleButton = document.getElementById('theme-toggle');
        this.mobileThemeToggleButton = document.getElementById('mobile-theme-toggle');
        this.skillBars = document.querySelectorAll('.skill-bar');
        // Initialize themes
        this.themes = ['default', 'dark', 'ocean', 'forest', 'sunset', 'royal'];
        this.currentTheme = 'default';
        // Setup event listeners
        this.setupEventListeners();
        // Initialize skill bars
        this.initializeSkillBars();
    }
    /**
     * Set up all event listeners for the website
     */
    setupEventListeners() {
        // Header scroll event
        window.addEventListener('scroll', this.handleScroll.bind(this));
        // Theme toggles (desktop + mobile)
        this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
        this.mobileThemeToggleButton.addEventListener('click', () => this.toggleTheme());
        // Mobile menu open/close
        this.mobileMenuButton.addEventListener('click', () => this.openMobileMenu());
        this.closeSidebarButton.addEventListener('click', () => this.closeMobileMenu());
        // Close mobile menu when clicking a link
        const mobileLinks = this.mobileSidebar.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', this.closeMobileMenu.bind(this));
        });
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                var _a;
                e.preventDefault();
                const targetId = e.currentTarget.getAttribute('href');
                if (targetId !== '#') {
                    (_a = document.querySelector(targetId)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    /**
     * Handles scroll events to modify the header appearance
     */
    handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
            this.header.classList.add('header-scrolled');
        }
        else {
            this.header.classList.remove('header-scrolled');
        }
    }
    /**
     * Opens the mobile sidebar menu
     */
    openMobileMenu() {
        this.mobileSidebar.classList.add('slide-in');
        this.mobileSidebar.style.transform = 'translateX(0)';
    }
    /**
     * Closes the mobile sidebar menu
     */
    closeMobileMenu() {
        this.mobileSidebar.classList.remove('slide-in');
        this.mobileSidebar.style.transform = 'translateX(100%)';
    }
    /**
     * Toggles between available themes randomly
     */
    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];
        // Re‑implement: set data-theme on <body>
        document.body.setAttribute('data-theme', nextTheme);
        this.currentTheme = nextTheme;
        // Show a bottom‑right toast instead of alert()
        this.showNotification(`Theme changed to ${nextTheme}`);
    }
    /**
     * Shows a notification when the theme changes
     */
    showThemeNotification(theme) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-20 opacity-0 transition-all duration-300';
        notification.style.backgroundColor = 'var(--accent-color)';
        notification.style.color = 'var(--btn-text-color)';
        // Set notification text
        notification.textContent = `Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
        // Add to DOM
        document.body.appendChild(notification);
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(20px)';
            notification.style.opacity = '0';
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    showNotification(message) {
        // Ensure a toast container exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        // Create & append the toast
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        container.appendChild(toast);
        // Remove after animation (3s)
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    /**
     * Initializes skill bars with their respective levels
     */
    initializeSkillBars() {
        // Set the width of each skill bar based on the data-level attribute
        this.skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            if (level) {
                bar.style.setProperty('--skill-level', `${level}%`);
                // Create a width style to animate the skill level
                const skillLevelEl = document.createElement('span');
                skillLevelEl.style.position = 'absolute';
                skillLevelEl.style.top = '0';
                skillLevelEl.style.left = '0';
                skillLevelEl.style.height = '100%';
                skillLevelEl.style.width = `${level}%`;
                skillLevelEl.style.backgroundColor = 'var(--accent-color)';
                skillLevelEl.style.borderRadius = '15px';
                skillLevelEl.style.zIndex = '0';
                skillLevelEl.style.transition = 'transform 1.5s ease-out';
                skillLevelEl.style.transformOrigin = 'left';
                skillLevelEl.style.transform = 'scaleX(0)';
                bar.appendChild(skillLevelEl);
                // Create the label with percentage
                const labelEl = document.createElement('span');
                labelEl.style.position = 'absolute';
                labelEl.style.right = '15px';
                labelEl.style.top = '0';
                labelEl.style.height = '100%';
                labelEl.style.display = 'flex';
                labelEl.style.alignItems = 'center';
                labelEl.style.zIndex = '1';
                labelEl.style.fontWeight = '600';
                labelEl.textContent = `${level}%`;
                bar.appendChild(labelEl);
            }
        });
        // Animate skill bars when they come into view
        this.setupSkillBarAnimation();
    }
    /**
     * Sets up intersection observer to animate skill bars when they come into view
     */
    setupSkillBarAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const skillLevel = skillBar.querySelector('span');
                    skillLevel.style.transform = 'scaleX(1)';
                    // Unobserve after animation
                    observer.unobserve(skillBar);
                }
            });
        }, { threshold: 0.2 });
        // Observe all skill bars
        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}
/**
 * Initialize the website when the DOM is fully loaded
 */
if (document.readyState !== 'loading') {
    new WebsiteController();
}
else {
    document.addEventListener('DOMContentLoaded', () => new WebsiteController());
}
