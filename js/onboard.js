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

// ── UNIVERSITIES ──
let allUniversities = {};

async function loadUniversities() {
  try {
    const res = await fetch('data/universities.json');
    allUniversities = await res.json();
  } catch (e) {
    console.error('Could not load universities:', e);
  }
}

function selectRegion(card) {
  const parent = card.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.region = card.dataset.value;
  state.schools = [];

  const regionData = allUniversities[state.region];
  if (!regionData) return;

  let schools = [];
  if (state.region === 'any') {
    schools = regionData.featured;
  } else {
    Object.values(regionData.subregions).forEach(sub => {
      schools = schools.concat(sub.schools);
    });
  }

  const wrap = document.getElementById('schoolsWrap');
  const tagsContainer = document.getElementById('schoolTags');
  const searchBox = document.getElementById('schoolSearch');

  tagsContainer.innerHTML = schools.map(s => `
    <span class="course-tag school-tag"
          data-value="${s.short}"
          data-fullname="${s.name}"
          data-state="${s.state}"
          data-type="${s.type}"
          onclick="toggleSchool(this)">
      ${s.short} <small>${s.state}</small>
    </span>
  `).join('');

  if (searchBox) {
    searchBox.value = '';
    searchBox.oninput = () => filterSchools(searchBox.value, schools);
  }

  wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function filterSchools(query, allSchools) {
  const q = query.toLowerCase().trim();
  const tagsContainer = document.getElementById('schoolTags');
  if (!q) {
    tagsContainer.querySelectorAll('.school-tag').forEach(t => t.style.display = 'inline-flex');
    return;
  }
  tagsContainer.querySelectorAll('.school-tag').forEach(tag => {
    const name = (tag.dataset.fullname || '').toLowerCase();
    const short = (tag.dataset.value || '').toLowerCase();
    const st = (tag.dataset.state || '').toLowerCase();
    tag.style.display = (name.includes(q) || short.includes(q) || st.includes(q)) ? 'inline-flex' : 'none';
  });
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

// ── COURSES ──
let allCourses = [];
let featuredCourses = [];

async function loadCourses() {
  try {
    const res = await fetch('data/courses.json');
    const data = await res.json();
    allCourses = data.all;
    featuredCourses = data.featured;
    renderCourseTags(featuredCourses);
  } catch (e) {
    console.error('Could not load courses:', e);
  }
}

function renderCourseTags(courses) {
  const container = document.getElementById('courseTags');
  if (!container) return;
  container.innerHTML = courses.map(course => `
    <span class="course-tag ${state.courses.includes(course) ? 'selected' : ''}"
          data-value="${course}"
          onclick="toggleCourse(this)">
      ${course}
    </span>
  `).join('');
}

function filterCourses(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    renderCourseTags(featuredCourses);
    document.getElementById('customCourseWrap').style.display = 'none';
    return;
  }
  const matches = allCourses.filter(c => c.toLowerCase().includes(q));
  if (matches.length > 0) {
    renderCourseTags(matches.slice(0, 20));
    document.getElementById('customCourseWrap').style.display = 'none';
  } else {
    renderCourseTags([]);
    const wrap = document.getElementById('customCourseWrap');
    wrap.style.display = 'block';
    document.getElementById('customCourseText').textContent = `Add "${query}" as your course`;
    wrap.onclick = () => addCustomCourse(query);
  }
}

function addCustomCourse(course) {
  const formatted = course.trim();
  if (!state.courses.includes(formatted)) {
    state.courses.push(formatted);
  }
  updateCourseCount();
  const wrap = document.getElementById('customCourseWrap');
  wrap.innerHTML = `<span class="custom-added">✓ "${formatted}" added</span>`;
  document.getElementById('courseSearch').value = '';
  setTimeout(() => {
    renderCourseTags(featuredCourses);
    wrap.style.display = 'none';
  }, 1500);
}

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
    if (!name) { showError('firstNameError', 'Please enter your first name'); valid = false; }
    if (!email || !isValidEmail(email)) { showError('emailError', 'Please enter a valid email address'); valid = false; }
  }
  if (step === 2) {
    if (state.programmes.length === 0) { showError('programmeError', 'Please select at least one programme'); valid = false; }
  }
  if (step === 3) {
    if (!state.qualification) { showError('qualError', 'Please select your qualification'); valid = false; }
  }
  if (step === 4) {
    if (!state.region) { showError('regionError', 'Please select your preferred region'); valid = false; }
  }
  if (step === 5) {
    if (state.courses.length === 0) { showError('coursesError', 'Please select at least one course'); valid = false; }
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

  // ✅ Read directly from state — not from DOM
  const coursesText = state.courses.join(', ');

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
  loadUniversities();
  loadCourses();

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  if (email) {
    document.getElementById('email').value = email;
  }
});