const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load routes here
const aiRoute = require("./route/ai");
const pageRoute = require("./route/page")

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  throw new Error("Missing SERVICE_ACCOUNT_PATH in .env file");
}

const serviceAccount = require(serviceAccountPath);
// const serviceAccount = require("./serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Set up EJS for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());


// Endpoint for Google login
app.use("/api", aiRoute);
app.use("/", pageRoute);

app.post("/login", async (req, res) => {
  const { idToken } = req.body; // Expecting an ID token from the frontend

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const usersCollection = db.collection("google_users");
    const uid = decodedToken.uid;

    // Optional: Fetch user details from Firebase
    const user = await admin.auth().getUser(uid);
    const existingUser = await usersCollection.findOne({ email: user.email });
    let result;
    if (existingUser) {
      result = {
        acknowledged: true,
        insertedId: existingUser._id,
      };
    } else {
      result = await usersCollection.insertOne(user);
    }
    res.status(200).json({
      message: "Login successful",
      result: result,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
});
app.post("/firebase-config",(req,res)=>{
  try{
    const key = req.body.apiKey || Headers.apiKey;
    if(key == process.env.FIREBASE_MY_SECRET_KEY){
      res.json({
        apiKey:process.env.FIREBASE_API_KEY,
        authDomain:process.env.FIREBASE_AUTH_DOMAIN,
        projectId:process.env.FIREBASE_PROJECT_ID,
      })
    }
  }catch(error){
    res.json({
      error:error.message
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
