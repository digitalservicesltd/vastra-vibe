/* ============================================================
   VASTRA VIBE BHADWAR — LUXURY WEDDING RENTAL
   JAVASCRIPT MODULE
   
   TABLE OF CONTENTS:
   1. Constants & State
   2. Navbar — Scroll & Toggle
   3. Scroll Reveal (IntersectionObserver)
   4. Modal — Open / Close / Trap Focus
   5. WhatsApp Message Builder
   6. Product Enquiry Buttons
   7. Gallery — Drag Scroll
   8. Sticky WhatsApp Bar
   9. Hero Stagger Initialization
   10. Init
============================================================ */

'use strict';

/* ============================================================
   1. CONSTANTS & STATE
============================================================ */

const WA_NUMBER = '918894868857'; // WhatsApp number with country code

const state = {
  modalOpen: false,
  lastFocused: null,
  enquiryProduct: null,
  enquiryType: null,
  isDragging: false,
  startX: 0,
  scrollLeft: 0,
};

/* ============================================================
   2. NAVBAR — SCROLL & TOGGLE
============================================================ */

function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = navLinks.querySelectorAll('.navbar__link');

  if (!navbar || !toggle || !navLinks) return;

  // --- Scroll behaviour ---
  let ticking = false;

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });

  // --- Active link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  // --- Mobile toggle ---
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when link clicked
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navbar.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   3. SCROLL REVEAL (IntersectionObserver)
============================================================ */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   4. MODAL — OPEN / CLOSE / TRAP FOCUS
============================================================ */

function openModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const modal    = document.getElementById('consultModal');

  if (!backdrop || !modal) return;

  state.lastFocused = document.activeElement;
  state.modalOpen   = true;

  backdrop.classList.add('active');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus first focusable element
  requestAnimationFrame(() => {
    const firstInput = modal.querySelector('select, input, button');
    if (firstInput) firstInput.focus();
  });
}

function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');

  if (!backdrop) return;

  state.modalOpen = false;

  backdrop.classList.remove('active');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Reset product context
  state.enquiryProduct = null;
  state.enquiryType    = null;

  // Restore focus
  if (state.lastFocused) {
    state.lastFocused.focus();
  }
}

function initModal() {
  const backdrop   = document.getElementById('modalBackdrop');
  const closeBtn   = document.getElementById('modalClose');
  const heroBtn    = document.getElementById('heroConsultBtn');
  const navBtn     = document.getElementById('navConsultBtn');
  const finalBtn   = document.getElementById('finalCtaBtn');
  const stickyBtn  = document.getElementById('stickyWaBtn');

  if (!backdrop) return;

  // Open triggers
  [heroBtn, navBtn, finalBtn, stickyBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Backdrop click to close
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.modalOpen) closeModal();
  });

  // Focus trap inside modal
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusable = modal.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}

/* ============================================================
   5. WHATSAPP MESSAGE BUILDER
============================================================ */

function buildWhatsAppMessage(data) {
  const lines = [
    '🌸 *Vastra Vibe Bhadwar — Styling Consultation*',
    '',
    `*Name:* ${data.name || 'Not provided'}`,
    `*City:* ${data.city || 'Not provided'}`,
    `*Shopping For:* ${data.shoppingFor || 'Not specified'}`,
    `*Occasion:* ${data.occasion || 'Not specified'}`,
    `*Preferred Color:* ${data.color || 'Not specified'}`,
    `*Wedding Date:* ${data.weddingDate || 'Not specified'}`,
  ];

  // If enquiry came from a product card
  if (data.product) {
    lines.push('', `*Enquiry About:* ${data.product}`);
    if (data.productType) {
      lines.push(`*Category:* ${data.productType}`);
    }
  }

  lines.push('', 'Please assist me with availability and rental details. Thank you!');

  return lines.join('\n');
}

function sendToWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WA_NUMBER}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ============================================================
   6. FORM SUBMISSION & PRODUCT ENQUIRY BUTTONS
============================================================ */

function initForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.customerName.value.trim();
    const city = form.customerCity.value.trim();

    if (!name) {
      form.customerName.focus();
      showFieldError(form.customerName, 'Please enter your name');
      return;
    }

    if (!city) {
      form.customerCity.focus();
      showFieldError(form.customerCity, 'Please enter your city');
      return;
    }

    const data = {
      name:         name,
      city:         city,
      shoppingFor:  form.shoppingFor.value,
      occasion:     form.occasion.value,
      color:        form.preferredColor.value.trim(),
      weddingDate:  form.weddingDate.value
                      ? formatDate(form.weddingDate.value)
                      : '',
      product:      state.enquiryProduct,
      productType:  state.enquiryType,
    };

    const message = buildWhatsAppMessage(data);
    sendToWhatsApp(message);
    closeModal();
    form.reset();
  });

  // Clear error on input
  form.querySelectorAll('.form-input, .form-select').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
  });
}

function showFieldError(field, message) {
  clearFieldError(field);
  field.style.borderColor = '#e07b5a';

  const errorEl = document.createElement('span');
  errorEl.className = 'form-error';
  errorEl.style.cssText = 'font-size:0.75rem;color:#e07b5a;margin-top:0.25rem;display:block;';
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');

  field.parentElement.appendChild(errorEl);
}

function clearFieldError(field) {
  field.style.borderColor = '';
  const parent = field.parentElement;
  const errorEl = parent.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function initProductEnquiries() {
  // All product enquiry buttons (cards)
  document.querySelectorAll('[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.enquiryProduct = btn.getAttribute('data-product');
      state.enquiryType    = btn.getAttribute('data-type') || '';

      // Pre-fill "Shopping For" if type gives hint
      const shoppingForField = document.getElementById('shoppingFor');
      if (shoppingForField && state.enquiryType) {
        if (state.enquiryType.toLowerCase().includes('bridal') ||
            state.enquiryType.toLowerCase().includes('lehenga')) {
          shoppingForField.value = 'Bride';
        } else if (state.enquiryType.toLowerCase().includes('groom') ||
                   state.enquiryType.toLowerCase().includes('sherwani') ||
                   state.enquiryType.toLowerCase().includes('jodhpuri') ||
                   state.enquiryType.toLowerCase().includes('indo-western') ||
                   state.enquiryType.toLowerCase().includes('ensemble')) {
          shoppingForField.value = 'Groom';
        } else if (state.enquiryType === 'Accessory') {
          shoppingForField.value = '';
        }
      }

      openModal();
    });
  });
}

/* ============================================================
   7. GALLERY — DRAG SCROLL
============================================================ */

function initGalleryDrag() {
  const track = document.getElementById('galleryTrack');
  const wrap  = track ? track.closest('.gallery__track-wrap') : null;

  if (!wrap || !track) return;

  wrap.addEventListener('mousedown', (e) => {
    state.isDragging  = true;
    state.startX      = e.pageX - wrap.offsetLeft;
    state.scrollLeft  = wrap.scrollLeft;
    wrap.style.cursor = 'grabbing';
  });

  wrap.addEventListener('mouseleave', () => {
    state.isDragging  = false;
    wrap.style.cursor = 'grab';
  });

  wrap.addEventListener('mouseup', () => {
    state.isDragging  = false;
    wrap.style.cursor = 'grab';
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    e.preventDefault();
    const x     = e.pageX - wrap.offsetLeft;
    const walk  = (x - state.startX) * 1.4;
    wrap.scrollLeft = state.scrollLeft - walk;
  });

  // Touch support
  let touchStartX = 0;
  let touchScrollLeft = 0;

  wrap.addEventListener('touchstart', (e) => {
    touchStartX      = e.touches[0].pageX;
    touchScrollLeft  = wrap.scrollLeft;
  }, { passive: true });

  wrap.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].pageX;
    wrap.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });
}

/* ============================================================
   8. STICKY WHATSAPP BAR
============================================================ */

function initStickyWa() {
  const stickyWa = document.getElementById('stickyWa');
  if (!stickyWa) return;

  // Delay appearance after page load
  setTimeout(() => {
    stickyWa.classList.add('visible');
  }, 900);

  // On mobile, hide sticky bar when footer is visible
  const footer = document.querySelector('.footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyWa.style.opacity = '0';
          stickyWa.style.pointerEvents = 'none';
        } else {
          stickyWa.style.opacity = '';
          stickyWa.style.pointerEvents = '';
        }
      });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
  }
}

/* ============================================================
   9. HERO STAGGER INITIALIZATION
============================================================ */

function initHeroStagger() {
  // Hero elements that should stagger on load
  const heroItems = document.querySelectorAll('.hero .reveal-up');

  heroItems.forEach((el, index) => {
    // Override transition delay for hero items specifically
    const delay = index * 120 + 150;
    el.style.transitionDelay = `${delay}ms`;

    // Trigger after short paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('revealed');
      });
    });
  });
}

/* ============================================================
   10. SMOOTH SECTION TRANSITION HINT
       (adds visual connector between dark and light sections)
============================================================ */

function addSectionTransitions() {
  // The CSS gradient transitions handle this visually.
  // This JS hook is ready for future enhancement.
}

/* ============================================================
   10. INIT — DOM READY
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initScrollReveal();
  initModal();
  initForm();
  initProductEnquiries();
  initGalleryDrag();
  initStickyWa();
  initHeroStagger();
  addSectionTransitions();

  // Smooth scroll polyfill for older Safari
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});