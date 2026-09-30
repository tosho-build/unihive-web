// ── DYNAMIC DATE ──
function setDynamicDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = now.toLocaleDateString('en-NG', options);
  const shortDate = now.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

  document.querySelectorAll('.dynamic-date').forEach(el => el.textContent = formatted);
  document.querySelectorAll('.dynamic-date-short').forEach(el => el.textContent = shortDate);
}

// ── NAVBAR HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── PROGRAMME TABS ──
function switchTab(tab) {
  const tabs = ['de', 'utme', 'pg', 'prof'];
  document.querySelectorAll('.prog-tab').forEach((t, i) => {
    t.classList.toggle('active', tabs[i] === tab);
  });
  document.querySelectorAll('.prog-content').forEach(c => {
    c.classList.remove('active');
  });
  document.getElementById('tab-' + tab).classList.add('active');
}

// ── FAQ ACCORDION ──
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ── EMAIL SIGNUP ──
function handleSignup(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn = e.target.querySelector('button');
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const existing = e.target.querySelector('.inline-error');
  if (existing) existing.remove();

  const isCtaForm = e.target.classList.contains('cta-form');

  if (!email || !emailRegex.test(email)) {
    input.style.borderColor = '#DC2626';
    input.placeholder = 'Please enter a valid email address';
    input.style.color = '#DC2626';
    if (isCtaForm) input.style.fontSize = '12px';
    input.value = '';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.color = '';
      if (isCtaForm) input.style.fontSize = '';
      input.placeholder = isCtaForm
        ? 'Your email address'
        : 'Enter your email address';
    }, 3000);
    input.focus();
    return;
  }

  window.location.href = `./onboard.html?email=${encodeURIComponent(email)}`;
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── NAVBAR SCROLL SHADOW ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.08)' : 'none';
});

// ── EMAIL PREVIEW DATA ──
// Illustrative previews matching the exact format real alerts are
// generated in. Links are verified official school and JAMB URLs.
const carouselData = [
  {
    label: 'Direct Entry',
    whatsNew: "FUKashere's Post-UTME and Direct Entry portal is open for the 2026/2027 session. Registration is active now.",
    schoolUpdate: 'FUKashere: Post-UTME/DE form is live. Upload your WAEC result and JAMB slip before the deadline.',
    actions: [
      'Register on the FUKashere portal before the deadline',
      'Upload your WAEC result to JAMB CAPS now',
      'Keep your birth certificate ready for document upload',
    ],
    links: [
      { label: 'FUKashere Portal', url: 'https://fukashere.edu.ng' },
      { label: 'JAMB Official Portal', url: 'https://jamb.gov.ng' },
    ],
  },
  {
    label: 'UTME / Post-UTME',
    whatsNew: 'University of Ibadan has opened its portal for Post-UTME results and released departmental cut-off marks for 2026/2027.',
    schoolUpdate: 'UI Ibadan: check your Post-UTME result and confirm your score meets the cut-off for your course.',
    actions: [
      "Check UI Ibadan's portal for your Post-UTME result",
      'Confirm your score against the released cut-off mark',
      'Prepare required documents for screening',
    ],
    links: [
      { label: 'University of Ibadan Portal', url: 'https://ui.edu.ng' },
      { label: 'JAMB Official Portal', url: 'https://jamb.gov.ng' },
    ],
  },
  {
    label: 'Postgraduate',
    whatsNew: 'Obafemi Awolowo University has commenced Direct Entry and postgraduate registration for the 2026/2027 session.',
    schoolUpdate: 'OAU Ile-Ife: registration is open. Confirm your qualifying result meets the entry requirement for your programme.',
    actions: [
      'Complete your OAU registration before the deadline',
      'Confirm your result meets the minimum requirement',
      'Prepare your transcript and supporting documents',
    ],
    links: [
      { label: 'OAU Official Portal', url: 'https://oauife.edu.ng' },
      { label: 'JAMB Official Portal', url: 'https://jamb.gov.ng' },
    ],
  },
  {
    label: 'Professional',
    whatsNew: 'No new professional certification updates matched your profile today. We check daily and will alert you the moment something opens.',
    schoolUpdate: 'Nothing new for your tracked schools today. Monitoring continues.',
    actions: [
      'Keep your JAMB and result documents up to date',
      'Check the Programmes section anytime for the latest updates',
      "You'll get a short check in every Monday even on quiet weeks",
    ],
    links: [
      { label: 'JAMB Official Portal', url: 'https://jamb.gov.ng' },
    ],
  },
];

// ── "WHAT YOU GET" CAROUSEL ──
let currentSlide = 0;

function buildCarousel() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  wrapper.innerHTML = carouselData.map((slide, i) => `
    <div class="carousel-slide ${i === 0 ? 'active' : ''}">
      <div class="email-card" style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <div style="background:#1B4332;padding:16px 22px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#fff;font-weight:700;font-size:15px;">UniHive 🎓</span>
            <span style="color:rgba(255,255,255,0.55);font-size:10px;text-transform:uppercase;letter-spacing:0.04em;">Preview</span>
          </div>
          <div style="color:rgba(255,255,255,0.55);font-size:11px;margin-top:4px;">Admission Alert &middot; ${dateStr}</div>
        </div>
        <div style="padding:16px 22px 22px;font-size:13px;line-height:1.8;color:#333;">
          <p style="margin:0 0 10px;font-weight:600;">Hi Ibrahim,</p>
          <p style="margin:0 0 4px;font-weight:600;color:#1B4332;">What's new today</p>
          <p style="margin:0 0 12px;">${slide.whatsNew}</p>
          <p style="margin:0 0 4px;font-weight:600;color:#1B4332;">Updates for your schools</p>
          <p style="margin:0 0 12px;">${slide.schoolUpdate}</p>
          <p style="margin:0 0 4px;font-weight:600;color:#1B4332;">Action items</p>
          <p style="margin:0 0 12px;">${slide.actions.map(a => `- ${a}`).join('<br>')}</p>
          <p style="margin:0 0 4px;font-weight:600;color:#1B4332;">Useful links</p>
          <p style="margin:0;">${slide.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" style="color:#1B4332;font-weight:600;text-decoration:none;">${l.label} →</a>`).join('<br>')}</p>
        </div>
      </div>
    </div>
  `).join('');

  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + carouselData.length) % carouselData.length;
  slides[currentSlide].classList.add('active');
  updateDots();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

let touchStartX = 0;
function initSwipe() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  wrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
  });
}

function startAutoplay() {
  setInterval(() => nextSlide(), 5000);
}

// ── HERO PREVIEW (desktop only, decorative, auto-cycling) ──
let heroSlide = 0;

function buildHeroPreview() {
  const wrapper = document.getElementById('heroCarouselWrapper');
  if (!wrapper) return;
  renderHeroSlide();
}

function renderHeroSlide() {
  const wrapper = document.getElementById('heroCarouselWrapper');
  if (!wrapper) return;
  const slide = carouselData[heroSlide];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  wrapper.innerHTML = `
    <div class="hero-email-card">
      <div class="hero-email-header">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="brand">UniHive 🎓</span>
          <span style="color:rgba(255,255,255,0.5);font-size:10px;text-transform:uppercase;letter-spacing:0.04em;">Preview</span>
        </div>
        <div class="sub">Admission Alert &middot; ${dateStr}</div>
      </div>
      <div class="hero-email-body">
        <div class="greet">Hi Ibrahim,</div>
        <div class="label">What's new today</div>
        <div class="val">${slide.whatsNew}</div>
        <div class="label">Updates for your schools</div>
        <div class="val">${slide.schoolUpdate}</div>
        <div class="label">Action items</div>
        <div class="val">${slide.actions.map(a => `- ${a}`).join('<br>')}</div>
        <div class="label">Useful links</div>
        <div class="val" style="margin-bottom:0;">${slide.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" style="color:#1B4332;font-weight:600;text-decoration:none;">${l.label} →</a>`).join('<br>')}</div>
      </div>
    </div>
  `;
}

function advanceHeroSlide() {
  heroSlide = (heroSlide + 1) % carouselData.length;
  renderHeroSlide();
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setDynamicDate();
  buildCarousel();
  buildHeroPreview();
  initSwipe();
  startAutoplay();
  setInterval(advanceHeroSlide, 4500);
});