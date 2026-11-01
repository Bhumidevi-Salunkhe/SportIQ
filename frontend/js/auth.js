
const API_URL = "http://localhost:5000/api/auth";

// REGISTRATION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Please login.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Unable to connect to server.");
            console.error(error);
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Login successful!");

                window.location.href = "athlete-dashboard.html";
            } else {
    console.log("Login error:", data);
    alert(data.message + (data.error ? ": " + data.error : ""));
}

        } catch (error) {
            alert("Unable to connect to server.");
            console.error(error);
        }
    });
}
