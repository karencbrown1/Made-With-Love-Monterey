// ============================================================
//  CAROUSEL
// ============================================================
let currentSlide = 0;
const totalSlides = 5;
function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  const track = document.getElementById('carousel-track');
  
  if ((direction === 1 && currentSlide === 0) || (direction === -1 && currentSlide === totalSlides - 1)) {
    track.style.transition = 'none';
  } else {
    track.style.transition = 'transform .4s ease';
  }
  
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  document.getElementById('carousel-track').style.transform = `translateX(-${currentSlide * 20}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function initCarousel() {
  const dotsContainer = document.getElementById('carousel-dots');
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
  // Auto-advance every 4 seconds
  setInterval(() => moveCarousel(1), 4000);
}

initCarousel();

// ============================================================
//  PRODUCTS
//  Replace these with your real items, prices, and Square IDs
// ============================================================
const PRODUCTS = [
  {
    id: "prod_1",
    name: "Golden Hour Print",
    desc: "Limited edition 8×10 giclée print. Warm tones, hand-signed.",
    price: 45,
    emoji: "🌅",
    bg: "#FFF3DC",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",  // add when ready
  },
  {
    id: "prod_2",
    name: "Teal Study No. 3",
    desc: "Original 5×7 acrylic on canvas board. One of a kind.",
    price: 120,
    emoji: "🎨",
    bg: "#D9F0EE",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",
  },
  {
    id: "prod_3",
    name: "Coral Bloom Card Set",
    desc: "Set of 6 blank greeting cards with envelopes.",
    price: 18,
    emoji: "💌",
    bg: "#FDEBD0",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",
  },
  {
    id: "prod_4",
    name: "Midnight Garden",
    desc: "Original 11×14 mixed media on watercolor paper.",
    price: 280,
    emoji: "🌿",
    bg: "#EAF0E8",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",
  },
  {
    id: "prod_5",
    name: "Sun & Shadow Zine",
    desc: "Hand-assembled 20-page art zine. Risograph printed.",
    price: 22,
    emoji: "📓",
    bg: "#FFF3DC",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",
  },
  {
    id: "prod_6",
    name: "Amber Wave Study",
    desc: "5×5 original gouache painting, framed in natural wood.",
    price: 95,
    emoji: "🪞",
    bg: "#FEF4E4",
    // squareItemId: "YOUR_SQUARE_ITEM_ID",
  },
];

// ============================================================
//  SQUARE CONFIGURATION
//  1. Sign up at https://squareup.com/us/en/online-store
//  2. Get your Application ID from developer.squareup.com
//  3. Replace the placeholder below
// ============================================================
const SQUARE_APP_ID    = "YOUR_SQUARE_APP_ID";       // e.g. "sq0idp-..."
const SQUARE_LOCATION  = "YOUR_SQUARE_LOCATION_ID";  // from Square dashboard
const SQUARE_ENV       = "sandbox";                  // change to "production" when live

// ============================================================
//  CART STATE
// ============================================================
let cart = [];

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ============================================================
//  RENDER PRODUCTS
// ============================================================
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <div class="product-img" style="background:${p.bg}">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-bottom">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ============================================================
//  CART LOGIC
// ============================================================
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count    = cart.reduce((s, i) => s + i.qty, 0);
  const total    = getTotal();
  const itemsEl  = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  const totalEl  = document.getElementById("cart-total");
  const countEl  = document.getElementById("cart-count");

  countEl.textContent = count;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    footerEl.style.display = "none";
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-icon">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name} ${item.qty > 1 ? `× ${item.qty}` : ""}</div>
        <div class="ci-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join("");

  totalEl.textContent = `$${total.toFixed(2)}`;
  footerEl.style.display = "block";
}

// ============================================================
//  CART DRAWER
// ============================================================
function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("open");
}

// ============================================================
//  SQUARE CHECKOUT
//  This uses Square's Web Payments SDK.
//  Full setup guide: https://developer.squareup.com/docs/web-payments/overview
//
//  For a simpler start, you can also use Square Online's
//  built-in "Buy Now" buttons — no code needed:
//  https://squareup.com/us/en/online-store
// ============================================================
function checkout() {
  if (cart.length === 0) return;

  // Option A: Direct to Square Online store (easiest, no extra code)
  // Uncomment and replace with your Square Online URL:
  // window.location.href = "https://your-store.square.site";

  // Option B: Square Web Payments SDK (more control)
  // Requires loading the Square JS SDK and setting up a payment form.
  // See: https://developer.squareup.com/docs/web-payments/take-card-payment
  // The cart items would be sent to your backend to create an order via the Square Orders API.

  alert(
    `Ready to connect Square!\n\n` +
    `Steps:\n` +
    `1. Go to developer.squareup.com\n` +
    `2. Create an app and get your App ID + Location ID\n` +
    `3. Replace SQUARE_APP_ID and SQUARE_LOCATION in app.js\n` +
    `4. Follow the Square Web Payments SDK guide\n\n` +
    `Cart total: $${getTotal().toFixed(2)}`
  );
}

// ============================================================
//  CONTACT FORM
// ============================================================
function handleContact(e) {
  e.preventDefault();
  document.getElementById("contact-msg").textContent =
    "Thanks! I'll be in touch soon. ✦";
  e.target.reset();
}

// ============================================================
//  INIT
// ============================================================
renderProducts();
updateCartUI();
