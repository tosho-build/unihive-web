// ── STATE ──
const state = {
  currentStep: 1,
  firstName: '',
  email: '',
  programmes: [],
  qualification: '',
  region: '',
  schools: [],
  courses: [],
};

// ── UNIVERSITIES BY REGION ──
const UNIVERSITIES = {
  north: [
    'ABU Zaria', 'ATBU Bauchi', 'BUK Kano', 'FUT Minna',
    'FUTY Yola', 'UDUS Sokoto', 'MAUTECH Yola', 'KASU Kaduna',
    'UNIMAID', 'FUD Dutse', 'FUKashere', 'FUBK Kebbi',
    'Nile University Abuja', 'AUN Yola', 'Nasarawa State Uni',
    'Gombe State Uni', 'Plateau State Uni', 'Yobe State Uni',
    'Sokoto State Uni', 'Adamawa State Uni', 'Benue State Uni',
    'Kogi State Uni', 'FU Lokoja', 'FU Lafia', 'Bauchi State Uni',
    'Al-Qalam University Katsina', 'Niger State Uni',
    'Taraba State Uni', 'MAUTECH', 'NDA Kaduna',
  ],
  southwest: [
    'UNILAG', 'UI Ibadan', 'OAU Ile-Ife', 'FUTA Akure',
    'UNILORIN', 'LASU', 'Covenant University', 'Babcock University',
    'Redeemers University', 'Bowen University', 'Lead City University',
    'Lagos State University', 'Ekiti State University',
    'Federal University Oye-Ekiti', 'Ondo State University',
    'Osun State University',
  ],
  southeast: [
    'UNN Nsukka', 'FUTO Owerri', 'ESUT Enugu', 'EBSU Abakaliki',
    'Enugu State University', 'Imo State University',
    'Abia State University', 'Michael Okpara University',
    'Federal University Ndufu-Alike', 'Chukwuemeka Odumegwu Ojukwu University',
    'Renaissance University', 'Caritas University',
  ],
  southsouth: [
    'UNIPORT', 'UNIBEN', 'Rivers State University',
    'DELSU', 'Niger Delta University', 'Ambrose Alli University',
    'Cross River University', 'University of Uyo',
    'Federal University Otuoke', 'Federal University Wukari',
    'Novena University', 'Igbinedion University',
  ],
  any: [
    'ABU Zaria', 'UNILAG', 'UI Ibadan', 'OAU Ile-Ife',
    'UNN Nsukka', 'UNIPORT', 'UNIBEN', 'UNILORIN',
    'BUK Kano', 'ATBU Bauchi', 'FUT Minna', 'FUTA Akure',
    'NOUN', 'Covenant University', 'Babcock University',
    'FUTO Owerri', 'Rivers State University', 'DELSU',
  ],
};

// ── NAVIGATION ──
function goNext(step) {
  if (!validate(step)) return;
  collectData(step);
  if (step === 5) {
    showConfirmation();
    return;
  }
  showStep(step + 1);
}

function goBack(step) {
  showStep(step - 1);
}

function showStep(num) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${num}`).classList.add('active');
  updateProgress(num);
  state.currentStep = num;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PROGRESS ──
function updateProgress(current) {
  document.querySelectorAll('.prog-step').forEach(step => {
    const num = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (num < current) step.classList.add('done');
    else if (num === current) step.classList.add('active');
  });

  for (let i = 1; i <= 4; i++) {
    const line = document.getElementById(`line${i}`);
    if (line) line.classList.toggle('done', i < current);
  }
}

// ── VALIDATION ──
function validate(step) {
  clearErrors();
  let valid = true;

  if (step === 1) {
    const name = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!name) {
      showError('firstNameError', 'Please enter your first name');
      valid = false;
    }
    if (!email || !isValidEmail(email)) {
      showError('emailError', 'Please enter a valid email address');
      valid = false;
    }
  }

  if (step === 2) {
    if (state.programmes.length === 0) {
      showError('programmeError', 'Please select at least one programme');
      valid = false;
    }
  }

  if (step === 3) {
    if (!state.qualification) {
      showError('qualError', 'Please select your qualification');
      valid = false;
    }
  }

if (step === 4) {
  if (!state.region) {
    showError('regionError', 'Please select your preferred region');
    valid = false;
  }
}

  if (step === 5) {
    if (state.courses.length === 0) {
      showError('coursesError', 'Please select at least one course');
      valid = false;
    }
  }

  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

// ── COLLECT DATA ──
function collectData(step) {
  if (step === 1) {
    state.firstName = document.getElementById('firstName').value.trim();
    state.email = document.getElementById('email').value.trim();
  }
}

// ── OPTION SELECTION ──
function toggleOption(card, group) {
  card.classList.toggle('selected');
  const value = card.dataset.value;

  if (group === 'programme') {
    if (card.classList.contains('selected')) {
      if (!state.programmes.includes(value)) state.programmes.push(value);
    } else {
      state.programmes = state.programmes.filter(v => v !== value);
    }
  }
}

function selectSingle(card, group) {
  const parent = card.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  if (group === 'qual') state.qualification = card.dataset.value;
  if (group === 'region') state.region = card.dataset.value;
}

function selectRegion(card) {
  // Select the region card
  const parent = card.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.region = card.dataset.value;
  state.schools = [];

  // Build school tags for selected region
  const wrap = document.getElementById('schoolsWrap');
  const tagsContainer = document.getElementById('schoolTags');
  const schools = UNIVERSITIES[state.region] || [];

  tagsContainer.innerHTML = schools.map(school => `
    <span class="course-tag school-tag"
          data-value="${school}"
          onclick="toggleSchool(this)">
      ${school}
    </span>
  `).join('');

  // Slide in schools
  wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleSchool(tag) {
  tag.classList.toggle('selected');
  const value = tag.dataset.value;
  if (!state.schools) state.schools = [];

  if (tag.classList.contains('selected')) {
    if (!state.schools.includes(value)) state.schools.push(value);
  } else {
    state.schools = state.schools.filter(v => v !== value);
  }
}

// ── COURSE TAGS ──
function toggleCourse(tag) {
  tag.classList.toggle('selected');
  const value = tag.dataset.value;

  if (tag.classList.contains('selected')) {
    if (!state.courses.includes(value)) state.courses.push(value);
  } else {
    state.courses = state.courses.filter(v => v !== value);
  }

  updateCourseCount();
}

function updateCourseCount() {
  const wrap = document.getElementById('selectedCoursesWrap');
  const count = document.getElementById('selectedCount');
  if (state.courses.length > 0) {
    wrap.style.display = 'block';
    count.textContent = state.courses.length;
  } else {
    wrap.style.display = 'none';
  }
}

function filterCourses(query) {
  const tags = document.querySelectorAll('.course-tag');
  const q = query.toLowerCase().trim();
  tags.forEach(tag => {
    const text = tag.textContent.toLowerCase();
    tag.classList.toggle('hidden', q !== '' && !text.includes(q));
  });
}

// ── CONFIRMATION ──
function showConfirmation() {
  const programmeLabels = {
    utme: 'UTME / Post-UTME',
    de: 'Direct Entry',
    pg: 'Postgraduate',
    prof: 'Professional Certificate',
  };

  const qualLabels = {
    waec: 'WAEC / NECO / NABTEB',
    ond: 'OND',
    hnd: 'HND',
    nce: 'NCE',
    ijmb: 'IJMB / JUPEB',
    alevel: 'Cambridge A-Levels / IB',
    degree: 'First Degree',
    other: 'Other',
  };

  const regionLabels = {
    north: 'Northern Nigeria',
    southwest: 'South-West',
    southeast: 'South-East',
    southsouth: 'South-South',
    any: 'Open to any region',
  };

  const programmes = state.programmes.map(p => programmeLabels[p] || p).join(', ');
  const qual = qualLabels[state.qualification] || state.qualification;
  const region = regionLabels[state.region] || state.region;

  const courseNames = document.querySelectorAll('.course-tag.selected');
  const coursesText = Array.from(courseNames).map(t => t.textContent).join(', ');

  document.getElementById('confirmSummary').innerHTML = `
    <div class="confirm-row">
      <span class="confirm-row-label">Name</span>
      <span class="confirm-row-value">${state.firstName}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-row-label">Programme</span>
      <span class="confirm-row-value">${programmes}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-row-label">Qualification</span>
      <span class="confirm-row-value">${qual}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-row-label">Region</span>
      <span class="confirm-row-value">${region}</span>
    </div>
    <div class="confirm-row">
  <span class="confirm-row-label">Universities</span>
  <span class="confirm-row-value">${state.schools.length > 0 ? state.schools.join(', ') : 'All in selected region'}</span>
</div>
    <div class="confirm-row">
      <span class="confirm-row-label">Courses</span>
      <span class="confirm-row-value">${coursesText || 'None selected'}</span>
    </div>
  `;

  document.getElementById('confirmEmail').textContent = state.email;

  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.prog-step').forEach(s => s.classList.add('done'));
  document.querySelectorAll('.prog-line').forEach(l => l.classList.add('done'));
  document.getElementById('stepConfirm').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Save to localStorage for now
localStorage.setItem('unihive_user', JSON.stringify({
  name: state.firstName,
  email: state.email,
  programmes: state.programmes,
  qualification: state.qualification,
  region: state.region,
  schools: state.schools,
  courses: state.courses,
  signedUp: new Date().toISOString(),
}));
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  updateProgress(1);

  // Pre-fill email from landing page
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  if (email) {
    document.getElementById('email').value = email;
  }
});