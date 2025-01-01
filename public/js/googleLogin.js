import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// import 'firebase/auth';

// Firebase configuration
const firebaseConfig = await fetch("/firebase-config",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({apiKey:"Ts9GTAfYG-No_Ionx3A"})
}).then(res=>res.json())


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const googleLoginBtn = document.getElementById("google-login-btn");

googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Send ID token to the backend
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Login successful! Welcome, " + data.user.displayName);
      console.log("Login successful:", data);
    } else {
      alert("Login failed.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login error: " + error.message);
  }
});

async function signUp(user) {
  const email = user.email;
  const password = user.password;

  const res = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up as:", user.email);
      return user;
    })
    .catch((error) => {
      console.error("Sign up error:", error.message);
    });
  return res;
}

async function signIn(user) {
  const email = user.email;
  const password = user.password;

  const res = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log("Signed in as:", user.email);
      return user;
    })
    .catch((error) => {
      console.error("Sign in error:", error.message);
    });
  return res;
}

export { signUp, signIn };
