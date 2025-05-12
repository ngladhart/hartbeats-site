// Nate Gladhart, NAT2036357, 05/10/2025

// validates fields, posts dummy request, gives one‑time coupon
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;                        // wrong page safeguard

  const submitBtn = document.getElementById('submitBtn');
  const error = key => document.querySelector(`.error[data-for="${key}"]`);
  const STORE = 'hb-coupon-claimed';

  // show success immediately if user already claimed
  const claimed = localStorage.getItem(STORE);
  if (claimed) { renderSuccess(claimed); return; }

  const patterns = {
    name:  /^[a-z\s'-]{2,}$/i,
    email: /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i,
    phone: /^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/          // very simple US check
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };
    if (!validate(data)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });

      const code = `HBS-FREE-${Math.floor(1000+Math.random()*9000)}`;
      localStorage.setItem(STORE, code);
      renderSuccess(code);

    } catch {
      alert('Network error – please try again later.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send & Get Coupon';
    }
  });

  // helper functions
  function validate(d){
    let ok = true;
    if(!patterns.name.test(d.name)){ error('name').textContent='Enter at least 2 letters.'; ok=false; }
    if(!patterns.email.test(d.email)){ error('email').textContent='Invalid email.'; ok=false; }
    if(d.phone && !patterns.phone.test(d.phone)){
      error('phone').textContent='Use 555‑123‑4567.'; ok=false;
    }
    if(!d.message){ error('message').textContent='Say hello!'; ok=false; }
    return ok;
  }
  function clearErrors(){ form.querySelectorAll('.error').forEach(el=>el.textContent=''); }

  function renderSuccess(code){
    document.getElementById('contactSection').innerHTML = `
      <div class="success-card">
        <h2>Thank you!</h2>
        <p>Your message is on its way. Bring this coupon to your first lesson:</p>
        <code>${code}</code>
        <p class="smallprint">(One coupon per new student.)</p>
      </div>`;
  }
})();
