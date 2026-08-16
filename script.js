// Initialize Web Speech API
const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
let voices = [];

// DOM Elements
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const speakBtn = document.getElementById('speak-btn');
const stopBtn = document.getElementById('stop-btn');

// Populate Voice Dropdown
function populateVoiceList() {
  voices = synth.getVoices();
  
  // Clear existing options
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No voices available';
    voiceSelect.appendChild(option);
    return;
  }

  // Add voices to select dropdown
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute('data-index', index);
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

// Update Speech Parameters
function updateSpeechSettings() {
  utterance.text = textInput.value.trim();
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);

  const selectedIndex = voiceSelect.value;
  if (voices[selectedIndex]) {
    utterance.voice = voices[selectedIndex];
  }
}

// Start Speech Synthesis
function startSpeech() {
  const text = textInput.value.trim();
  if (!text) return; // Prevent empty speech

  // Stop any ongoing speech before starting new one
  if (synth.speaking) {
    synth.cancel();
  }

  updateSpeechSettings();
  synth.speak(utterance);
}

// Stop Speech Synthesis
function stopSpeech() {
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }
}

// Event Listeners
speakBtn.addEventListener('click', startSpeech);
stopBtn.addEventListener('click', stopSpeech);

// Dynamic updates for Rate, Pitch, and Voice changes
rateInput.addEventListener('input', () => {
  utterance.rate = parseFloat(rateInput.value);
  if (synth.speaking) startSpeech();
});

pitchInput.addEventListener('input', () => {
  utterance.pitch = parseFloat(pitchInput.value);
  if (synth.speaking) startSpeech();
});

voiceSelect.addEventListener('change', () => {
  const selectedIndex = voiceSelect.value;
  if (voices[selectedIndex]) {
    utterance.voice = voices[selectedIndex];
  }
  if (synth.speaking) startSpeech();
});