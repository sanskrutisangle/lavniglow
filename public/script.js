// Product Dataset 
const products = [
    { id: 1, name: "Vitamin C & Niacinamide Face Wash", category: "facewash", desc: "Removes tanning & makes skin glowing. Suitable for all skin types.", price: 499, image: "facewash.png" },
    { id: 2, name: "Hydrating Facial Sunscreen SPF 50", category: "sunscreen", desc: "Broad spectrum protection against UV rays with a non-greasy finish.", price: 699, image: "sunscreen.png" },
    { id: 3, name: "Deep Moisture Rich Moisturizer", category: "moisturizer", desc: "Intense hydration for dry and flaky skin barrier repair.", price: 549, image: "moisturizer.png" },
    { id: 4, name: "Active Serum (Salicylic, Kojic, Niacinamide & Vitamin C)", category: "serum", desc: "Multi-action serum for clear, glowing, and spotless skin.", price: 799, image: "serum.png" },
    { id: 5, name: "Organic Tinted Lip Balm", category: "lip", desc: "Nourishes chapped lips with natural butter and subtle tint.", price: 299, image: "lipbalm.png" },
    { id: 6, name: "Overnight Lip Mask", category: "lip", desc: "Represents and softens lips while you sleep.", price: 349, image: "lipmask.png" },
    { id: 7, name: "Silicone Scalp Massager", category: "hair", desc: "Promotes hair growth and scalp exfoliation.", price: 249, image: "scalpmassager.png" },
    { id: 8, name: "Wooden Hair Comb", category: "hair", desc: "Anti-static natural wood comb for smooth hair detangling.", price: 199, image: "woodcomb.png" },
    { id: 9, name: "Anti-Hair Fall & Dandruff Shampoo", category: "hair", desc: "Strengthens roots, clears dandruff and removes dryness.", price: 599, image: "shampoo.png" },
    { id: 10, name: "Smoothing & Shine Hair Conditioner", category: "hair", desc: "Deep conditioning formula for glossy, smooth hair.", price: 549, image: "conditioner.png" }
];

// Cart & Wishlist Local Storage handlers 
let cart = JSON.parse(localStorage.getItem('lavni_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('lavni_wishlist')) || [];

function updateBadgeCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    if (cartCount) cartCount.innerText = cart.length;
    if (wishlistCount) wishlistCount.innerText = wishlist.length;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1 });
    }
    localStorage.setItem('lavni_cart', JSON.stringify(cart));
    updateBadgeCounts();
    alert('Product added to cart!');
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('lavni_wishlist', JSON.stringify(wishlist));
        updateBadgeCounts();
        alert('Product added to wishlist!');
    } else {
        alert('Product already in wishlist!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateBadgeCounts();

    // Check logged-in user state in Navbar 
    const user = JSON.parse(localStorage.getItem('lavni_user'));
    const userNav = document.getElementById('user-nav');
    if (user && userNav) {
        userNav.innerHTML = `<span class="nav-link text-dark fw-bold">Hello, ${user.name}</span> <a class="nav-link text-danger d-inline" href="#" onclick="logout()">Logout</a>`;
    }
});

function logout() {
    localStorage.removeItem('lavni_user');
    window.location.reload();
}