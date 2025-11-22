class TextAnimator {
    constructor() {
        this.lines = document.querySelectorAll('.title-line');
        this.subtitles = document.querySelectorAll('.subtitle-line');
        this.currentIndex = 0;
        this.interval = null;
        this.init();
    }
    
    init() {
        // Set initial active states
        this.lines[0].style.opacity = '1';
        this.lines[0].style.transform = 'translateY(0)';
        this.subtitles[0].style.opacity = '1';
        this.subtitles[0].style.transform = 'translateY(0)';
        
        this.startRotation();
        
        // Pause on hover
        const heroContent = document.querySelector('.hero-content');
        heroContent.addEventListener('mouseenter', () => this.stopRotation());
        heroContent.addEventListener('mouseleave', () => this.startRotation());
    }
    
    rotateText() {
        // Hide current lines
        this.lines[this.currentIndex].style.opacity = '0';
        this.lines[this.currentIndex].style.transform = 'translateY(-40px)';
        this.subtitles[this.currentIndex].style.opacity = '0';
        this.subtitles[this.currentIndex].style.transform = 'translateY(-30px)';
        
        // Calculate next index
        this.currentIndex = (this.currentIndex + 1) % this.lines.length;
        
        // Show next lines
        setTimeout(() => {
            this.lines[this.currentIndex].style.opacity = '1';
            this.lines[this.currentIndex].style.transform = 'translateY(0)';
            this.subtitles[this.currentIndex].style.opacity = '1';
            this.subtitles[this.currentIndex].style.transform = 'translateY(0)';
        }, 600);
    }
    
    startRotation() {
        this.interval = setInterval(() => {
            this.rotateText();
        }, 3500);
    }
    
    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

class ProjectShowcase {
    constructor() {
        this.items = document.querySelectorAll('.project-showcase-item');
        this.container = document.querySelector('.project-showcase');
        this.scrollArea = document.querySelector('.project-showcase-scroll');
        this.totalItems = this.items.length;
        this.currentIndex = 0;
        this.scrollProgress = 0;
        this.init();
    }
    
    init() {
        // Set initial active item
        this.updateItemStates();
        
        // Add scroll event listener with throttling
        this.throttledScroll = this.throttle(() => this.handleScroll(), 16);
        window.addEventListener('scroll', this.throttledScroll);
        
        // Add resize event listener
        window.addEventListener('resize', () => this.handleResize());
        
        // Smooth scroll for hero indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.container.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const containerStart = this.container.offsetTop;
        const containerHeight = this.scrollArea.offsetHeight;
        
        // Calculate scroll progress through the showcase section (0 to 1)
        const maxScroll = containerStart + containerHeight - windowHeight;
        this.scrollProgress = Math.max(0, Math.min(1, (scrollY - containerStart) / (containerHeight - windowHeight)));
        
        // Calculate which item should be active based on scroll position
        const itemHeight = containerHeight / this.totalItems;
        const newIndex = Math.floor((scrollY - containerStart) / itemHeight);
        
        const clampedIndex = Math.max(0, Math.min(this.totalItems - 1, newIndex));
        
        if (clampedIndex !== this.currentIndex) {
            this.currentIndex = clampedIndex;
        }
        
        // Calculate progress within current item (0 to 1)
        const itemStart = containerStart + (this.currentIndex * itemHeight);
        const itemProgress = Math.max(0, Math.min(1, (scrollY - itemStart) / itemHeight));
        
        this.updateItemStates(itemProgress);
    }
    
    updateItemStates(itemProgress = 0) {
        this.items.forEach((item, index) => {
            const distance = index - this.currentIndex;
            
            // Remove all state classes
            item.classList.remove('active', 'previous', 'next', 'far');
            
            if (distance === 0) {
                // Current active item
                item.classList.add('active');
                this.updateActiveItem(item, itemProgress);
            } else if (distance === -1) {
                // Previous item
                item.classList.add('previous');
                this.updatePreviousItem(item, itemProgress);
            } else if (distance === 1) {
                // Next item
                item.classList.add('next');
                this.updateNextItem(item, itemProgress);
            } else {
                // Far items
                item.classList.add('far');
                this.updateFarItem(item, distance);
            }
        });
    }
    
    updateActiveItem(item, progress) {
        const card = item.querySelector('.project-showcase-card');
        // Active card scales down slightly and moves up as we scroll through its section
        const scale = 1 - (0.04 * progress);
        const translateY = -30 * progress;
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
    
    updatePreviousItem(item, progress) {
        const card = item.querySelector('.project-showcase-card');
        // Previous card moves up and scales up slightly
        const scale = 0.92 + (0.03 * progress);
        const translateY = -60 + (25 * progress);
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
    
    updateNextItem(item, progress) {
        const card = item.querySelector('.project-showcase-card');
        // Next card moves up and scales up
        const scale = 0.96 - (0.04 * progress);
        const translateY = 40 - (40 * progress);
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
    
    updateFarItem(item, distance) {
        const card = item.querySelector('.project-showcase-card');
        // Far items are scaled down based on distance
        const scale = 0.88 - (Math.abs(distance) * 0.02);
        const translateY = distance > 0 ? 80 : -60;
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
    
    handleResize() {
        // Reset transforms on resize
        this.items.forEach(item => {
            const card = item.querySelector('.project-showcase-card');
            card.style.transform = 'scale(0.96) translateY(40px)';
        });
        this.updateItemStates();
    }
}

// Header scroll effect
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.08)';
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
            }
            
            // Hide header on scroll down
            if (scrollY > this.lastScrollY && scrollY > 100) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = scrollY;
        });
    }
}

// Section Navigation System
class SectionNavigation {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.prevButton = document.getElementById('prevSection');
        this.nextButton = document.getElementById('nextSection');
        this.organicShapes = document.querySelectorAll('.organic-shape');
        
        this.sections = document.querySelectorAll('.section');
        this.currentSectionIndex = 0;
        this.isScrolling = false;
        this.init();
    }
    
    init() {
        this.updateNavigation();
        
        // Add event listeners
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSection(index);
            });
        });

        this.prevButton.addEventListener('click', () => {
            this.goToSection(this.currentSectionIndex - 1);
        });

        this.nextButton.addEventListener('click', () => {
            this.goToSection(this.currentSectionIndex + 1);
        });

        // Scroll event for section detection
        window.addEventListener('scroll', () => {
            if (this.isScrolling) return;
            this.detectCurrentSection();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToSection(this.currentSectionIndex - 1);
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToSection(this.currentSectionIndex + 1);
            }
        });

        // Add random variations to animations
        this.addRandomVariations();
        setInterval(() => this.addRandomVariations(), 30000);
    }
    
    updateNavigation() {
        // Update progress bar
        const progress = (this.currentSectionIndex / (this.sections.length - 1)) * 100;
        this.progressBar.style.height = `${progress}%`;
        
        // Update dots
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSectionIndex);
        });
        
        // Update buttons
        this.prevButton.disabled = this.currentSectionIndex === 0;
        this.nextButton.disabled = this.currentSectionIndex === this.sections.length - 1;
        
        // Update background opacity
        this.updateBackgroundOpacity();
    }
    
    updateBackgroundOpacity() {
        if (this.currentSectionIndex === 0) {
            // On hero section - more visible background
            this.organicShapes.forEach(shape => {
                shape.style.opacity = '0.08';
                shape.style.filter = 'blur(8px) brightness(1.1)';
            });
        } else {
            // On projects section - more subtle background
            this.organicShapes.forEach(shape => {
                shape.style.opacity = '0.04';
                shape.style.filter = 'blur(12px) brightness(0.9)';
            });
        }
    }
    
    goToSection(index) {
        if (index >= 0 && index < this.sections.length && !this.isScrolling) {
            this.isScrolling = true;
            this.currentSectionIndex = index;
            
            this.sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            setTimeout(() => {
                this.isScrolling = false;
                this.updateNavigation();
            }, 800);
        }
    }
    
    detectCurrentSection() {
        let newIndex = 0;
        let minDistance = Infinity;

        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            const distanceFromMiddle = Math.abs(window.scrollY + window.innerHeight / 2 - sectionMiddle);
            
            if (distanceFromMiddle < minDistance) {
                minDistance = distanceFromMiddle;
                newIndex = index;
            }
        });
        
        if (newIndex !== this.currentSectionIndex) {
            this.currentSectionIndex = newIndex;
            this.updateNavigation();
        }
    }
    
    addRandomVariations() {
        this.organicShapes.forEach((shape, index) => {
            const randomSpeed = 1 + (Math.random() - 0.5) * 0.4;
            const currentAnimations = shape.style.animationDuration;

            if (currentAnimations) {
                const newDurations = currentAnimations.split(',')
                    .map(duration => {
                        const baseTime = parseFloat(duration);
                        return `${baseTime * randomSpeed}s`;
                    })
                    .join(', ');
                
                shape.style.animationDuration = newDurations;
            }
        });
    }
}

// Touch swipe handling for mobile
class TouchNavigation {
    constructor() {
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.sectionNav = new SectionNavigation();
        this.init();
    }
    
    init() {
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    handleTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
        this.touchStartX = event.touches[0].clientX;
    }
    
    handleTouchEnd(event) {
        const touchEndY = event.changedTouches[0].clientY;
        const touchEndX = event.changedTouches[0].clientX;
        
        const deltaY = this.touchStartY - touchEndY;
        const deltaX = this.touchStartX - touchEndX;
        
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                // Swipe left - next section
                this.sectionNav.goToSection(this.sectionNav.currentSectionIndex + 1);
            } else {
                // Swipe right - previous section
                this.sectionNav.goToSection(this.sectionNav.currentSectionIndex - 1);
            }
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextAnimator();
    new ProjectShowcase();
    new HeaderScroll();
    new SectionNavigation();
    new TouchNavigation();
    
    // Fade in body
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});