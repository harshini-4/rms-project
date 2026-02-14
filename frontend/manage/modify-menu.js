const API_URL = "https://rms-project-backend.onrender.com/menu"; // API URL for menu routes

function goDashboard() {
    window.location.href = "../dashboard/dashboard.html";
}

// Fetch and display menu items
async function fetchMenuItems() {
    const response = await fetch(API_URL);
    const menuData = await response.json();
    const tableBody = document.getElementById("menuTable");

    tableBody.innerHTML = ""; // Clear table before inserting new rows

    // Loop through grouped menu categories
    Object.keys(menuData).forEach(category => {
        menuData[category].forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.item_no}</td>
                    <td>${item.name}</td>
                    <td>${item.description || "N/A"}</td>
                    <td>${item.price}</td>
                    <td>${category}</td> <!-- Use category instead of item.menu_type -->
                    <td>${item.tags || "N/A"}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editMenuItem(${item.item_no}, '${item.name}', '${item.description}', ${item.price}, '${category}', '${item.tags}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteMenuItem(${item.item_no})">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
}

// Add or update menu item
document.getElementById("menuForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const itemNo = document.getElementById("itemNo").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const menuType = document.getElementById("menuType").value;

    let tags = document.getElementById("tags").value;

    let tagsArray = null;

    if (tags.trim() !== "") {
        tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    }
    
    const menuData = { name, description, price, menu_type: menuType, admin_id: 1, tags: tagsArray };

    const method = itemNo ? "PUT" : "POST";
    const url = itemNo ? `${API_URL}/update/${itemNo}` : `${API_URL}/add`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuData)
    });

    document.getElementById("menuForm").reset();
    document.getElementById("itemNo").value = ""; // Clear hidden field
    fetchMenuItems(); // Refresh the menu list
});

// Edit menu item (Prefill form)
function editMenuItem(itemNo, name, description, price, menuType, tags) {
    document.getElementById("itemNo").value = itemNo;
    document.getElementById("name").value = name;
    document.getElementById("description").value = description;
    document.getElementById("price").value = price;
    document.getElementById("menuType").value = menuType;
    document.getElementById("tags").value = tags;
}

// Delete menu item
async function deleteMenuItem(itemNo) {
    if (confirm("Are you sure you want to delete this menu item?")) {
        await fetch(`${API_URL}/delete/${itemNo}`, { method: "DELETE" });
        fetchMenuItems(); // Refresh the menu list after deletion
    }
}

// Load menu items when page loads
fetchMenuItems();
