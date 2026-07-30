/**
 * RUDRA GOLD - Main Interaction Script
 * Integrates Lenis Smooth Scroll, GSAP ScrollTrigger, Custom Cursor, Canvas Sparkles,
 * Ajax Cart Drawer, Variant Selector Price Breakup, Gold Rate Ticker, and Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCanvasSparkles();
  initHeaderScroll();
  initGoldRateTicker();
  initAjaxCart();
  initModals();
  initQuickView();
  initWishlist();
  initVariantPriceBreakdown();
  initCollectionFilters();
  initMobileMenu();
  triggerHeroAnimations();
});

/* 2. LENIS SMOOTH SCROLL */
let lenisInst;
function initLenis() {
  if (typeof Lenis === 'undefined') {
    setTimeout(initLenis, 100);
    return;
  }
  
  lenisInst = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0
  });

  function raf(time) {
    lenisInst.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Link Lenis to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenisInst.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInst.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* 4. CANVAS GOLD SPARKLES */
function initCanvasSparkles() {
  const canvas = document.getElementById('sparkleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute vertically at start
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = Math.random() * 2.2 + 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.speedX = Math.random() * 0.4 - 0.2;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Floating wave animation
      this.speedX += Math.sin(this.y * 0.05) * 0.01;

      if (this.y < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      
      // Golden glowing shadow
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = '#D4AF37';
      
      // Soft radial gradient circle
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, '#F3E5AB');
      grad.addColorStop(1, '#D4AF37');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* 5. GSAP HERO ANIMATIONS */
function triggerHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline();
  
  // Hero section entry sequence
  tl.fromTo('.hero-subtitle', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  .fromTo('.hero-title-line', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
    '-=0.7'
  )
  .fromTo('.hero-description', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    '-=0.8'
  )
  .fromTo('.hero-actions .btn-primary, .hero-actions .btn-secondary', 
    { opacity: 0, y: 15 }, 
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
    '-=0.8'
  );

  // Parallax Hero Background Image scrolling
  if (document.querySelector('.hero-parallax-bg')) {
    gsap.to('.hero-parallax-bg', {
      scrollTrigger: {
        trigger: '.hero-banner',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      yPercent: 15,
      ease: 'none'
    });
  }

  // Scroll Triggered Text Reveals & Pin Animations
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Tilt Card Interactive Animation
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees tilt
      const rotateY = ((x - centerX) / centerX) * 8;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.4
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.6
      });
    });
  });
}

/* 6. HEADER STATE & TRANSPARENCY */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* 7. LIVE GOLD RATE TICKER */
// Mock live rate starting values (in INR per gram)
let currentGold22K = 6850;
let currentGold18K = 5605;

function initGoldRateTicker() {
  const tickerItems = document.querySelectorAll('.gold-rate-ticker-value');
  if (tickerItems.length === 0) return;

  // Simple animation loop updating gold price fluctuations every 12 seconds
  setInterval(() => {
    const changePercent = (Math.random() * 0.4 - 0.2) / 100; // ±0.2% fluctuation
    currentGold22K = Math.round(currentGold22K * (1 + changePercent));
    currentGold18K = Math.round(currentGold18K * (1 + changePercent));
    
    // Update ticker displays
    tickerItems.forEach(el => {
      if (el.dataset.purity === '22k') {
        el.textContent = `₹${currentGold22K.toLocaleString('en-IN')}/g`;
      } else if (el.dataset.purity === '18k') {
        el.textContent = `₹${currentGold18K.toLocaleString('en-IN')}/g`;
      }
    });

    // Update PDP pricing breakdown if active
    const activePDP = document.querySelector('[data-purity-selector]');
    if (activePDP) {
      calculateVariantPricing();
    }
  }, 12000);
}

/* 8. AJAX CART DRAWER SYSTEM */
let cartData = {
  items: [],
  total_price: 0,
  item_count: 0
};

// Fallback to local storage for persistence of mock cart
function loadMockCartFromLocalStorage() {
  const stored = localStorage.getItem('rudra_gold_mock_cart');
  if (stored) {
    try {
      cartData = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse mock cart from local storage:", e);
    }
  }
}

function saveMockCartToLocalStorage() {
  localStorage.setItem('rudra_gold_mock_cart', JSON.stringify(cartData));
}

// Fetch Cart from Shopify API with local storage fallback
async function fetchCart() {
  try {
    const res = await fetch('/cart.js');
    if (!res.ok) throw new Error('Not Shopify environment');
    const data = await res.json();
    
    // Map Shopify Cart data to our cartData structure
    cartData.item_count = data.item_count;
    cartData.total_price = data.total_price / 100;
    cartData.items = data.items.map(item => ({
      key: item.key,
      id: item.variant_id,
      title: item.product_title,
      price: item.price / 100,
      img: item.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80',
      purity: item.variant_title || '22K Gold',
      quantity: item.quantity
    }));
    
    updateCartDrawerUI();
  } catch (err) {
    console.warn("Shopify Cart API failed, using mock cart with localStorage persistence:", err);
    loadMockCartFromLocalStorage();
    updateCartDrawerUI();
  }
}

async function addAjaxCartItem(title, price, img, purity = '22K Gold', variantId = '') {
  // If we have a valid variant ID and are in a real Shopify context
  if (variantId && !isNaN(variantId) && variantId !== '') {
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId), quantity: 1 })
      });
      if (res.ok) {
        await fetchCart();
        openCartDrawer();
        return;
      }
    } catch (err) {
      console.error("Real Add to Cart failed, falling back to mock:", err);
    }
  }

  // Fallback Mock Add
  const existingItemIndex = cartData.items.findIndex(item => item.title === title && item.purity === purity);
  if (existingItemIndex > -1) {
    cartData.items[existingItemIndex].quantity += 1;
  } else {
    cartData.items.push({
      title: title,
      price: price,
      img: img || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80',
      purity: purity,
      quantity: 1,
      id: variantId || ''
    });
  }

  saveMockCartToLocalStorage();
  updateCartDrawerUI();
  openCartDrawer();
}

async function adjustCartQuantity(index, action) {
  const item = cartData.items[index];
  
  if (item && item.key) {
    // Real Shopify cart change
    try {
      const newQty = action === 'plus' ? item.quantity + 1 : item.quantity - 1;
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.key, quantity: newQty })
      });
      if (res.ok) {
        await fetchCart();
        return;
      }
    } catch (err) {
      console.error("Real Adjust Qty failed, falling back to mock:", err);
    }
  }

  // Fallback Mock Adjust
  if (action === 'plus') {
    cartData.items[index].quantity += 1;
  } else if (action === 'minus') {
    cartData.items[index].quantity -= 1;
    if (cartData.items[index].quantity <= 0) {
      cartData.items.splice(index, 1);
    }
  }
  saveMockCartToLocalStorage();
  updateCartDrawerUI();
}

async function removeCartItem(index) {
  const item = cartData.items[index];
  
  if (item && item.key) {
    // Real Shopify cart remove
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.key, quantity: 0 })
      });
      if (res.ok) {
        await fetchCart();
        return;
      }
    } catch (err) {
      console.error("Real Remove failed, falling back to mock:", err);
    }
  }

  // Fallback Mock Remove
  cartData.items.splice(index, 1);
  saveMockCartToLocalStorage();
  updateCartDrawerUI();
}

function initAjaxCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  const openButtons = document.querySelectorAll('[data-cart-drawer-trigger], #mobileCartTrigger');
  const closeButtons = document.querySelectorAll('.cart-drawer-close-btn, #cartDrawerOverlay');

  if (!drawer) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeCartDrawer);
  });

  // Engraving option checkbox slide-down
  const engravingCheckbox = document.getElementById('laserEngravingCheck');
  const engravingTextarea = document.getElementById('laserEngravingText');
  if (engravingCheckbox && engravingTextarea) {
    engravingCheckbox.addEventListener('change', () => {
      if (engravingCheckbox.checked) {
        engravingTextarea.style.display = 'block';
      } else {
        engravingTextarea.style.display = 'none';
        engravingTextarea.value = '';
      }
    });
  }

  // Handle quantity adjustments & removals in Cart
  drawer.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-btn')) {
      const action = e.target.dataset.action;
      const index = parseInt(e.target.dataset.index);
      adjustCartQuantity(index, action);
    } else if (e.target.classList.contains('cart-drawer-item-remove')) {
      const index = parseInt(e.target.dataset.index);
      removeCartItem(index);
    } else if (e.target.classList.contains('drawer-upsell-add-btn')) {
      const title = e.target.dataset.title;
      const price = parseInt(e.target.dataset.price);
      const img = e.target.dataset.img;
      const variantId = e.target.dataset.variantId || '';
      addAjaxCartItem(title, price, img, '22K Gold', variantId);
    }
  });

  // Expose function globally for quick buy triggers
  window.addToCartAjax = function(title, price, img, purity = '22K Gold', variantId = '') {
    addAjaxCartItem(title, price, img, purity, variantId);
  };

  // Fetch initial cart data on load
  fetchCart();
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    if (lenisInst) lenisInst.stop(); // Lock page scroll
    trapFocus(drawer);
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    if (lenisInst) lenisInst.start(); // Unlock scroll
  }
}

function updateCartDrawerUI() {
  const container = document.getElementById('cartDrawerItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const totalEl = document.getElementById('cartTotalAmount');
  const cartBadges = document.querySelectorAll('.cart-count-badge');
  const emptyState = document.getElementById('cartDrawerEmptyState');
  const normalState = document.getElementById('cartDrawerFilledState');

  let totalCount = 0;
  let subtotal = 0;

  if (!container) return;
  container.innerHTML = '';

  if (cartData.items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (normalState) normalState.style.display = 'none';
    cartBadges.forEach(b => b.textContent = '0');
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (normalState) normalState.style.display = 'block';

  cartData.items.forEach((item, index) => {
    totalCount += item.quantity;
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemHTML = `
      <div class="cart-drawer-item">
        <img class="cart-drawer-item-img" src="${item.img}" alt="${item.title}">
        <div class="cart-drawer-item-details">
          <h4 class="cart-drawer-item-title">${item.title}</h4>
          <p class="cart-drawer-item-variant">${item.purity}</p>
          <div class="cart-drawer-item-meta">
            <div class="qty-selector">
              <span class="qty-btn" data-action="minus" data-index="${index}">&minus;</span>
              <span class="qty-val">${item.quantity}</span>
              <span class="qty-btn" data-action="plus" data-index="${index}">&plus;</span>
            </div>
            <span class="cart-drawer-item-price">₹${itemTotal.toLocaleString('en-IN')}</span>
          </div>
          <span class="cart-drawer-item-remove" data-index="${index}">Remove</span>
        </div>
      </div>
    `;
    container.innerHTML += itemHTML;
  });

  // Calculate Shipping Progress ($15,000 INR limit for free shipping)
  const freeShippingThreshold = 150000; // Rs. 1.5 Lakhs
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const progressBar = document.getElementById('shippingProgressBarFill');
  const progressText = document.getElementById('shippingProgressText');
  
  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (progressText) {
    if (subtotal >= freeShippingThreshold) {
      progressText.innerHTML = `Congratulations! You qualify for <span>Free Insured Delivery & Premium Velvet Packaging</span>.`;
    } else {
      const remaining = freeShippingThreshold - subtotal;
      progressText.innerHTML = `Add <span>₹${remaining.toLocaleString('en-IN')}</span> more to qualify for <span>Free Insured Delivery</span>.`;
    }
  }

  // Update prices
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  
  cartBadges.forEach(b => b.textContent = totalCount);
}

/* 9. MODALS (VIP BOOKING & TRUST BADGES) */
function initModals() {
  const modal = document.getElementById('luxuryModal');
  const overlay = document.getElementById('luxuryModalOverlay');
  const close = document.getElementById('luxuryModalClose');
  const content = document.getElementById('luxuryModalContent');

  if (!modal || !content) return;

  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Bind clicks for VIP trial & certificate modals
  document.querySelectorAll('[data-modal-type]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.dataset.modalType;
      populateAndOpenModal(type);
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    if (lenisInst) lenisInst.start();
  }

  function populateAndOpenModal(type) {
    if (type === 'vip-visit') {
      content.innerHTML = `
        <h2 style="font-family: var(--font-serif); margin-bottom: 15px; color: var(--color-dark); text-align: center; text-transform: uppercase;">Book a VIP Store Visit</h2>
        <p style="font-size: 13px; color: var(--color-text-muted); text-align: center; margin-bottom: 25px;">Experience the finest custom curation with a dedicated jewelry concierge at our boutique.</p>
        <form style="display: flex; flex-direction: column; gap: 15px;" onsubmit="event.preventDefault(); alert('VIP Curation Booking Request Sent! A dedicated concierge will reach you shortly.'); document.getElementById('luxuryModalClose').click();">
          <input type="text" placeholder="Full Name" style="width: 100%; border: 1px solid var(--color-gray-border); padding: 12px; font-size: 13px; background: #FFF;" required>
          <input type="email" placeholder="Email Address" style="width: 100%; border: 1px solid var(--color-gray-border); padding: 12px; font-size: 13px; background: #FFF;" required>
          <input type="tel" placeholder="Mobile Number" style="width: 100%; border: 1px solid var(--color-gray-border); padding: 12px; font-size: 13px; background: #FFF;" required>
          <select style="width: 100%; border: 1px solid var(--color-gray-border); padding: 12px; font-size: 13px; background: #FFF;" required>
            <option value="">Preferred Location</option>
            <option value="mumbai">Flagship Boutique - Mumbai Colaba</option>
            <option value="delhi">Signature Studio - Delhi Chanakyapuri</option>
            <option value="home">VIP Home Trial Curation</option>
          </select>
          <input type="submit" value="Schedule Curation Appointment" class="btn-primary" style="margin-top: 10px; width: 100%;">
        </form>
      `;
    } else if (type === 'hallmark') {
      content.innerHTML = `
        <h2 style="font-family: var(--font-serif); margin-bottom: 15px; color: var(--color-dark); text-align: center; text-transform: uppercase;">BIS Hallmark Transparency</h2>
        <div style="display: flex; flex-direction: column; gap: 20px; align-items: center; margin-bottom: 15px;">
          <div style="border: 1px solid var(--color-gold); padding: 15px; background: #FFF; width: 100%; text-align: center;">
            <p style="font-size: 14px; font-weight: 600; color: var(--color-gold); margin-bottom: 10px;">916 Pure Certified Gold</p>
            <p style="font-size: 12px; color: var(--color-text-muted);">Every piece of gold jewellery crafted by Rudra Gold bears the unique BIS Hallmark. You can verify the authentic purity mark containing: BIS Logo, Purity grade (e.g. 22K916) and a unique HUID code using the BIS Care App.</p>
          </div>
          <div style="border: 1px solid var(--color-gold); padding: 15px; background: #FFF; width: 100%; text-align: center;">
            <p style="font-size: 14px; font-weight: 600; color: var(--color-gold); margin-bottom: 10px;">GIA & IGI Diamond Certification</p>
            <p style="font-size: 12px; color: var(--color-text-muted);">All our diamonds are 100% natural, ethical, and carry individual authentication certificates detailing Cut, Color, Clarity, and Carat metrics.</p>
          </div>
        </div>
      `;
    } else if (type === 'size-guide') {
      content.innerHTML = `
        <h2 style="font-family: var(--font-serif); margin-bottom: 15px; color: var(--color-dark); text-align: center; text-transform: uppercase;">Rings & Bangles Size Guide</h2>
        <p style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 20px; text-align: center;">Choose the correct fitting diameter according to standard Indian sizing.</p>
        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1.5px solid var(--color-gold); font-weight: 600;">
              <th style="padding: 10px 0;">Indian Ring Size</th>
              <th>Inside Circumference (mm)</th>
              <th>Inside Diameter (mm)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--color-gray-border);">
              <td style="padding: 8px 0; font-weight: 500;">9</td>
              <td>49.2</td>
              <td>15.7</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-gray-border);">
              <td style="padding: 8px 0; font-weight: 500;">12</td>
              <td>51.8</td>
              <td>16.5</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-gray-border);">
              <td style="padding: 8px 0; font-weight: 500;">14</td>
              <td>54.4</td>
              <td>17.3</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-gray-border);">
              <td style="padding: 8px 0; font-weight: 500;">17</td>
              <td>56.9</td>
              <td>18.1</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    modal.classList.add('active');
    if (lenisInst) lenisInst.stop();
    trapFocus(modal);
  }
}

/* 10. AJAX QUICK VIEW */
function initQuickView() {
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const close = document.getElementById('quickViewClose');
  const content = document.getElementById('quickViewContent');

  if (!modal || !content) return;

  close.addEventListener('click', () => {
    modal.classList.remove('active');
    if (lenisInst) lenisInst.start();
  });
  overlay.addEventListener('click', () => {
    modal.classList.remove('active');
    if (lenisInst) lenisInst.start();
  });

  window.triggerQuickView = function(title, price, img, desc = '', variantId = '') {
    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; align-items: center;">
        <div style="background-color: var(--color-cream); border: 1px solid var(--color-gray-border);">
          <img src="${img}" alt="${title}" style="width: 100%; height: auto; object-fit: cover;">
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gold); display: block; margin-bottom: 8px;">Bestseller Collection</span>
          <h2 style="font-family: var(--font-serif); font-size: 26px; color: var(--color-dark); margin-bottom: 12px;">${title}</h2>
          <p style="font-size: 18px; font-weight: 600; color: var(--color-dark); margin-bottom: 15px;">₹${price.toLocaleString('en-IN')}</p>
          <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 25px;">${desc || 'Handcrafted meticulously by our master artisans in 22 Karat gold featuring brilliant cut VS1 ethical diamonds. Inspired by royal Indian heritage.'}</p>
          
          <button class="btn-primary" style="width: 100%;" onclick="addToCartAjax('${title}', ${price}, '${img}', '22K Gold', '${variantId}'); document.getElementById('quickViewClose').click();">
            Add to Curation Bag
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
    if (lenisInst) lenisInst.stop();
    trapFocus(modal);
  };
}

/* 11. WISHLIST SYSTEM */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('rudra_gold_wishlist') || '[]'); }
  catch { return []; }
}

function saveWishlist(items) {
  localStorage.setItem('rudra_gold_wishlist', JSON.stringify(items));
  document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = items.length);
}

function initWishlist() {
  const wishlistTriggers = document.querySelectorAll('.wishlist-btn');

  // Restore active state from localStorage
  const saved = getWishlist();
  wishlistTriggers.forEach(btn => {
    const title = btn.dataset.title;
    if (title && saved.find(i => i.title === title)) {
      btn.classList.add('active');
    }
  });

  // Sync counter on load
  document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = saved.length);

  wishlistTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.dataset.title || 'Rudra Gold Piece';
      const price = btn.dataset.price || '0';
      const rawPrice = parseInt(btn.dataset.rawPrice || btn.dataset.price || '0');
      const img = btn.dataset.img || '';

      let items = getWishlist();
      const existingIndex = items.findIndex(i => i.title === title);

      if (existingIndex > -1) {
        items.splice(existingIndex, 1);
        btn.classList.remove('active');
      } else {
        items.push({ title, price, rawPrice, img });
        btn.classList.add('active');
      }

      saveWishlist(items);
    });
  });
}

/* 12. VARIANT SELECTOR & PDP PRICE BREAKDOWN ACCORDIONS */
function initVariantPriceBreakdown() {
  const puritySelector = document.querySelector('[data-purity-selector]');
  if (!puritySelector) return;

  puritySelector.addEventListener('change', calculateVariantPricing);
  
  // Custom Making Charges or Weight inputs recalculation
  const weightInput = document.getElementById('pdpMetalWeight');
  if (weightInput) {
    weightInput.addEventListener('input', calculateVariantPricing);
  }

  // Trigger initial calculation on load
  calculateVariantPricing();
}

function calculateVariantPricing() {
  const puritySel = document.querySelector('[data-purity-selector]');
  const weightValEl = document.getElementById('pdpMetalWeight');
  const priceDisplayEl = document.getElementById('pdpPriceDisplay');

  // Breakdown values
  const breakupGoldRate = document.getElementById('breakupGoldRate');
  const breakupMetalPrice = document.getElementById('breakupMetalPrice');
  const breakupMaking = document.getElementById('breakupMaking');
  const breakupGst = document.getElementById('breakupGst');
  const breakupTotal = document.getElementById('breakupTotal');

  if (!puritySel || !priceDisplayEl) return;

  const purity = puritySel.value; // '22k' or '18k'
  const weight = parseFloat(weightValEl ? weightValEl.textContent : 10); // grams default

  // Base live price per gram
  const goldRate = purity === '18k' ? currentGold18K : currentGold22K;

  // Pricing calculations
  const metalPrice = Math.round(weight * goldRate);
  const makingCharges = Math.round(metalPrice * 0.12); // 12% making charges
  const subtotal = metalPrice + makingCharges;
  const gst = Math.round(subtotal * 0.03); // 3% jewelry GST
  const finalPrice = subtotal + gst;

  // Update Main Price Display
  priceDisplayEl.textContent = `₹${finalPrice.toLocaleString('en-IN')}`;

  // Update Breakdown Accordion Table
  if (breakupGoldRate) breakupGoldRate.textContent = `₹${goldRate.toLocaleString('en-IN')}/g`;
  if (breakupMetalPrice) breakupMetalPrice.textContent = `₹${metalPrice.toLocaleString('en-IN')}`;
  if (breakupMaking) breakupMaking.textContent = `₹${makingCharges.toLocaleString('en-IN')}`;
  if (breakupGst) breakupGst.textContent = `₹${gst.toLocaleString('en-IN')}`;
  if (breakupTotal) breakupTotal.textContent = `₹${finalPrice.toLocaleString('en-IN')}`;
  
  // Set variant image context values for Quick Add
  const addBtn = document.getElementById('pdpAddToCartBtn');
  if (addBtn) {
    addBtn.setAttribute('onclick', `addToCartAjax('Rudra Royal Signature Necklace', ${finalPrice}, '', '${purity.toUpperCase()} Gold, ${weight}g')`);
  }
}

/* 13. COLLECTION TEMPLATE AJAX FILTERS & GRID SWITCHER */
function initCollectionFilters() {
  const gridSwitchers = document.querySelectorAll('.grid-switcher-btn');
  const productGrid = document.getElementById('collectionProductGrid');

  if (!productGrid) return;

  gridSwitchers.forEach(btn => {
    btn.addEventListener('click', () => {
      gridSwitchers.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const cols = btn.dataset.columns; // 2, 3, 4
      
      productGrid.className = 'collection-grid'; // Reset classes
      productGrid.classList.add(`cols-${cols}`);
    });
  });

  // Fast Ajax Filtering Sim hook
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
  filterCheckboxes.forEach(box => {
    box.addEventListener('change', () => {
      // Simulate fast loader
      productGrid.style.opacity = '0.4';
      setTimeout(() => {
        productGrid.style.opacity = '1';
      }, 350);
    });
  });
}

/* 14. MOBILE NAVIGATION DRAWER */
function initMobileMenu() {
  const trigger = document.getElementById('mobileMenuTrigger');
  const drawer = document.getElementById('mobileMenuDrawer');
  const closeBtn = document.getElementById('mobileMenuClose');
  const overlay = document.getElementById('mobileMenuOverlay');

  if (!trigger || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenisInst) lenisInst.stop();
    trapFocus(drawer);
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lenisInst) lenisInst.start();
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Handle collapsible submenus
  const submenuToggle = document.getElementById('mobileCollectionsToggle');
  if (submenuToggle) {
    submenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
      submenuToggle.setAttribute('aria-expanded', !isExpanded);
      submenuToggle.classList.toggle('active');
      
      const submenu = submenuToggle.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle('active');
      }
    });
  }
}

// Accessibility focus trap helper
function trapFocus(element) {
  if (!element) return;
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (!firstFocusable) return;

  // Set focus on first element
  setTimeout(() => firstFocusable.focus(), 120);

  // Remove existing listeners if any, by cloning and replacing (simple approach or handle keydown)
  const keyHandler = function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.removeEventListener('keydown', element._trapKeyHandler);
  element._trapKeyHandler = keyHandler;
  element.addEventListener('keydown', keyHandler);
}
