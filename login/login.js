const accounts = [
  { email: "user@gmail.com",  password: "userpass",  role: "user",       page: "../user/user.html" },
  { email: "admin@gmail.com", password: "adminpass", role: "admin",      page: "../admin/admin.html" },
  { email: "super@gmail.com", password: "sadminpass", role: "superadmin", page: "../superadmin/superadmin.html" }
];

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {

  event.preventDefault();

  clearErrors();

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let valid = true;

  // Email Validation

  if (email.value.trim() === "") {

    showError(email, "emailError", "Email is required.");

    valid = false;

  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {

    showError(email, "emailError", "Invalid email address.");

    valid = false;

  } else {

    showSuccess(email);

  }

  // Password Validation

  if (password.value === "") {

    showError(password, "passwordError", "Password is required.");

    valid = false;

  } else if (password.value.length < 8) {

    showError(password, "passwordError", "Password must be at least 8 characters.");

    valid = false;

  } else {

    showSuccess(password);

  }

  // Success

if (valid) {
  let found = null;
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email.value.trim().toLowerCase() && accounts[i].password === password.value) {
      found = accounts[i];
    }
  }

  if (found === null) {
    showError(password, "passwordError", "Wrong email or password.");
  } else {
    sessionStorage.setItem("cbRole", found.role);
    window.location.href = found.page;
  }
}

});

// Show Error

function showError(input, errorId, message) {

  input.classList.add("errorBorder");

  input.classList.remove("successBorder");

  document.getElementById(errorId).innerHTML = message;

}

// Show Success

function showSuccess(input) {

  input.classList.remove("errorBorder");

  input.classList.add("successBorder");

}

// Clear Errors

function clearErrors() {

  let errors = document.querySelectorAll(".error");

  errors.forEach(function (item) {

    item.innerHTML = "";

  });

  let fields = document.querySelectorAll("input");

  fields.forEach(function (field) {

    field.classList.remove("errorBorder");

    field.classList.remove("successBorder");

  });

}

// Forgot Password

document.getElementById("forgotPassword").addEventListener("click", function (event) {

  event.preventDefault();

  alert("Please contact the administrator to reset your password.");

});