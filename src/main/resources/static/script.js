// Login Function
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    window.location.href = "dashboard.html";
}

// Register Form Event Listener
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('http://localhost:8081/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        const result = await response.text();
        document.getElementById('regMessage').innerText = result;
    } catch (error) {
        console.error("Register Error:", error);
    }
});

// Add Product Form Listener
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById('pName').value,
        description: document.getElementById('pDesc').value,
        price: parseFloat(document.getElementById('pPrice').value),
        stockQty: parseInt(document.getElementById('pStock').value),
        category: document.getElementById('pCategory').value
    };

    try {
        const response = await fetch('http://localhost:8081/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert("Product Added Successfully! 🎉");
            document.getElementById('productForm').reset();
            loadProducts();
        } else {
            alert("Failed to add product! Check backend validation.");
        }
    } catch (error) {
        console.error("Add Product Error:", error);
        alert("Error adding product to backend.");
    }
});

// Load Products Function
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8081/api/products');
        const products = await response.json();

        const container = document.getElementById('productList');
        if (!container) return;

        container.innerHTML = "";
        if (!products || products.length === 0) {
            container.innerHTML = "<p style='color: #666;'>No products available</p>";
            return;
        }

        products.forEach(p => {
            container.innerHTML += `
                <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 8px;">
                    <h4>${p.name} (${p.category || 'General'})</h4>
                    <p style="color: #555; font-size: 14px;">${p.description || ''}</p>
                    <p><strong>Price:</strong> ₹${p.price} | <strong>Stock:</strong> ${p.stockQty}</p>
                    <button onclick="addToCart(${p.id})" style="background-color: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Add to Cart Function
async function addToCart(productId) {
    const userId = 1;
    try {
        const response = await fetch(`http://localhost:8081/api/cart/add?userId=${userId}&productId=${productId}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert("Added to Cart!");
            loadCart();
        } else {
            alert("Failed to add item to cart.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

// Load Cart Function
async function loadCart() {
    const userId = 1;
    const cartContainer = document.getElementById('cartList');
    if (!cartContainer) return;

    try {
        const response = await fetch(`http://localhost:8081/api/cart/${userId}`);
        if (!response.ok) {
            cartContainer.innerHTML = "<p style='color: #666;'>Your cart is currently empty.</p>";
            return;
        }

        const cartItems = await response.json();
        cartContainer.innerHTML = "";

        if (!cartItems || cartItems.length === 0) {
            cartContainer.innerHTML = "<p style='color: #666;'>Your cart is currently empty.</p>";
            return;
        }

        let total = 0;
        cartItems.forEach(item => {
            const itemPrice = item.product ? item.product.price : (item.price || 0);
            const itemName = item.product ? item.product.name : (item.productName || 'Item');
            const qty = item.quantity || 1;

            total += itemPrice * qty;

            cartContainer.innerHTML += `
                <div style="border: 1px dashed #aaa; padding: 10px; margin-bottom: 8px; border-radius: 6px;">
                    <div>
                        <p style="margin: 0;"><strong>${itemName}</strong></p>
                        <p style="margin: 0; color: #555; font-size: 14px;">₹${itemPrice} x ${qty}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background-color: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-top: 5px;">Remove</button>
                </div>
            `;
        });

        cartContainer.innerHTML += `
            <div style="margin-top: 15px; border-top: 2px solid #eee; padding-top: 10px;">
                <h4 style="margin-bottom: 10px;">Total Amount: ₹${total}</h4>
                <button onclick="checkout()" style="background-color: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%;">Checkout</button>
            </div>
        `;
    } catch (error) {
        console.error("Error loading cart:", error);
        cartContainer.innerHTML = "<p style='color: #666;'>Your cart is currently empty.</p>";
    }
}

// Remove from Cart
async function removeFromCart(cartItemId) {
    try {
        await fetch(`http://localhost:8081/api/cart/remove/${cartItemId}`, {
            method: 'DELETE'
        });
        loadCart();
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// Checkout Function
async function checkout() {
    const userId = 1;
    try {
        const response = await fetch(`http://localhost:8081/api/orders/checkout/${userId}`, {
            method: 'POST'
        });

        if (response.ok) {
            const order = await response.json();
            alert(`Order Placed Successfully! 🎉\nOrder ID: ${order.id}`);
            loadCart();
        } else {
            alert("Failed to place order. Cart might be empty!");
        }
    } catch (error) {
        console.error("Error placing order:", error);
    }
}

// Automatic Load Execution
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("dashboard.html") || document.getElementById("productList")) {
        loadProducts();
        loadCart();
    }
});
function switchTab(event, menuName) {
    event.preventDefault();

    // 1. Menu highlight மாற்றுவது
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.parentElement.classList.add('active');

    // 2. Cards element-களைப் பெறுவது
    const addProductCard = document.getElementById('add-product-card');
    const categoriesCard = document.getElementById('categories-card');
    const productsCard = document.getElementById('products-card');

    // 3. கிளிக் செய்யும் Menu-க்கு ஏற்ப கார்டுகளைக் காட்டுவது/மறைப்பது
    if (menuName === 'all') {
        if(addProductCard) addProductCard.style.display = 'block';
        if(categoriesCard) categoriesCard.style.display = 'block';
        if(productsCard) productsCard.style.display = 'block';
    } 
    else if (menuName === 'add-product') {
        if(addProductCard) addProductCard.style.display = 'block';
        if(categoriesCard) categoriesCard.style.display = 'none';
        if(productsCard) productsCard.style.display = 'none';
    } 
    else if (menuName === 'products') {
        if(addProductCard) addProductCard.style.display = 'none';
        if(categoriesCard) categoriesCard.style.display = 'none';
        if(productsCard) productsCard.style.display = 'block';
    } 
    else if (menuName === 'categories') {
        if(addProductCard) addProductCard.style.display = 'none';
        if(categoriesCard) categoriesCard.style.display = 'block';
        if(productsCard) productsCard.style.display = 'none';
    }
}
// Product Form Submit Handler
const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // 1. HTML Form-லிருந்து தகவல்களை எடுப்பது
        const productName = document.getElementById("pName") ? document.getElementById("pName").value : "";
        const price = document.getElementById("pPrice") ? parseFloat(document.getElementById("pPrice").value) : 0;
        const category = document.getElementById("pCategory") ? document.getElementById("pCategory").value : "";

        const productData = {
            name: productName,
            price: price,
            category: category
        };

        try {
            // 2. Backend API-க்கு POST Request அனுப்புவது
            // குறிப்பு: உங்கள் Backend URL '/products' ஆக இருந்தால் '/api/products' என்பதை '/products' என மாற்றவும்
            const response = await fetch("/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert("Product added successfully!");
                productForm.reset();
                if (typeof loadProducts === "function") {
                    loadProducts();
                }
            } else {
                const errorText = await response.text();
                console.error("Backend Error Details:", errorText);
                alert("Failed to add product. Check browser console!");
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Server connection error!");
        }
    });
}
function switchTab(event, tabName) {
    if (event) event.preventDefault();

    // 1. அனைத்து Tab Content-களையும் மறைத்தல்
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.style.display = 'none');

    // 2. Active Menu Class-ஐ மாற்றுதல்
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.parentElement.classList.add('active');
    }

    // 3. 'all' என்றால் Dashboard Grid-ஐக் காட்டு
    if (tabName === 'all') {
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) dashboardGrid.style.display = 'grid';
    } 
    // 4. குறிப்பிட்ட Tab-ஐக் காட்டுதல் (எ.கா: 'products')
    else {
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) selectedTab.style.display = 'block';
    }

    // 5. 'products' கிளிக் செய்தால் Backend-ல் இருந்து Data எடுத்துவருதல்
    if (tabName === 'products') {
        fetchProducts();
    }
}

// Backend-ல் இருந்து பொருட்களை எடுத்துவரும் Function
function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            if (data.length === 0) {
                productList.innerHTML = `<tr><td colspan="5" style="text-align:center;">No products found</td></tr>`;
                return;
            }

            data.forEach(product => {
                productList.innerHTML += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category || 'N/A'}</td>
                        <td>₹${product.price}</td>
                        <td>${product.stockQty || 0}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}
function filterByCategory(categoryName) {
    // 1. Dashboard-ஐ மறைத்து, Products Table-ஐத் திறத்தல்
    const dashboardGrid = document.querySelector(".dashboard-grid");
    const productsSection = document.getElementById("products-section");
    const productList = document.getElementById("productList");

    if (dashboardGrid) dashboardGrid.style.display = "none";
    if (productsSection) productsSection.style.display = "block";

    // 2. Backend-ல் இருந்து குறிப்பிட்ட Category பொருட்களை மட்டும் வடிகட்டி எடுத்தல்
    fetch(`/api/products`)
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = "";

            // தேர்வு செய்த Category பொருட்கள் மட்டும் வடிகட்டப்படுகின்றன
            const filteredProducts = data.filter(product => 
                product.category && product.category.toLowerCase() === categoryName.toLowerCase()
            );

            if (filteredProducts.length === 0) {
                productList.innerHTML = `<tr><td colspan="6" style="text-align:center;">No products found in '${categoryName}' category.</td></tr>`;
                return;
            }

            filteredProducts.forEach(product => {
                const imageUrl = product.imageUrl || 'https://via.placeholder.com/50';
                productList.innerHTML += `
                    <tr>
                        <td>${product.id}</td>
                        <td><img src="${imageUrl}" width="50" height="50" style="object-fit:cover;"></td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>₹${product.price}</td>
                        <td>${product.stockQty || 0}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Error filtering products:", error));
}


