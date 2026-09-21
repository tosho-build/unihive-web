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
  const email = input.value;

  const emails = JSON.parse(localStorage.getItem('unihive_signups') || '[]');
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem('unihive_signups', JSON.stringify(emails));
  }

  btn.textContent = "You're on the list!";
  btn.style.background = '#16A34A';
  btn.style.color = 'white';
  input.value = '';
  input.placeholder = "We'll be in touch soon";

  setTimeout(() => {
    btn.textContent = 'Join the Hive';
    btn.style.background = '';
    btn.style.color = '';
    input.placeholder = 'Enter your email address';
  }, 4000);
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
const carouselData = [
  {
    label: 'Direct Entry',
    title: 'UniHive — DE Admission Update',
    region: 'Northern Nigeria focus',
    updates: [
      { name: 'ABU Zaria · Portal open', info: 'Computer Science · Lower Credit min · Fee: ₦2,000 · Deadline: Oct 30' },
      { name: 'ATBU Bauchi · Portal open', info: 'Computer Engineering, IT · JAMB min: 180 · Fee: ₦2,000' },
      { name: 'BUK Kano · Portal open', info: 'Cybersecurity, CS · Upper Credit · JAMB min: 200' },
    ],
    actions: [
      'Visit ABU portal — deadline is Oct 30, apply now',
      'Confirm JAMB DE profile is active at jamb.gov.ng',
      'Request HND transcript from your polytechnic',
    ]
  },
  {
    label: 'UTME / Post-UTME',
    title: 'UniHive — Post-UTME Update',
    region: 'All regions · UTME focus',
    updates: [
      { name: 'UNILORIN · Post-UTME open', info: 'Cut-off: 200 · Screening ongoing · Fee: ₦2,500' },
      { name: 'Nasarawa State Uni · Forms out', info: 'Registration open · Deadline: Nov 15' },
      { name: 'Gombe State Uni · Supplementary', info: 'Second batch admission still open' },
    ],
    actions: [
      'Check UNILORIN portal for your screening date',
      'Upload O\'Level results to JAMB CAPS immediately',
      'Monitor your JAMB admission status on CAPS',
    ]
  },
  {
    label: 'Postgraduate',
    title: 'UniHive — PG Admission Update',
    region: 'Federal universities · PG focus',
    updates: [
      { name: 'ABU Zaria · MSc CS open', info: 'Min: Second Class Lower · Application fee: ₦10,000' },
      { name: 'UI Ibadan · MBA intake', info: '2026/2027 session · Closing soon' },
      { name: 'UNN · PhD Engineering', info: 'Research positions available · Supervisor matching open' },
    ],
    actions: [
      'Submit ABU PG form before deadline closes',
      'Contact potential supervisors at UNN this week',
      'Prepare your statement of purpose document',
    ]
  },
  {
    label: 'Professional',
    title: 'UniHive — Professional Cert Update',
    region: 'Nationwide · All programmes',
    updates: [
      { name: 'ICAN · November Diet open', info: 'Skills level registration · Exam: November 2026' },
      { name: 'NIM Certificate · New intake', info: 'Management certification · 6 months · Nationwide' },
      { name: 'CIPM · Registration open', info: 'Professional HR certification · Online available' },
    ],
    actions: [
      'Register for ICAN November diet before window closes',
      'Download NIM course outline and fee structure',
      'Check CIPM online study option for flexibility',
    ]
  }
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
          <p>${dateStr} · ${slide.region}</p>
        </div>
        <div class="email-body">
          <div class="email-section">
            <div class="email-section-title">University updates</div>
            ${slide.updates.map(u => `
              <div class="email-school">
                <div class="email-school-name">${u.name}</div>
                <div class="email-school-info">${u.info}</div>
              </div>
            `).join('')}
          </div>
          <div class="email-section">
            <div class="email-section-title">Action items for today</div>
            ${slide.actions.map(a => `<div class="email-action">${a}</div>`).join('')}
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