// Web Speech API Initialization
const synth = window.speechSynthesis;
let voices = [];

// DOM Element Selection
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const speakBtn = document.getElementById('speak-btn');
const stopBtn = document.getElementById('stop-btn');

// Populate Voice Dropdown
function populateVoiceList() {
  voices = synth.getVoices();

  if (voices.length === 0) {
    voiceSelect.innerHTML = '<option value="">No voices available</option>';
    return;
  }

  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    if (voice.default) {
      option.selected = true;
    }
    voiceSelect.appendChild(option);
  });
}

// Fetch available voices dynamically
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

// Start Speech Function
function startSpeech() {
  const text = textInput.value.trim();
  
  // Prevent speech if text input is empty
  if (!text) return;

  // Cancel active speech before playing new audio
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  // Create new SpeechSynthesisUtterance object
  const utterance = new SpeechSynthesisUtterance(text);

  // Set Voice
  const selectedIndex = voiceSelect.value;
  if (voices[selectedIndex]) {
    utterance.voice = voices[selectedIndex];
  }

  // Set Rate and Pitch
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);

  // Speak
  synth.speak(utterance);
}

// Stop Speech Function
function stopSpeech() {
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }
}

// Event Listeners for Speak and Stop
speakBtn.addEventListener('click', startSpeech);
stopBtn.addEventListener('click', stopSpeech);

// Dynamic updates: Restart speech if parameters change mid-speech
voiceSelect.addEventListener('change', () => {
  if (synth.speaking) startSpeech();
});

rateInput.addEventListener('change', () => {
  if (synth.speaking) startSpeech();
});

pitchInput.addEventListener('change', () => {
  if (synth.speaking) startSpeech();
});