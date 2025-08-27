document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, name: 'Laptop', price: 999.99 },
        { id: 2, name: 'Smartphone', price: 499.99 },
        { id: 3, name: 'Tablet', price: 299.99 },
        { id: 4, name: 'Headphones', price: 199.99 },
        { id: 5, name: 'Smartwatch', price: 149.99 },
        { id: 6, name: 'Camera', price: 599.99 },
        { id: 7, name: 'Printer', price: 89.99 },
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartTotalMessage = document.getElementById('cart-summary');
    const totalPriceDisplay = document.getElementById('total-price');
    const checkOutButton = document.getElementById('checkout-btn');

    renderCart();

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
        <div>
            <p class="name">${product.name}</p>
            <p class="p-price">$${product.price.toFixed(2)}</p>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</butto>
        `
        productDiv.classList.add('product')
        productList.appendChild(productDiv);
    });

    productList.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON'){
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        }
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')){
            const itemElement = e.target.closest('.cart-item');
            const itemId = parseInt(itemElement.dataset.id);

            removeItemFromCart(itemId);
        }
    });

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(product){
        const existingItem = cart.find(item => item.id === product.id);

        if(existingItem) {
            existingItem.quantity++;
            saveCart();
        } else {
            cart.push({...product, quantity: 1});
            saveCart();
        }
        renderCart();
        
    };

    function renderCart(){
        cartItems.innerText = '';

        if(cart.length > 0){
            emptyCartMessage.classList.add('hidden');
            cartTotalMessage.classList.remove('hidden');
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.setAttribute('data-price', item.price)
                cartItem.dataset.price = item.price;
                cartItem.dataset.id = item.id;
                cartItem.innerHTML = `
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus-btn" aria-label="Decrease quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-btn" aria-label="Remove item">×</button>
                `
                cartItem.classList.add('cart-item');
                cartItems.appendChild(cartItem);
            });
        } else {
            emptyCartMessage.classList.remove('hidden');
            cartTotalMessage.classList.add('hidden');
        }
        
        setupQuantityButtons();
        updateCartTotal();
    };

    function setupQuantityButtons(){
        const quantityContainers = document.querySelectorAll('.item-quantity');

        quantityContainers.forEach(container => {
            const minusBtn = container.querySelector('.minus-btn');
            const plusBtn = container.querySelector('.plus-btn');
            const quantitySpan = container.querySelector('.quantity');

            if (container.dataset.eventsAdded) {return;};

            plusBtn.addEventListener('click', ()=> {
                const itemElement = plusBtn.closest('.cart-item');
                const itemId = parseInt(itemElement.dataset.id);
                const itemInCart = cart.find(item => item.id === itemId);
                itemInCart.quantity++;
                quantitySpan.textContent = itemInCart.quantity;
                updateCartTotal();
                saveCart();
            });

            minusBtn.addEventListener('click', ()=> {
                const itemElement = minusBtn.closest('.cart-item');
                const itemId = parseInt(itemElement.dataset.id);
                const itemInCart = cart.find(item => item.id === itemId);

                if (itemInCart.quantity > 1){
                    itemInCart.quantity--;
                    quantitySpan.textContent = itemInCart.quantity;
                    updateCartTotal();
                    saveCart();
                } else {
                    removeItemFromCart(itemId);
                    saveCart();
                }
            });

            container.dataset.eventsAdded = 'true';
        });
    };

    function updateCartTotal(){
        const Cart = document.querySelectorAll('.cart-item');
        let grandTotal = 0;
        Cart.forEach(item => {
            const price = parseFloat(item.getAttribute('data-price'));
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            grandTotal += price*quantity;
        });
        totalPriceDisplay.textContent = `$${grandTotal.toFixed(2)}`
    };

    function removeItemFromCart(itemId){
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        };

        renderCart();
        saveCart();
    }

    checkOutButton.addEventListener('click', () => {
        cart.length = 0;
        alert('Checkout Succesfull');
        renderCart();
        saveCart();
    });
});