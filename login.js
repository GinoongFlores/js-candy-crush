// Import necessary Firebase authentication functions
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "./firebase-config.js";

// Helper function to show error messages
function showMessage(elementId, message, isError = true) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add("visible");

  // Auto-hide error messages after 5 seconds
  if (isError) {
    setTimeout(() => {
      element.classList.remove("visible");
    }, 5000);
  }
}

// Handle user login
window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginButton = document.querySelector("#loginForm .btn");

  try {
    // Show loading state
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    // Try to login with Firebase
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    showMessage("loginError", error.message);
  } finally {
    // Reset button state
    loginButton.disabled = false;
    loginButton.textContent = "Login to Play";
  }
};

// Handle user registration
window.register = async function () {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const registerButton = document.querySelector("#registerForm .btn");

  // Validate password
  if (password.length < 6) {
    showMessage("registerError", "Password must be at least 6 characters long");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("registerError", "Passwords do not match");
    return;
  }

  try {
    // Show loading state
    registerButton.disabled = true;
    registerButton.textContent = "Creating Account...";

    // Create account with Firebase
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage(
      "registerSuccess",
      "Registration successful! Redirecting...",
      false
    );

    // Redirect after successful registration
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    showMessage("registerError", error.message);
    registerButton.disabled = false;
    registerButton.textContent = "Create Account";
  }
};

// Toggle between login and registration forms
window.toggleForms = function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Clear forms and messages
  document
    .querySelectorAll(".error-message, .success-message")
    .forEach((elem) => elem.classList.remove("visible"));
  document.querySelectorAll("input").forEach((input) => (input.value = ""));

  // Handle form transition
  if (loginForm.style.display === "none") {
    // Switch to login form
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  } else {
    // Switch to registration form
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  }
};
