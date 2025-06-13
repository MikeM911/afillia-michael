document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const errorMessage = document.getElementById("errorMessage");

  // Toggle password visibility using the existing icon
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Toggle only the classes on the existing icon
      this.classList.toggle("fa-eye-slash");
      this.classList.toggle("fa-eye");
    });
  }

  // Handle form submission with validation
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        errorMessage.textContent = "Please enter both email and password.";
        errorMessage.style.display = "block";
        e.preventDefault();
      } else {
        errorMessage.style.display = "none";
      }
    });
  }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = "welcome.html";
    } else {
      document.getElementById('errorMessage').style.display = 'block';
      document.getElementById('errorMessage').textContent = result.message || 'Login failed';
    }
  } catch (err) {
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorMessage').textContent = 'An error occurred: ' + err.message;
  }
});