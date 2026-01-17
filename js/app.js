(() => {
  // Update current year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ===== ENHANCED REVEAL ANIMATIONS =====
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  const staggerContainers = Array.from(document.querySelectorAll('.stagger-children'));
  
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
        
        // Trigger staggered children animations
        if (entry.target.classList.contains('stagger-children')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
          });
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== HOVER EFFECTS FOR INTERACTIVE ELEMENTS =====
  const interactiveCards = document.querySelectorAll('.glass-card, .product, .gcard');
  
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // ===== PARALLAX EFFECT FOR BACKGROUND ORBS =====
  function initParallax() {
    const orbs = document.querySelectorAll('.orb');
    const strength = 0.2;
    
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target')) || 100;
      const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      
      const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCounter();
          counterObserver.unobserve(counter);
        }
      }, { threshold: 0.5 });
      
      counterObserver.observe(counter);
    });
  }

  // ===== TEXT REVEAL ANIMATION =====
  function initTextReveal() {
    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    textRevealElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = text.split('').map(char => 
        `<span style="animation-delay: ${Math.random() * 0.5}s">${char}</span>`
      ).join('');
      
      const spans = element.querySelectorAll('span');
      spans.forEach(span => {
        span.style.opacity = '0';
        span.style.animation = 'fadeInUp 0.5s ease forwards';
      });
    });
  }

  // ===== CURSOR EFFECT =====
  function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // Add CSS for cursor
    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        mix-blend-mode: difference;
      }
      .custom-cursor.hovering {
        width: 40px;
        height: 40px;
        background: rgba(201, 162, 39, 0.2);
      }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    
    // Add hover effect
    const hoverElements = document.querySelectorAll('a, button, .glass-card, .product');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
      });
    });
  }

  // ===== SCROLL PROGRESS INDICATOR =====
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.appendChild(progressBar);
    
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--gold), var(--gold2));
        z-index: 1000;
        width: 0%;
        transition: width 0.1s ease;
      }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // ===== LAZY LOAD IMAGES WITH FADE IN =====
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('fade-in');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== INITIALIZE ALL ANIMATIONS =====
  function initAnimations() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initParallax();
      initCursorEffect();
      initScrollProgress();
      initTextReveal();
      initCounters();
      initLazyLoad();
    }
  }

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // ===== SHOPIFY BUY BUTTON (UNCHANGED) =====
  const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

  function loadShopify(cb){
    if (window.ShopifyBuy && window.ShopifyBuy.UI) return cb();
    const s = document.createElement('script');
    s.async = true;
    s.src = scriptURL;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function initShopify(){
    const client = window.ShopifyBuy.buildClient({
      domain: 'bm3rcp-p3.myshopify.com',
      storefrontAccessToken: 'e6ed311285d5b71c3057ed317f544f2d',
    });

    window.ShopifyBuy.UI.onReady(client).then((ui) => {
      // Shared cart component
      ui.createComponent('cart', {
        options: {
          cart: {
            popup: false,
            styles: {
              button: {
                'font-family': 'Roboto, sans-serif',
                'font-weight': 'bold',
                'background-color': '#c9a227',
                ':hover': {'background-color': '#b59223'},
                ':focus': {'background-color': '#b59223'},
                'border-radius': '26px'
              }
            },
            text: { total: 'Subtotal', button: 'Checkout' },
            contents: { note: true }
          },
          toggle: {
            styles: {
              toggle: {
                'font-family': 'Roboto, sans-serif',
                'font-weight': 'bold',
                'background-color': '#c9a227',
                ':hover': {'background-color': '#b59223'},
                ':focus': {'background-color': '#b59223'}
              },
              count: { 'font-size': '13px' }
            }
          },
          lineItem: {
            styles: {
              title: { color: '#000000' },
              variantTitle: { color: '#000000' },
              price: { color: '#000000' },
              quantityInput: { color: '#000000', 'border-color': '#000000' },
              quantityIncrement: { color: '#000000', 'border-color': '#000000' },
              quantityDecrement: { color: '#000000', 'border-color': '#000000' }
            }
          }
        }
      });

      const baseOptions = {
        product: {
          googleFonts: ['Roboto'],
          buttonDestination: 'cart',
          contents: {
            img: false,
            title: false,
            price: false,
            options: false
          },
          text: { button: 'Add to cart' },
          styles: {
            button: {
              'font-family': 'Roboto, sans-serif',
              'font-weight': 'bold',
              'font-size': '13px',
              'padding-top': '14.5px',
              'padding-bottom': '14.5px',
              'background-color': '#c9a227',
              ':hover': {'background-color': '#b59223'},
              ':focus': {'background-color': '#b59223'},
              'border-radius': '26px',
              'padding-left': '23px',
              'padding-right': '23px'
            }
          }
        },
        modalProduct: {
          contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
          googleFonts: ['Roboto'],
          styles: {
            button: {
              'font-family': 'Roboto, sans-serif',
              'font-weight': 'bold',
              'background-color': '#c9a227',
              ':hover': {'background-color': '#b59223'},
              ':focus': {'background-color': '#b59223'},
              'border-radius': '26px'
            }
          }
        }
      };

      const products = [
        { id: '10224601497889', node: document.getElementById('buy-12') },
        { id: '10224657858849', node: document.getElementById('buy-48') },
        { id: '10224743612705', node: document.getElementById('buy-24') }
      ];

      products.forEach((p) => {
        if (!p.node) return;
        ui.createComponent('product', {
          id: p.id,
          node: p.node,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: baseOptions
        });
      });
    });
  }

  loadShopify(initShopify);
})();
