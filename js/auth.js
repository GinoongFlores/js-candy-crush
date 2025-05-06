// Import Firebase authentication and Firestore functions
// These functions allow us to handle user login, registration, and Google Sign-In
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
  initializeUserData,
} from "./firebase-config.js";

// Helper function to display error or success messages
// 'elementId' is the ID of the HTML element where the message will be shown
// 'message' is the text to display
// 'isError' determines if the message is an error (default is true)
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

// Function to handle user login
// Retrieves email and password from input fields
// Uses Firebase Authentication to sign in the user
// Redirects to 'index.html' on successful login
// Displays error message if login fails
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

// Function to handle Google Sign-In
// Uses Firebase Authentication to sign in the user with Google
// Calls 'initializeUserData' to ensure user data is set up in Firestore
// Redirects to 'index.html' on successful login
// Displays error message if sign-in fails
window.signInWithGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Initialize user data using shared function
    await initializeUserData(user);
    window.location.href = "index.html";
  } catch (error) {
    showMessage("loginError", error.message);
  }
};

// Function to handle user registration
// Retrieves email, password, and confirm password from input fields
// Validates password length and matching
// Uses Firebase Authentication to create a new user
// Calls 'initializeUserData' to set up user data in Firestore
// Displays success message and redirects to 'index.html' on successful registration
// Displays error message if registration fails
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

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await initializeUserData(result.user);

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

// Function to toggle between login and registration forms
// Clears input fields and error/success messages
// Switches the visibility of the login and registration forms
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
