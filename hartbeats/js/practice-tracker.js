// Nate Gladhart, NAT2036357, 05/10/2025

// counts practice time & charts last 7 days
(() => {
  const timer  = document.getElementById('timer');
  if (!timer) return;                     // safeguard if script loaded elsewhere

  const start  = document.getElementById('startBtn');
  const pause  = document.getElementById('pauseBtn');
  const reset  = document.getElementById('resetBtn');
  const chartC = document.getElementById('weeklyChart');
  const ctx    = chartC.getContext('2d');

  let startTime = null, elapsed = 0, tick = null;

  const pad = n => String(n).padStart(2,'0');
  const fmt = ms => {
    const s = Math.floor(ms/1000);
    return `${pad(s/3600|0)} : ${pad((s/60|0)%60)} : ${pad(s%60)}`;
  };

  const KEY = 'hb-practice';
  const today = () => new Date().toISOString().slice(0,10);

  const load = () => JSON.parse(localStorage.getItem(KEY)||'{}');
  const save = d => localStorage.setItem(KEY, JSON.stringify(d));

  function draw() {
    const data = load(), now = new Date(), labels=[], mins=[];
    for (let i=6;i>=0;i--) {
      const d = new Date(now); d.setDate(now.getDate()-i);
      const k = d.toISOString().slice(0,10);
      labels.push(d.toLocaleDateString(undefined,{weekday:'short'}));
      mins.push(Math.round((data[k]||0)/60000));
    }

    ctx.clearRect(0,0,chartC.width,chartC.height);
    const barW = chartC.width/7 - 8, max = Math.max(...mins,1);
    mins.forEach((m,i)=>{
      const h = (m/max)*(chartC.height-25);
      const x = i*(barW+8)+4, y = chartC.height-h-20;
      ctx.fillStyle='rgba(204,0,0,0.85)';
      ctx.fillRect(x,y,barW,h);
      ctx.fillStyle='#fff'; ctx.font='12px Inter'; ctx.textAlign='center';
      ctx.fillText(labels[i],x+barW/2,chartC.height-5);
      if(m) ctx.fillText(m,x+barW/2,y-5);
    });
  }

  function commit(ms){ const d=load(); d[today()]=(d[today()]||0)+ms; save(d); draw(); }

  function render(){ timer.textContent = fmt(elapsed); }

  start.onclick = () => {
    startTime = Date.now()-elapsed;
    tick = setInterval(()=>{ elapsed = Date.now()-startTime; render(); },1000);
    start.disabled=true; pause.disabled=false; reset.disabled=false;
  };
  pause.onclick = () => {
    clearInterval(tick); tick=null;
    commit(elapsed); render();
    start.disabled=false; pause.disabled=true;
  };
  reset.onclick = () => {
    clearInterval(tick); tick=null;
    elapsed=0; render();
    start.disabled=false; pause.disabled=true; reset.disabled=true;
  };

  render(); draw();
})();
