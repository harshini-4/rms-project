document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.status === 200) {
        alert("Login Successful!");
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "../dashboard/dashboard.html"; // Redirect to dashboard
    } else {
        alert("Login Failed: " + data.message);
    }
});