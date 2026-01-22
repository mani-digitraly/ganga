/* ================================================
   GANGA CAR CARE - Main JavaScript
   Multi-Page Application
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  
  initLoader();
  initNavigation();
  initAnimations();
  initHeaderScroll();
  initHeroGallery();
});

// Loader
function initLoader() {
  const loader = document.querySelector('.loader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
      animatePageContent();
    }, 400);
  });
  
  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
      animatePageContent();
    }, 400);
  }
}

// Navigation
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links only
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const position = target.offsetTop - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // Active nav highlighting
  highlightCurrentPage();
}

// Highlight current page in navigation
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('text-accent');
      link.classList.remove('text-neutral-400');
    }
  });
}

// Page Content Animation
function animatePageContent() {
  // Fade in elements
  gsap.to('.gsap-fade-in', {
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Slide up elements
  gsap.to('.gsap-slide-up', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Scale in elements
  gsap.to('.gsap-scale-in', {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power2.out',
    delay: 0.3
  });
}

// Scroll Animations
function initAnimations() {
  // Service cards animation
  gsap.utils.toArray('.service-card, .service-card-large, .feature-card, .stat-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.05,
      ease: 'power2.out'
    });
  });

  // Section headings animation
  gsap.utils.toArray('section').forEach(section => {
    const heading = section.querySelector('h2');
    if (heading) {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });

  // Parallax effect for hero orbs (homepage only)
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      orbs.forEach((orb, index) => {
        const factor = (index + 1) * 0.5;
        gsap.to(orb, {
          x: x * factor,
          y: y * factor,
          duration: 1,
          ease: 'power2.out'
        });
      });
    });
  }

  // Icon cards float animation (homepage only)
  const floatingIcons = document.querySelectorAll('.floating-icon');
  floatingIcons.forEach((icon, i) => {
    gsap.to(icon, {
      y: -15,
      duration: 2 + i * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header-transparent, .header-hero');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// Hero Gallery Auto-Rotate
function initHeroGallery() {
  const images = document.querySelectorAll('.hero-bg-image');
  const dots = document.querySelectorAll('.hero-dot');
  
  if (images.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = images.length;
  
  // Function to show specific image
  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  // Auto rotate every 5 seconds
  let autoRotate = setInterval(() => {
    const nextIndex = (currentIndex + 1) % totalImages;
    showImage(nextIndex);
  }, 5000);
  
  // Click on dots to change image
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(autoRotate);
      showImage(index);
      // Restart auto rotation
      autoRotate = setInterval(() => {
        const nextIndex = (currentIndex + 1) % totalImages;
        showImage(nextIndex);
      }, 5000);
    });
  });
}

// Utility: Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
