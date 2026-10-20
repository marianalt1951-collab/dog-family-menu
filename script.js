// CONFIGURACIÓN DEL NÚMERO DE WHATSAPP (Código país + número)
const PHONE_NUMBER = "573019450827"; 

let cart = [];

// DESPLAZAMIENTO SUAVE A CATEGORÍAS
function scrollToCategory(id) {
    const section = document.getElementById(id);
    if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// AGREGAR PRODUCTO (ABRE EL PANEL DERECHO Y PERMITE SEGUIR PIDIENDO)
function addFromDOM(button) {
    const card = button.closest('.product-card');
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'));

    const item = cart.find(p => p.id === id);
    if(item) {
        item.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    renderCart();

    const drawer = document.getElementById('cart-drawer');
    if(!drawer.classList.contains('open')) {
        drawer.classList.add('open');
    }
}

// SUMAR / RESTAR CANTIDADES
function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
    }
    renderCart();
}

// VACIAR PEDIDO INSTANTÁNEAMENTE (SIN ALERTAS NI TEXTOS)
function clearCart() {
    cart = [];
    renderCart();
}

// ABRIR / CERRAR PANEL DERECHO
function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    
    if(open) {
        drawer.classList.add('open');
        overlay.classList.add('active');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
    }
}

// DIBUJAR LISTADO UNO DEBAJO DEL OTRO Y CÁLCULOS
function renderCart() {
    const drawerList = document.getElementById('drawer-cart-list');
    const deliverySelect = document.getElementById('delivery-zone');
    const deliveryFee = deliverySelect ? parseInt(deliverySelect.value) || 1000 : 1000;
    
    drawerList.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if(cart.length === 0) {
        drawerList.innerHTML = '<p style="text-align:center; color:#888; padding: 20px 0;">Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            totalItems += item.quantity;

            drawerList.innerHTML += `
                <div class="cart-item-row">
                    <div class="cart-item-details">
                        <strong>${item.name}</strong><br>
                        <small>$${item.price.toLocaleString()} c/u</small>
                    </div>
                    <div class="cart-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });
    }

    const totalFinal = subtotal + (cart.length > 0 ? deliveryFee : 0);

    // Actualizar Totales y Contadores
    document.getElementById('cart-count').innerText = totalItems;
    document.getElementById('bar-total').innerText = totalFinal.toLocaleString();
    document.getElementById('drawer-subtotal').innerText = subtotal.toLocaleString();
    document.getElementById('drawer-delivery').innerText = cart.length > 0 ? deliveryFee.toLocaleString() : '1.000';
    document.getElementById('drawer-total').innerText = totalFinal.toLocaleString();
}

// CARRUSEL
function startSlider() {
    const slides = document.getElementById('slider');
    if(!slides) return;
    let index = 0;
    setInterval(() => {
        index = (index + 1) % 3;
        slides.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
}

// ENVIAR MENSAJE A WHATSAPP
function sendWhatsApp() {
    if(cart.length === 0) {
        alert("Por favor agrega productos a tu pedido antes de enviar.");
        return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const payment = document.getElementById('payment-method').value;
    const deliveryFee = parseInt(document.getElementById('delivery-zone').value);

    if(!name || !phone || !address) {
        alert("Por favor completa tu nombre, teléfono y dirección de entrega.");
        return;
    }

    let subtotal = 0;
    let message = `*¡NUEVO PEDIDO - DOG FAMILY!* 🌭🍔\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *Teléfono Cliente:* ${phone}\n`;
    message += `📍 *Dirección:* ${address}\n`;
    message += `💳 *Método de Pago:* ${payment}\n\n`;
    message += `📝 *DETALLE DEL PEDIDO:*\n`;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.quantity}x ${item.name} - $${itemTotal.toLocaleString()}\n`;
    });

    const totalFinal = subtotal + deliveryFee;

    message += `\n💵 *Subtotal:* $${subtotal.toLocaleString()}`;
    message += `\n🛵 *Domicilio:* $${deliveryFee.toLocaleString()}`;
    message += `\n💰 *TOTAL A PAGAR:* $${totalFinal.toLocaleString()}\n\n`;
    message += `¡Quedo atento a la confirmación de mi pedido!`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

window.onload = () => {
    startSlider();
};