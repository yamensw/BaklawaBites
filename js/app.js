(() => {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    // Initialize all animations and interactions
    initSite();
  });

  function initSite() {
    // Add floating background elements
    createFloatingElements();
    
    // Initialize scroll progress bar
    initScrollProgress();
    
    // Trigger hero animations
    document.body.classList.add('loaded');
    
    // Initialize scroll effects for header
    initScrollHeader();
    
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize gallery hover effects
    initGallery();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Set current year in footer
    document.getElementById('y').textContent = new Date().getFullYear();
    
    // Add subtle hover effect to product cards
    initProductHover();
  }

  function createFloatingElements() {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'floating-bg-container';
    
    const pistachio = document.createElement('div');
    pistachio.className = 'floating-bg pistachio';
    bgContainer.appendChild(pistachio);
    
    const walnut = document.createElement('div');
    walnut.className = 'floating-bg walnut';
    bgContainer.appendChild(walnut);
    
    document.body.appendChild(bgContainer);
  }

  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  function initScrollHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.gCard, .packCard');
    
    if (!revealElements.length || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
            
            // Add staggered animation for product cards
            if (entry.target.classList.contains('packCard')) {
              const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
              entry.target.style.animationDelay = `${index * 0.1}s`;
            }
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        // Close any open details elements
        document.querySelectorAll('details[open]').forEach(details => {
          details.removeAttribute('open');
        });
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page jump
        history.pushState(null, '', href);
      });
    });
  }

  function initGallery() {
    const galleryCards = document.querySelectorAll('.gCard');
    
    galleryCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.zIndex = '';
      });
    });
    
    // Optional: Add lightbox functionality
    initLightbox();
  }

  function initLightbox() {
    const galleryImages = document.querySelectorAll('.gCard');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">×</button>
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    galleryImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = img.querySelector('img').src;
        const imgAlt = img.querySelector('img').alt;
        
        lightbox.querySelector('.lightbox-image').src = imgSrc;
        lightbox.querySelector('.lightbox-caption').textContent = imgAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop') || 
          e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Add lightbox styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
      .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .lightbox.active {
        display: flex;
      }
      .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(10px);
      }
      .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        z-index: 1;
      }
      .lightbox-image {
        width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      }
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .lightbox-close:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      .lightbox-caption {
        color: white;
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(lightboxStyles);
  }

  function initFAQ() {
    const faqItems = document.querySelectorAll('details');
    
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          // Close other open items
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.open) {
              otherItem.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  function initProductHover() {
    const productCards = document.querySelectorAll('.packCard');
    
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Close lightbox on Escape
    if (e.key === 'Escape') {
      const lightbox = document.querySelector('.lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
})();
