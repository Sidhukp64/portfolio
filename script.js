/**
 * ============================================================
 *  SIDHARTH KP — Portfolio Script
 *  Features:
 *   • Dark / Light theme (persisted in localStorage)
 *   • Hamburger mobile menu
 *   • Scrollspy — active nav link highlight
 *   • Smooth scroll (native CSS) + back-to-top button
 *   • Typewriter effect (rotating roles)
 *   • IntersectionObserver scroll-reveal (.reveal-up → .visible)
 *   • Animated skill-bar widths on scroll-in
 *   • 3D tilt effect on project cards (pure JS, no library)
 *   • Web3Forms async contact form submission
 *   • Custom toast notifications (no alert())
 * ============================================================
 */

/* ── Wait for DOM to be ready ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. THEME TOGGLE
     ============================================================ */
  const htmlEl      = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  /** Apply a theme string ('dark' | 'light') to the document */
  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Restore saved theme, falling back to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* ============================================================
     2. HAMBURGER MOBILE MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on mobile link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });


  /* ============================================================
     3. NAVBAR — scroll shadow + back-to-top visibility
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('scrolled', scrollY > 20);

    // Back-to-top button
    backToTop.classList.toggle('visible', scrollY > 400);

    // Scrollspy
    updateScrollspy();
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     4. SCROLLSPY — highlight active nav link
     ============================================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function updateScrollspy() {
    const scrollY = window.scrollY + 120; // offset for navbar height

    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });

    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // Run once on load
  updateScrollspy();


  /* ============================================================
     5. TYPEWRITER EFFECT
     ============================================================ */
  const roles = [
    'Information Technology Student',
    'AI Assisted Full Stack Developer',
    'Aspiring Data Analyst',
  ];

  const typewriterEl     = document.getElementById('typewriter');
  const typewriterPrefix = document.querySelector('.typewriter-prefix');
  let roleIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typeTimer   = null;

  function typeWriter() {
    const currentRole = roles[roleIndex];

    // Dynamically use 'I am an' for vowels, 'I am a' for consonants
    if (typewriterPrefix && charIndex === 0) {
      const firstLetter = currentRole.trim().charAt(0).toUpperCase();
      const isVowel = ['A', 'E', 'I', 'O', 'U'].includes(firstLetter);
      typewriterPrefix.textContent = isVowel ? 'I am an ' : 'I am a ';
    }

    if (isDeleting) {
      // Remove one character
      charIndex--;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
    } else {
      // Add one character
      charIndex++;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    typeTimer = setTimeout(typeWriter, delay);
  }

  // Start typewriter
  typeWriter();


  /* ============================================================
     6. SCROLL-REVEAL — IntersectionObserver for .reveal-up
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));


  /* ============================================================
     7. SKILL CHIPS HOVER TILT / ENTRANCE
     ============================================================ */
  const skillChips = document.querySelectorAll('.skill-chip, .soft-skill-card');
  skillChips.forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      chip.style.transform = 'translateY(-2px)';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transform = '';
    });
  });


  /* ============================================================
     8. 3D TILT EFFECT — project cards
     ============================================================ */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });

  function handleTilt(e) {
    const card   = e.currentTarget;
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;  // x position within card
    const y      = e.clientY - rect.top;   // y position within card
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;

    // Tilt magnitude (degrees)
    const maxTilt = 8;
    const rotateY =  ((x - cx) / cx) * maxTilt;
    const rotateX = -((y - cy) / cy) * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    card.style.transition = 'transform 0.05s ease';
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
  }


  /* ============================================================
     9. CONTACT FORM — Web3Forms async submission
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  const submitBtn   = document.getElementById('submit-btn');
  const btnText     = document.getElementById('btn-text');
  const btnSpinner  = document.getElementById('btn-spinner');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // --- Validate manually (form has `novalidate`) ---
      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // --- Show loading state ---
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';

      // Build form data object for Web3Forms
      const formData = {
        access_key: '7a7b37ce-b998-43d7-819c-dfc9e0b2ac70',
        name,
        email,
        subject,
        message,
        from_name: 'Sidharth KP Portfolio',
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast('Message sent successfully! I\'ll get back to you soon. 🎉', 'success');
          contactForm.reset();
        } else {
          showToast(result.message || 'Something went wrong. Please try again.', 'error');
        }

      } catch (err) {
        console.error('Form submission error:', err);
        showToast('Network error. Please check your connection and try again.', 'error');
      } finally {
        // Restore button
        submitBtn.disabled = false;
        btnText.style.display = '';
        btnSpinner.style.display = 'none';
      }
    });
  }


  /* ============================================================
     10. TOAST NOTIFICATIONS
     ============================================================ */
  const toastContainer = document.getElementById('toast-container');

  /**
   * Display a toast notification.
   * @param {string} message  - Toast text content
   * @param {'success'|'error'} type - Visual variant
   * @param {number} duration - Auto-dismiss in ms (default 5000)
   */
  function showToast(message, type = 'success', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    const icon = type === 'success'
      ? '<i class="fas fa-check-circle" aria-hidden="true"></i>'
      : '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Auto-remove
    const dismissTimer = setTimeout(() => removeToast(toast), duration);

    // Allow clicking to dismiss early
    toast.addEventListener('click', () => {
      clearTimeout(dismissTimer);
      removeToast(toast);
    });
  }

  function removeToast(toast) {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  // Expose showToast globally (useful for debugging)
  window.showToast = showToast;


  /* ============================================================
     11. SMOOTH SCROLL — polyfill for anchor hrefs (already handled
         by CSS `scroll-behavior: smooth`, but ensure nav links work
         cross-browser and close the mobile menu)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        toggleMenu(false);
      }
    });
  });

}); // end DOMContentLoaded
