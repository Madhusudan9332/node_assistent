import { signUp } from "./googleLogin.js";
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  const user = { email, password, username };
  console.log(user);
  try {
    await signUp(user);
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
});
