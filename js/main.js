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

  // Remove any existing error
  const existing = e.target.querySelector('.inline-error');
  if (existing) existing.remove();

  // Validate
  if (!email || !emailRegex.test(email)) {
    input.style.borderColor = '#DC2626';
    input.placeholder = 'Please enter a valid email address';
    input.style.color = '#DC2626';
    input.value = '';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.color = '';
      input.placeholder = e.target.classList.contains('cta-form')
        ? 'Your email address'
        : 'Enter your email address';
    }, 3000);
    input.focus();
    return;
  }

  // Redirect to onboard with email pre-filled
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

// ── EMAIL PREVIEW CAROUSEL ──
// These are illustrative sample alerts — matching the exact format
// real alerts are generated in (Hi [name], WHAT'S NEW TODAY, UPDATES
// FOR YOUR SCHOOLS, ACTION ITEMS, USEFUL LINKS). Not live data — the
// real Programmes section above pulls that from what we actually
// found today. Links here are only verified official school/JAMB URLs.
const carouselData = [
  {
    label: 'Direct Entry',
    title: 'UniHive Admission Update',
    subtitle: 'Sample alert · Direct Entry profile',
    greeting: 'Hi Ibrahim,',
    whatsNew: "FUKashere's Post-UTME and Direct Entry portal is open for the 2026/2027 session. Registration is active now.",
    schoolUpdate: 'FUKashere — Post-UTME/DE form is live. Upload your WAEC result and JAMB slip before the deadline.',
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
    title: 'UniHive Admission Update',
    subtitle: 'Sample alert · UTME profile',
    greeting: 'Hi TAJUDEEN,',
    whatsNew: 'University of Ibadan has opened its portal for Post-UTME results and released departmental cut-off marks for 2026/2027.',
    schoolUpdate: 'UI Ibadan — check your Post-UTME result and confirm your score meets the cut-off for your course.',
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
    title: 'UniHive Admission Update',
    subtitle: 'Sample alert · Postgraduate profile',
    greeting: 'Hi Ibrahim,',
    whatsNew: 'Obafemi Awolowo University has commenced Direct Entry and postgraduate registration for the 2026/2027 session.',
    schoolUpdate: 'OAU Ile-Ife — registration is open. Confirm your qualifying result meets the entry requirement for your programme.',
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
    title: 'UniHive Admission Update',
    subtitle: 'Sample alert · General profile',
    greeting: 'Hi Ibrahim,',
    whatsNew: 'No new professional certification updates matched your profile today. We check daily and will alert you the moment something opens.',
    schoolUpdate: 'Nothing new for your tracked schools today — monitoring continues.',
    actions: [
      'Keep your JAMB and result documents up to date',
      'Check back here anytime for the latest Programmes updates',
      "You'll get a short check-in every Monday even on quiet weeks",
    ],
    links: [
      { label: 'JAMB Official Portal', url: 'https://jamb.gov.ng' },
    ],
  },
];

let currentSlide = 0;

function buildCarousel() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  wrapper.innerHTML = carouselData.map((slide, i) => `
    <div class="carousel-slide ${i === 0 ? 'active' : ''}">
      <div class="email-card">
        <div class="email-header">
          <h4>${slide.title}</h4>
          <p>${slide.subtitle} · ${dateStr}</p>
        </div>
        <div class="email-body">
          <p style="margin-bottom:10px;font-weight:600;">${slide.greeting}</p>
          <div class="email-section">
            <div class="email-section-title">What's new today</div>
            <p style="font-size:13px;color:#444;line-height:1.6;margin:0 0 12px;">${slide.whatsNew}</p>
          </div>
          <div class="email-section">
            <div class="email-section-title">Updates for your schools</div>
            <p style="font-size:13px;color:#444;line-height:1.6;margin:0 0 12px;">${slide.schoolUpdate}</p>
          </div>
          <div class="email-section">
            <div class="email-section-title">Action items</div>
            ${slide.actions.map(a => `<div class="email-action">${a}</div>`).join('')}
          </div>
          <div class="email-section">
            <div class="email-section-title">Useful links</div>
            ${slide.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="school-link" style="display:block;margin-bottom:4px;">${l.label} →</a>`).join('')}
          </div>
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

// Touch swipe support
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

// Auto advance every 5 seconds
function startAutoplay() {
  setInterval(() => nextSlide(), 5000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setDynamicDate();
  buildCarousel();
  initSwipe();
  startAutoplay();
});