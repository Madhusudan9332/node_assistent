// Variables here

const globelKeys = {
  OUTPUT_MODE: "text",
};
const form = document.getElementById("input-form");
const speechModeBtn = document.querySelector(".speech-mode-btn");

const messageInput = document.getElementById("message");
const chatBox = document.querySelector(".chat-box");
const micButton = document.querySelector(".mic-btn");
const submitButton = document.querySelector(".submit-btn");
const listeningMic = document.createElement("div");

let recognition;
let isRecording = false;
let synth = window.speechSynthesis;
let currentUtterance = null;

// Methods here

function appendMessage(content, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = type; // 'user-input' or 'bot-responce'
  messageDiv.textContent = content;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}
function botSpeak(message) {
  currentUtterance = new SpeechSynthesisUtterance(message);
  currentUtterance.lang = "en-US";

  return new Promise((resolve) => {
    currentUtterance.onend = () => resolve(true);
    currentUtterance.onerror = () => resolve(false);
    synth.speak(currentUtterance);
  });
}
function stopSpeech() {
  if (synth.speaking) synth.cancel();
}

// Handle the events here when DOM Content Loaded

document.addEventListener("DOMContentLoaded", () => {
  callInit();
  listeningMic.className = "listening-mic";
  listeningMic.textContent = "Listening...";
  listeningMic.style.display = "none";
  document.body.appendChild(listeningMic);

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    micButton.addEventListener("click", (event) => {
      event.preventDefault();
      stopSpeech();
      if (isRecording) {
        recognition.stop();
        isRecording = false;
        listeningMic.style.display = "none"; // Hide the animation
        messageInput.style.display = ""; // Show the input field again
        micButton.classList.remove("recording");
      } else {
        recognition.start();
        isRecording = true;
        listeningMic.style.display = "block"; // Show the animation
        messageInput.style.display = "none"; // Hide the input field
        micButton.classList.add("recording");
        console.log("Listening...");
      }
    });

    recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized text:", transcript);
      messageInput.value = transcript;
      listeningMic.style.display = "none"; // Hide the animation after recognition
      messageInput.style.display = ""; // Show the input field
      form.dispatchEvent(new Event("submit"));
    });

    recognition.addEventListener("error", (event) => {
      console.error("Speech recognition error:", event.error);
      isRecording = false;
      listeningMic.style.display = "none"; // Hide the animation
      messageInput.style.display = ""; // Show the input field
    });

    recognition.addEventListener("end", () => {
      isRecording = false;
      listeningMic.style.display = "none"; // Hide the animation
      messageInput.style.display = ""; // Show the input field
      micButton.classList.remove("recording");
    });
  } else {
    console.warn("Speech Recognition API is not supported in this browser.");
    micButton.disabled = true;
  }

  appendMessage("Hi! How can I assist you?", "bot-responce");

  speechModeBtn.addEventListener("click", () => {
    const mode = globelKeys.OUTPUT_MODE;
    const botResponse = `${
      mode == "speech" ? "Text" : "Speech"
    } Mode activated! How can I assist you?`;
    appendMessage(botResponse, "bot-responce");
    speechModeBtn.textContent = mode === "speech" ? "Speech Mode" : "Text Mode";
    botSpeak(botResponse);
    if (mode == "text") {
      setTimeout(() => {
        micButton.click();
      }, 3000);
    }
    globelKeys.OUTPUT_MODE = mode === "speech" ? "text" : "speech";
  });

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      console.log("Message submitted:", message);
      appendMessage(message, "user-input");
      messageInput.value = "";
      setTimeout(async () => {
        const botResponce =
          (await getResponse(message)) || "try again error in response";
        appendMessage(botResponce, "bot-responce");
        if (globelKeys.OUTPUT_MODE === "speech") {
          const isSpeechComplete = await botSpeak(botResponce);
          if (isSpeechComplete) micButton.click();
        }
      }, 1000);
    } else {
      console.log("No message entered!");
    }
  });
});

