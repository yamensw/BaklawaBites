(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal-on-scroll
  const els = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  // Shopify Buy Button (Option B: add-to-cart + cart toggle)
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
