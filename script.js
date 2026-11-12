const form = document.getElementById("myForm");

let wrongAttempts = 0;
let isLocked = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();   // stops page reload on submit
  clearErrors();

  // If password is locked, show message and stop
  if (isLocked) {
    document.getElementById("passwordError").innerHTML =
      "Password is locked. Try again after 1 minute.";
    return;
  }

  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let valid = true;

  // Name validation
  if (name.value.trim() === "") {
    showError(name, "nameError", "Name is required.");
    valid = false;
  } else if (!/^[A-Za-z]+$/.test(name.value.trim())) {
    showError(name, "nameError", "Only letters are allowed.");
    valid = false;
  } else {
    showSuccess(name);
  }

  // Email validation
  if (email.value.trim() === "") {
    showError(email, "emailError", "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "emailError", "Invalid email address.");
    valid = false;
  } else {
    showSuccess(email);
  }

  // Password validation (correct password is CSE123)
  if (password.value === "") {
    showError(password, "passwordError", "Password is required.");
    valid = false;
  } else if (password.value !== "CSE123") {
    wrongAttempts++;
    showError(password,"passwordError","Wrong Password! Attempt " + wrongAttempts + " of 3.");
    valid = false;

    if (wrongAttempts >= 3) {
      isLocked = true;
        showError(password,"passwordError","Too many wrong attempts, locked for 1 minute.");
      password.disabled = true;

      setTimeout(function () {
        isLocked = false;
        wrongAttempts = 0;
        password.disabled = false;
        document.getElementById("passwordError").innerHTML =
          "Password unlocked. Try again.";
      }, 60000); // 1 minute lock 
    }
  } else {
    wrongAttempts = 0;
    showSuccess(password);
  }

  // Gender
  if (gender === null) {
    document.getElementById("genderError").innerHTML =
      "Please select your gender.";
    valid = false;
  }

  // Success
  if (valid) {
    alert("Form Submitted Successfully!");
    form.reset();
    clearErrors();
  }
});

// ---------- Functions ----------

// Show error
function showError(input, errorId, message) {
  input.classList.add("errorBorder");
  input.classList.remove("successBorder");
  document.getElementById(errorId).innerHTML = message;
}

// Show success
function showSuccess(input) {
  input.classList.remove("errorBorder");
  input.classList.add("successBorder");
}

// Clear all errors
function clearErrors() {
  let errors = document.querySelectorAll(".error");
  errors.forEach(function (item) {
    item.innerHTML = "";
  });

  let fields = document.querySelectorAll("input, select, textarea");
  fields.forEach(function (field) {
    field.classList.remove("errorBorder");
    field.classList.remove("successBorder");
  });
}
