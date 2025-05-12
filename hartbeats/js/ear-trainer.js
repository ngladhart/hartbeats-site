// Nate Gladhart, NAT2036357, 05/10/2025

// Play a random interval, let the student guess, track score
(() => {
  // DOM refs
  const playBtn   = document.getElementById('playInterval');
  if (!playBtn) return;                      // script loaded on wrong page

  const nextBtn   = document.getElementById('nextRound');
  const promptEl  = document.getElementById('trainerPrompt');
  const choicesEl = document.getElementById('choices');
  const scoreEl   = document.getElementById('scoreDisplay');

  // intervals we’ll use
  const INTERVALS = [
    { name: 'Minor 3rd',  semitones: 3 },
    { name: 'Major 3rd',  semitones: 4 },
    { name: 'Perfect 4th',semitones: 5 },
    { name: 'Perfect 5th',semitones: 7 },
    { name: 'Octave',     semitones: 12 }
  ];

  // simple synth
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  function playTone(freq,dur=.8){
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(.8,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime+dur+.05);
  }

  // game state
  let current=null, score=0, rounds=0;
  const rand = (min,max)=>Math.random()*(max-min)+min;

  function playInterval(){
    const root = rand(220,440);
    playTone(root);
    setTimeout(()=>playTone(root*Math.pow(2,current.semitones/12)),800);
  }

  function renderChoices(){
    choicesEl.innerHTML='';
    INTERVALS.forEach(it=>{
      const btn=document.createElement('button');
      btn.textContent=it.name;
      btn.onclick=()=>handleChoice(btn,it);
      choicesEl.appendChild(btn);
    });
  }

  function chooseInterval(){
    current = INTERVALS[Math.floor(Math.random()*INTERVALS.length)];
    renderChoices(); playInterval();
    promptEl.textContent='Identify the interval:';
    nextBtn.disabled=true;
  }

  function handleChoice(btn,it){
    const correct = it.name===current.name;
    btn.classList.add(correct?'correct':'incorrect');
    [...choicesEl.children].forEach(b=>b.disabled=true);
    rounds++; if(correct) score++;
    scoreEl.textContent=`Score: ${score}/${rounds}`;
    promptEl.textContent = correct ? 'Correct!' : `Oops – it was ${current.name}.`;
    nextBtn.disabled=false;
  }

  // wire up buttons
  playBtn.onclick = ()=>{ if(ctx.state==='suspended') ctx.resume(); playInterval(); };
  nextBtn.onclick = chooseInterval;

  // init
  chooseInterval();
})();
