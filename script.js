document.addEventListener('DOMContentLoaded', function() {
    // Create bubbles for background
    createBubbles();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Back to top button functionality
    const backToTopBtn = document.querySelector('.back-to-top a');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
    }
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formFeedback = document.getElementById('formFeedback');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Form validation
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = new FormData(contactForm);
            const originalBtnContent = submitBtn.innerHTML;
            
            try {
                // UI Loading State
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
                
                // Send data to PHP backend
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                // Handle response
                if (response.ok) {
                    formFeedback.textContent = result.message || '✓ Message sent successfully!';
                    formFeedback.className = 'form-feedback success';
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formFeedback.textContent = '';
                        formFeedback.className = 'form-feedback';
                    }, 5000);
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                formFeedback.textContent = error.message || '⚠ Error sending message. Please try again.';
                formFeedback.className = 'form-feedback error';
                console.error('Form submission error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Custom cursor implementation
    const cursorMain = document.createElement('div');
    cursorMain.classList.add('cursor-main');
    document.body.appendChild(cursorMain);

    let lastX = 0;
    let lastY = 0;
    let lastTimestamp = 0;

    // Throttled mousemove handler for better performance
    const handleMouseMove = (e) => {
        const now = Date.now();
        if (now - lastTimestamp < 16) return; // ~60fps
        lastTimestamp = now;

        // Update main cursor position
        cursorMain.style.left = `${e.clientX}px`;
        cursorMain.style.top = `${e.clientY}px`;
        
        // Create trail dots with distance threshold
        const distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
        if (distance > 30) {
            createTrailDot(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }

        // Dynamic contrast adjustment
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const bgColor = elementBelow ? window.getComputedStyle(elementBelow).backgroundColor : '';
        const isDarkBg = bgColor.includes('18, 18, 18') || bgColor.includes('10, 10, 10'); // Match your dark colors
        
        cursorMain.style.boxShadow = isDarkBg 
            ? '0 0 0 2px rgba(255,255,255,0.9), 0 0 15px 5px rgba(108, 99, 255, 0.8)'
            : '0 0 0 2px rgba(0,0,0,0.7), 0 0 15px 5px rgba(108, 99, 255, 0.8)';
    };

    document.addEventListener('mousemove', handleMouseMove);

    function createTrailDot(x, y) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        document.body.appendChild(trail);
        
        // Auto-remove after animation
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }

    // Interactive elements effects
    const interactiveElements = document.querySelectorAll(
        'a, button, .card, .project-card, input, textarea, .skill-category, .contact-method, nav a, [data-cursor-hover]'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorMain.classList.add('interactive-cursor');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorMain.classList.remove('interactive-cursor');
        });
    });

    // Click effect
    document.addEventListener('click', (e) => {
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('cursor-click');
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);
        
        setTimeout(() => {
            clickEffect.remove();
        }, 600);
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Handle cursor visibility when resizing
    window.addEventListener('resize', () => {
        cursorMain.style.display = 'none';
        setTimeout(() => {
            cursorMain.style.display = 'block';
        }, 100);
    });
});

function createBubbles() {
    const bubblesContainer = document.querySelector('.bubbles');
    if (!bubblesContainer) return;
    
    const bubbleCount = 10;
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubblesContainer.appendChild(bubble);
    }
}
