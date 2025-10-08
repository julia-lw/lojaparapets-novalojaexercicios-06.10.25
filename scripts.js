// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Cama Nuvem Lisa Oliva",
        price: 279.00,
        image: "img/Cama Nuvem Lisa Oliva.avif"
    },
    {
        id: 2,
        name: "Máquina de Tosa Propetz",
        price: 300.59,
        image: "img/Máquina de Tosa Propetz.avif"
    },
    {
        id: 3,
        name: "Comedouro Alto Duplo para Cães Tamanho G",
        price: 90.99,
        image: "img/Comedouro Alto Duplo para Cães Tamanho G.avif"
    },
    {
        id: 4,
        name: "Mec Pet Caixa de Transporte",
        price: 59.99,
        image: "img/Mec Pet Caixa de Transporte.avif"
    },
    {
        id: 5,
        name: "Colchão Impermeável Fábrica Pet",
        price: 45.99,
        image: "img/Colchão Impermeável Fábrica Pet.avif"
    },
    {
        id: 6,
        name: "Fantasia de Rena para Cães e Gatos de Porte Médio",
        price: 29.99,
        image: "img/Fantasia de Rena para Cães e Gatos de Porte Médio.avif"
    },
    {
        id: 7,
        name: "Parquinho Natural Playground para Aves",
        price: 106.99,
        image: "img/Parquinho Natural Playground para Aves.avif"
    },
    {
        id: 8,
        name: "Banheira Para Pássaros Com Comedouro",
        price: 100.59,
        image: "img/Banheira Para Pássaros Com Comedouro.avif"
    },
    {
        id: 9,
        name: "Ração para Peixe Betta Alcon Mini Betta",
        price: 12.90,
        image: "img/Ração para Peixe Betta Alcon Mini Betta.avif"
    },
    {
        id: 10,
        name: "Filtro Pequeno para Aquário Hieryan",
        price: 101.89,
        image: "img/Filtro Pequeno para Aquário Hieryan.avif"
    },
    {
        id: 11,
        name: "Arranhador para Gatos",
        price: 221.90,
        image: "img/Arranhador para Gatos.avif"
    },
    {
        id: 12,
        name: "Gaiola para Calopsita",
        price: 349.90,
        image: "img/Gaiola para Calopsita.avif"
    },
];

// parte do cep
    
    var campoCep = document.getElementById('cep');
    function buscarCep(){
    const campoCep = document.getElementById('cep');
    let valorCep = campoCep.value.replace(/\D/g, '');
    if(valorCep.length!==8){
        limparCamposEndereco();
        return
    }
    const url = `https://viacep.com.br/ws/${valorCep}/json/`;
    fetch (url)
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            alert("CEP inválido/não encontrado. Por favor, verifique.");
            limparCamposEndereco();
            campoCep.style.border = "2px solid red";
            return;
        }
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        campoCep.value = data.cep;
        campoCep.style.border = "2px solid green";
    })
    .catch(error => {
        alert("Erro ao buscar CEP. Tente novamente mais tarde.");
            limparCamposEndereco();
            campoCep.style.border = "2px solid red";
        });
        }
    function limparCamposEndereco() {
        document.getElementById('logradouro').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
        }
        document.addEventListener('DOMContentLoaded', () => {
            const campoCep = document.getElementById('cep');
            if (campoCep) {
                campoCep.addEventListener('blur', buscarCep);
        }
        const form = document.querySelector('form');
            if (form) {
        form.addEventListener('submit', (event) => {
            const campoLogradouro = document.getElementById('logradouro');
            if (!campoLogradouro.value) {
                event.preventDefault();
                alert('Por favor, digite um CEP válido e aguarde o preenchimento do endereço.');
                }
            });
        }
    });
    
// Estado do carrinho
let cart = [];

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
});

// Renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Adicionar event listeners aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    // Verificar se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar lista de itens
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="cart-item-remove" data-id="${item.id}">Remover</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Atualizar total
    cartTotal.textContent = total.toFixed(2);
    
    // Adicionar event listeners aos botões de remover
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transition: transform 0.3s, opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Abrir/fechar carrinho
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});
