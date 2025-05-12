// Nate Gladhart, NAT2036357, 05/10/2025

// Plays an audible click at any BPM between 40–240

(() => {
  const bpmSlider = document.getElementById('bpmSlider');
  const bpmVal    = document.getElementById('bpmVal');
  const startBtn  = document.getElementById('metroStart');
  const stopBtn   = document.getElementById('metroStop');

  if (!bpmSlider) return;

  const audio = new (window.AudioContext || window.webkitAudioContext)();
  let intervalId = null;

  // one short click
  function tick() {
    const osc  = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = 1000;                         // pitch
    gain.gain.setValueAtTime(1,  audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.1);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.11);
  }

  function start() {
    if (intervalId) return;                             // already running
    const ms = 60000 / parseInt(bpmSlider.value, 10);   // ms per beat
    tick();                                             // immediate first click
    intervalId = setInterval(tick, ms);
    startBtn.disabled = true;
    stopBtn.disabled  = false;
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.disabled = false;
    stopBtn.disabled  = true;
  }

  // UI wiring
  bpmSlider.addEventListener('input', () => {
    bpmVal.textContent = bpmSlider.value;
    if (intervalId) { stop(); start(); }                // live tempo change
  });

  startBtn.addEventListener('click', () => {
    if (audio.state === 'suspended') audio.resume();
    start();
  });
  stopBtn.addEventListener('click', stop);
})();
