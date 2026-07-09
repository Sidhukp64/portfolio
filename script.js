// Professional Biodata Website JavaScript

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation active state
    updateNavigation(sectionId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update navigation active state
function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if this link corresponds to the active section
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1); // Remove the '#' 
            showSection(sectionId);
        });
    });
    
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit using fetch
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    alert(`Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`);
                    contactForm.reset();
                } else {
                    console.log(response);
                    alert(json.message || 'Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Form submission failed. Please check your internet connection.');
            })
            .then(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Add hover effects to navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add smooth scrolling for better UX
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with home section active
    showSection('home');
});

// Mobile menu functionality (basic implementation)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'none' || navLinks.style.display === '') {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'var(--card)';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = 'var(--shadow-nav)';
    } else {
        navLinks.style.display = 'none';
    }
}

// Add mobile menu toggle event
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
        mobileMenu.style.cursor = 'pointer';
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.backgroundColor = 'transparent';
        navLinks.style.padding = '0';
        navLinks.style.boxShadow = 'none';
    } else {
        navLinks.style.display = 'none';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

// Utility function to validate email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Add print functionality
function printPage() {
    window.print();
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showSection('home');
                break;
            case '2':
                e.preventDefault();
                showSection('personal');
                break;
            case '3':
                e.preventDefault();
                showSection('education');
                break;
            case '4':
                e.preventDefault();
                showSection('skills');
                break;
            case '5':
                e.preventDefault();
                showSection('training');
                break;
            case '8':
                e.preventDefault();
                showSection('contact');
                break;
        }
    }
});