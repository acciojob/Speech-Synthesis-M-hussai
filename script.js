// Your script here.
const synth = window.speechSynthesis;

// DOM Elements
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const rateValue = document.getElementById('rate-value');
const pitchInput = document.getElementById('pitch');
const pitchValue = document.getElementById('pitch-value');
const speakBtn = document.getElementById('speak-btn');
const stopBtn = document.getElementById('stop-btn');

let voices = [];

// Populate Available Voices
function populateVoiceList() {
  if (!synth) {
    voiceSelect.innerHTML = '<option value="">Speech Synthesis Not Supported</option>';
    return;
  }

  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    voiceSelect.innerHTML = '<option value="">No voices available</option>';
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — Default' : ''}`;
    option.setAttribute('data-index', index);
    voiceSelect.appendChild(option);
  });
}

// Dynamic Voice Loading (Chromium browsers fire onvoiceschanged)
populateVoiceList();
if (synth && synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

// Speak Functionality
function speak() {
  // Prevent speech synthesis if input is empty
  const text = textInput.value.trim();
  if (!text) return;

  // Stop ongoing speech before starting new utterance
  if (synth.speaking) {
    synth.cancel();
  }

  const utterThis = new SpeechSynthesisUtterance(text);

  // Set Selected Voice
  const selectedIndex = voiceSelect.selectedOptions[0]?.getAttribute('data-index');
  if (selectedIndex !== null && voices[selectedIndex]) {
    utterThis.voice = voices[selectedIndex];
  }

  // Set Rate and Pitch
  utterThis.rate = parseFloat(rateInput.value);
  utterThis.pitch = parseFloat(pitchInput.value);

  synth.speak(utterThis);
}

// Stop Functionality
function stop() {
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }
}

// Event Listeners
speakBtn.addEventListener('click', speak);
stopBtn.addEventListener('click', stop);

// Update Slider Labels Dynamically
rateInput.addEventListener('input', () => {
  if (rateValue) rateValue.textContent = rateInput.value;
});

pitchInput.addEventListener('input', () => {
  if (pitchValue) pitchValue.textContent = pitchInput.value;
});

// Handle mid-speech Voice/Rate/Pitch switching by restarting speech if speaking
voiceSelect.addEventListener('change', () => {
  if (synth.speaking) speak();
});

rateInput.addEventListener('change', () => {
  if (synth.speaking) speak();
});

pitchInput.addEventListener('change', () => {
  if (synth.speaking) speak();
});