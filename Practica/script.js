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
    cart.push({ id, name, price });
    cartTotal += price;
    updateCart();
    showNotification(`${name} añadido al carrito`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    cartCount.textContent = cart.length;
    cartTotalElement.textContent = cartTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Producto eliminado del carrito');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
const cartModal = document.querySelector('.cart-modal');

cartIcon.addEventListener('click', () => {
    cartModal.classList.toggle('active');
});

// Cerrar carrito al hacer click fuera
document.addEventListener('click', (e) => {
    if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
        cartModal.classList.remove('active');
    }
}); 