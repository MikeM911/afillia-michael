// --- Phone input initialization and validation ---
document.addEventListener('DOMContentLoaded', function() {
  var phoneInput = document.querySelector("#phone");
  // Prevent pasting into Confirm Password field
  const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('paste', function(e) {
      e.preventDefault();
    });
  }
  let iti = null;
  if (window.intlTelInput && phoneInput) {
    iti = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: function (callback) {
        fetch("https://ipinfo.io/json")
          .then((resp) => resp.json())
          .then((resp) => callback(resp.country ? resp.country : "us"));
      },
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.1.1/js/utils.js",
    });
  }

  // --- Email availability check ---
  const emailInput = document.querySelector('input[name="email"]');
  if (emailInput) {
    // Create error message element
    const emailError = document.createElement('div');
    emailError.style.color = 'red';
    emailError.style.marginBottom = '8px';
    emailError.style.display = 'none';
    emailError.style.fontWeight = 'bold';
    emailInput.parentNode.insertBefore(emailError, emailInput);

    let lastCheckedEmail = '';
    let lastCheckResult = false;

    emailInput.addEventListener('blur', async function() {
      const email = emailInput.value.trim();
      if (!email) {
        emailError.textContent = '';
        emailError.style.display = 'none';
        emailInput.style.borderColor = '';
        lastCheckedEmail = '';
        lastCheckResult = false;
        return;
      }
      try {
        const response = await fetch('/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        lastCheckedEmail = email;
        lastCheckResult = data.exists;
        if (data.exists) {
          emailError.textContent = 'Email already taken';
          emailError.style.display = 'block';
          emailInput.style.borderColor = 'red';
        } else {
          emailError.textContent = '';
          emailError.style.display = 'none';
          emailInput.style.borderColor = '';
        }
      } catch (err) {
        emailError.textContent = 'Error checking email';
        emailError.style.display = 'block';
        emailInput.style.borderColor = 'red';
      }
    });

    // Prevent form submission if email is taken
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        // Only block if the error is visible and not empty
        if (emailError.style.display === 'block' && emailError.textContent) {
          emailInput.focus();
          e.preventDefault();
        }
      });
    }
  }

  // --- Password visibility toggle ---
  document.querySelectorAll('.password-group').forEach(function(group) {
    const input = group.querySelector('input[type="password"], input[type="text"]');
    const icon = group.querySelector('.eye-icon img');
    let visible = false;
    group.querySelector('.eye-icon').addEventListener('click', function() {
      visible = !visible;
      input.type = visible ? 'text' : 'password';
      // Show "show" icon when hidden, "hide" icon when visible
      if (icon) {
        icon.src = visible ? 'assets/Visibility.svg' : 'assets/Vector.svg';
        icon.alt = visible ? 'Hide Password' : 'Show Password';
      }
    });
  });

  // --- Password and phone validation and registration logic ---
  const form = document.querySelector('form');
  if (!form) return;

  const passwordInput = form.querySelector('input[placeholder="Password *"]');
  const confirmInput = form.querySelector('input[placeholder="Confirm Password *"]');

  function validatePassword(password) {
    return (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  form.addEventListener('submit', async function(e) {
    // Phone validation
    if (iti && !iti.isValidNumber()) {
      alert("Please enter a valid phone number.");
      phoneInput.focus();
      e.preventDefault();
      return;
    }

    // Password validation
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (!validatePassword(password)) {
      alert(
        "Password must be at least 12 characters long, contain at least one uppercase letter, one number, and one special character."
      );
      passwordInput.focus();
      e.preventDefault();
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      confirmInput.focus();
      e.preventDefault();
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    // Replace phone with formatted number
    if (iti) {
      formData.set('phone', iti.getNumber());
    }
    const data = Object.fromEntries(formData.entries());

    // Send to backend on port 3000
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Registration successful!');
        form.reset();
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      alert('An error occurred: ' + err.message);
    }
    e.preventDefault();
  });
});

// --- Custom select dropdown logic (if you use a custom dropdown) ---
document.querySelectorAll('.custom-select').forEach(function(select) {
  var placeholder = select.querySelector('.custom-select-placeholder');
  var options = select.querySelector('.custom-options');
  var input = select.querySelector('input[type="hidden"]');
  var dummy = select.querySelector('.country-dummy');

  select.addEventListener('click', function(e) {
    select.classList.toggle('open');
  });

  options.querySelectorAll('li').forEach(function(option) {
    option.addEventListener('click', function(e) {
      placeholder.textContent = option.textContent;
      input.value = option.getAttribute('data-value');
      options.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
      option.classList.add('selected');
      select.classList.remove('open');
      if(dummy) dummy.setCustomValidity('');
      e.stopPropagation();
    });
  });

  document.addEventListener('mousedown', function(e) {
    if (!select.contains(e.target)) {
      select.classList.remove('open');
    }
  });

  select.addEventListener('keydown', function(e) {
    if (e.key === "Escape" || e.key === "Tab") {
      select.classList.remove('open');
    }
  });
});

// --- Native-like validation for custom country dropdown ---
document.querySelectorAll('form').forEach(function(form) {
  form.addEventListener('submit', function(e) {
    var select = form.querySelector('.custom-select');
    var countryInput = form.querySelector('.custom-select input[type="hidden"]');
    var dummy = form.querySelector('.custom-select .country-dummy');

    if (countryInput && !countryInput.value) {
      if (dummy) {
        dummy.focus();
        dummy.setCustomValidity('Please select a country.');
        dummy.reportValidity();
        setTimeout(function() {
          dummy.setCustomValidity('');
        }, 2000);
      }
      if (select) select.focus();
      e.preventDefault();
      return;
    }
  });
});

// --- Custom validation message for native <select required> country dropdown ---
document.addEventListener('DOMContentLoaded', function() {
  var countrySelect = document.querySelector('select[name="country"]');
  if (countrySelect) {
    countrySelect.addEventListener('invalid', function() {
      this.setCustomValidity('Please select a country');
    });
    countrySelect.addEventListener('change', function() {
      this.setCustomValidity('');
    });
    countrySelect.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
});