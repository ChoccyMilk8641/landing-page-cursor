// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createThemeToggle();
        
        // Add event listeners
        this.addEventListeners();
    }

    createThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        // Add icon based on current theme
        const icon = document.createElement('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.appendChild(icon);
        
        // Add to navigation
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(themeToggle);
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update toggle button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update meta theme color
        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = theme === 'dark' ? '#212529' : '#ffffff';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add transition effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    addEventListeners() {
        // Theme toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + J)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // System theme preference
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Card Hover Effects
function initCardEffects() {
    const cards = document.querySelectorAll('.game-card, .console-card, .accessory-card, .deal-card, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Search Functionality
function initSearch() {
    const searchBtn = document.querySelector('a[href="#search"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSearchModal();
        });
    }
}

function showSearchModal() {
    // Create search modal
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-content">
            <div class="search-header">
                <h3>Search Games & Products</h3>
                <button class="search-close" aria-label="Close search">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" placeholder="Search for games, consoles, accessories..." class="search-input">
                <button class="search-submit">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="suggestion-tags">
                    <span class="suggestion-tag">PlayStation 5</span>
                    <span class="suggestion-tag">Xbox Series X</span>
                    <span class="suggestion-tag">Nintendo Switch</span>
                    <span class="suggestion-tag">Gaming Headsets</span>
                    <span class="suggestion-tag">Controllers</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
        modal.querySelector('.search-input').focus();
    }, 100);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.search-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
    
    // Search functionality
    const searchInput = modal.querySelector('.search-input');
    const searchSubmit = modal.querySelector('.search-submit');
    
    searchSubmit.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Searching for: ${query}`, 'info');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchSubmit.click();
        }
    });
    
    // Suggestion tags
    const suggestionTags = modal.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            searchSubmit.click();
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize other functionality
    initSmoothScrolling();
    initFormHandling();
    initLazyLoading();
    initCardEffects();
    initSearch();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to GameHub! 🎮', 'info');
    }, 1000);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll effects
window.addEventListener('scroll', debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 10));