// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for filter links
    const filterLinks = document.querySelectorAll('.filter-item');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 140; // Adjust for fixed headers
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active filter
                filterLinks.forEach(item => item.classList.remove('selected-item'));
                this.classList.add('selected-item');
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Update active filter on scroll
    let sections = document.querySelectorAll('.products-block');
    let filterItems = document.querySelectorAll('.filter-item');
    
    function updateActiveFilter() {
        let current = '';
        let scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.querySelector('.category-anchor').getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        filterItems.forEach(item => {
            item.classList.remove('selected-item');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('selected-item');
            }
        });
    }
    
    // Check URL hash on page load
    function checkInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 140;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active filter
                filterItems.forEach(item => {
                    item.classList.remove('selected-item');
                    if (item.getAttribute('href') === hash) {
                        item.classList.add('selected-item');
                    }
                });
            }
        }
    }
    
    window.addEventListener('scroll', updateActiveFilter);
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('.lazyload-placeholder');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                // In a real implementation, you would load the actual image here
                // For now, we'll just add a background color
                placeholder.style.backgroundColor = '#e9ecef';
                placeholder.innerHTML = '<span>Изображение</span>';
                imageObserver.unobserve(placeholder);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Update any layout calculations if needed
        }, 250);
    });
    
    // Keyboard navigation for filters
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const filterContainer = document.querySelector('.filter-by-category');
            if (filterContainer) {
                if (e.key === 'ArrowRight') {
                    filterContainer.scrollLeft += 100;
                } else if (e.key === 'ArrowLeft') {
                    filterContainer.scrollLeft -= 100;
                }
            }
        }
    });
    
    // Touch swipe for filters on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const filterContainer = document.querySelector('.filter-by-category');
    
    if (filterContainer) {
        filterContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        filterContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right
                filterContainer.scrollLeft -= 200;
            } else {
                // Swipe left
                filterContainer.scrollLeft += 200;
            }
        }
    }
    
    // Initialize
    updateActiveFilter();
    checkInitialHash();
    
    // Add scroll indicator for filters on mobile
    function updateScrollIndicator() {
        const filterContainer = document.querySelector('.filter-by-category');
        if (filterContainer) {
            const scrollLeft = filterContainer.scrollLeft;
            const scrollWidth = filterContainer.scrollWidth;
            const clientWidth = filterContainer.clientWidth;
            
            // You could add a visual indicator here if needed
            // For example, showing/hiding arrow buttons
        }
    }
    
    if (document.querySelector('.filter-by-category')) {
        document.querySelector('.filter-by-category').addEventListener('scroll', updateScrollIndicator);
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to images
    const images = document.querySelectorAll('.photo');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const container = this.closest('.photo-container');
            if (container) {
                container.innerHTML = '<div class="lazyload-placeholder"><span>Изображение не найдено</span></div>';
            }
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Add hover effects to filter items
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected-item')) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Performance optimization
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(function() {
            // Scroll-related updates
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
