import { signIn } from "./googleLogin.js";
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = await signIn({ email, password });
    console.log("success", user);
    if (user) {
      console.log("success");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
});
