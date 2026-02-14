let cart = []; // Store selected items and their quantities

// Function to fetch menu items from the API
async function fetchMenuItems() {
    try {
        const response = await fetch("https://rms-project-backend.onrender.com/menu/");
        const data = await response.json();
        const menuItemsContainer = document.getElementById("menu-items");
        menuItemsContainer.innerHTML = ''; 

        Object.keys(data).forEach(category => {
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("menu-category");

            const categoryTitle = document.createElement("h3");
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            const itemsList = document.createElement("div");
            itemsList.classList.add("menu-list");

            data[category].forEach(item => {
                const menuItemDiv = document.createElement("div");
                menuItemDiv.classList.add("menu-item");
                
                menuItemDiv.setAttribute("data-item_no", item.item_no);
                menuItemDiv.setAttribute("data-name", item.name);

                menuItemDiv.innerHTML = `
                    <span class="item-no">${item.item_no}</span>
                    <span class="item-name">${item.name}</span>
                    <span class="item-description">${item.description}</span>
                    <span class="item-price">Rs ${item.price}</span>
                    <div class="quantity">
                        <button onclick="decreaseQuantity('${item.item_no}', ${item.price})">-</button>
                        <span id="${item.item_no}-qty">0</span>
                        <button onclick="increaseQuantity('${item.item_no}', ${item.price})">+</button>
                    </div>
                `;

                itemsList.appendChild(menuItemDiv);
            });

            categoryDiv.appendChild(itemsList);
            menuItemsContainer.appendChild(categoryDiv);
        });
    } catch (error) {
        console.error("Failed to fetch menu items:", error);
    }
}

// Function to increase quantity
function increaseQuantity(item_no, price) {
    let qtyElement = document.getElementById(item_no + "-qty");
    let currentQty = parseInt(qtyElement.textContent);
    qtyElement.textContent = currentQty + 1;

    updateCart(item_no, currentQty + 1, price);
}

// Function to decrease quantity
function decreaseQuantity(item_no, price) {
    let qtyElement = document.getElementById(item_no + "-qty");
    let currentQty = parseInt(qtyElement.textContent);
    if (currentQty > 0) {
        qtyElement.textContent = currentQty - 1;
        updateCart(item_no, currentQty - 1, price);
    }
}

// Function to update the cart and total price
function updateCart(item_no, quantity, price) {
    // Find the item name using the data-name attribute (stored earlier)
    const itemElement = document.querySelector(`[data-item_no="${item_no}"]`);
    const itemName = itemElement ? itemElement.getAttribute('data-name') : "Unknown Item"; // Get name from data-name attribute

    const existingItem = cart.find(item => item.item_no === item_no);

    if (existingItem) {
        existingItem.quantity = quantity;
    } else {
        cart.push({ item_no, name: itemName, quantity, price });
    }

    // Remove items with 0 quantity from the cart
    cart = cart.filter(item => item.quantity > 0);

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    updateTotal();
}

// Function to calculate total amount
function updateTotal() {
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
}

// Function to handle proceeding to the next step (e.g., checkout)
async function proceedToOrder() {
    if (cart.length === 0) {
        alert("Please select at least one item.");
        return;
    }

    console.log("Proceeding with order:", cart);

    // Get the orderType from localStorage (ensure it was set in index.html)
    const orderType = localStorage.getItem("orderType") || "Dine-in"; // Default to Dine-in if not set

    // Collect the data to send to the backend
    const orderData = {
        cart: cart,
        orderType: orderType
    };

    try {
        // Send the order data to the backend (replace URL with your backend API URL)
        const response = await fetch("https://rms-project-backend.onrender.com/order/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (data.orderId) {
            // Store the orderId in localStorage
            localStorage.setItem("orderId", data.orderId);

            // Redirect to the order details page
            window.location.href = "../order/order-summary.html"; // Adjust the path as needed
        } else {
            alert("Failed to place order.");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order.");
    }
}

// Fetch the menu items when the page loads
fetchMenuItems();
