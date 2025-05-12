// Carrusel automático
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;

function nextSlide() {
    currentSlide = currentSlide % totalSlides + 1;
    document.getElementById(`slide${currentSlide}`).checked = true;
}

function prevSlide() {
    currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    document.getElementById(`slide${currentSlide}`).checked = true;
}

// Configurar los botones de flecha
document.querySelector('.arrow.left').addEventListener('click', (e) => {
    e.preventDefault();
    prevSlide();
});

document.querySelector('.arrow.right').addEventListener('click', (e) => {
    e.preventDefault();
    nextSlide();
});

// Configurar el cambio automático
setInterval(nextSlide, 5000);

// Filtro de búsqueda
const searchInput = document.getElementById('searchInput');
const watchItems = document.querySelectorAll('.item');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    watchItems.forEach(item => {
        const watchName = item.querySelector('h3').textContent.toLowerCase();
        const watchDescription = item.querySelector('p').textContent.toLowerCase();
        
        if (watchName.includes(searchTerm) || watchDescription.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Carrito de compras
let cart = [];
let cartTotal = 0;

function formatPrice(price) {
    return price.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' €';
}

function addToCart(id, name, price) {
    const found = cart.find(item => item.id === id);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCart();
    showNotification(`${name} añadido al carrito`);
    animateCartCount();
}

function increaseQty(id) {
    const found = cart.find(item => item.id === id);
    if (found) {
        found.qty += 1;
        updateCart();
    }
}

function decreaseQty(id) {
    const found = cart.find(item => item.id === id);
    if (found && found.qty > 1) {
        found.qty -= 1;
    } else {
        removeFromCart(id);
        return;
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Producto eliminado del carrito');
}

function animateCartCount() {
    const cartCount = document.getElementById('cartCount');
    cartCount.classList.remove('animated');
    void cartCount.offsetWidth; // trigger reflow
    cartCount.classList.add('animated');
}

// Sincronizar contador del botón flotante
function updateFabCartCount() {
    const fabCartCount = document.getElementById('fabCartCount');
    if (fabCartCount) {
        fabCartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
    }
}

// Mostrar/ocultar modal desde el botón flotante
const fabCartBtn = document.getElementById('fabCartBtn');
const cartModal = document.querySelector('.cart-modal');

function toggleFabCart(show) {
    const fabCart = document.getElementById('fabCartBtn');
    if (fabCart) {
        fabCart.style.display = show ? 'flex' : 'none';
    }
}

if (fabCartBtn) {
    fabCartBtn.addEventListener('click', () => {
        cartModal.classList.toggle('active');
        toggleFabCart(!cartModal.classList.contains('active'));
    });
}

// Vaciar carrito
const emptyCartBtn = document.getElementById('emptyCartBtn');
if (emptyCartBtn) {
    emptyCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
        showNotification('Carrito vaciado', 'fa-trash');
    });
}

// Mejorar notificación con icono
function showNotification(message, icon = 'fa-check') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modificar updateCart para sincronizar ambos contadores
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    cartTotal = 0;
    cartItems.innerHTML = '';
    cart.forEach(item => {
        cartTotal += item.price * item.qty;
        cartItems.innerHTML += `
        <div class="cart-item">
            <img src="img/reloj${item.id}.png" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.qty}</div>
                <div class="cart-item-controls">
                    <button class="cart-item-btn" onclick="decreaseQty(${item.id})">-</button>
                    <span>${item.qty}</span>
                    <button class="cart-item-btn" onclick="increaseQty(${item.id})">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`;
    });
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalQty;
    cartTotalElement.textContent = cartTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    updateFabCartCount();
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }
    
    alert('¡Gracias por tu compra! Total: ' + cartTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
    cart = [];
    cartTotal = 0;
    updateCart();
}

// Filtro de categorías
const categoryButtons = document.querySelectorAll('.category-btn');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Añadir clase active al botón clickeado
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        // Filtrar los items
        watchItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Animación suave al hacer scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Validación del formulario de contacto
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', data);
    showNotification('Mensaje enviado correctamente');
    contactForm.reset();
});

// Carrito modal
const cartIcon = document.querySelector('.cart-icon');

// Botón cerrar carrito
const cartCloseBtn = document.getElementById('cartCloseBtn');
if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
        toggleFabCart(true);
    });
}

// Cerrar carrito solo si el click es fuera del modal y no en controles internos
document.addEventListener('mousedown', (e) => {
    if (
        cartModal.classList.contains('active') &&
        !cartModal.contains(e.target) &&
        !cartIcon.contains(e.target) &&
        !(fabCartBtn && fabCartBtn.contains(e.target))
    ) {
        cartModal.classList.remove('active');
        toggleFabCart(true);
    }
});

// Asegurar que el botón flotante esté visible al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    toggleFabCart(true);
});

// Botón de pagar funcional
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        checkout();
    });
} 