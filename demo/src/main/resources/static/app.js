// --------------------
// Zoom controls (mock)
// --------------------
let zoom = 1000;
const scaleText = document.querySelector(".scale");

document.getElementById("zoomIn").addEventListener("click", () => {
  zoom -= 100;
  if (zoom < 100) zoom = 100;
  scaleText.textContent = "Scale 1:" + zoom;
});

document.getElementById("zoomOut").addEventListener("click", () => {
  zoom += 100;
  scaleText.textContent = "Scale 1:" + zoom;
});


// --------------------
// Bottom-right filter panel toggle
// --------------------
const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterPanel = document.getElementById("filterPanel");

filterToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterPanel.classList.toggle("show");
});


// --------------------
// Search (mock behavior)
// --------------------
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();

  if (!val) {
    results.innerHTML = "<div>No recent searches</div>";
    return;
  }

  results.innerHTML = `
    <div>Searching for "<b>${escapeHtml(val)}</b>"</div>
    <div>Parcel #1023</div>
    <div>Forest area</div>
    <div>Building permit</div>
  `;
});


// --------------------
// Top-left menu toggle
// --------------------
const layersBtn = document.getElementById("layersBtn");
const filterMenu = document.getElementById("filterMenu");

function closeFilterMenu(){
  filterMenu.classList.remove("show");
  filterMenu.setAttribute("aria-hidden", "true");
}

function toggleFilterMenu(){
  const isOpen = filterMenu.classList.toggle("show");
  filterMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

layersBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleFilterMenu();
});


// --------------------
// Request Modal
// --------------------
const openRequestModalBtn = document.getElementById("openRequestModal");
const requestModal = document.getElementById("requestModal");
const closeRequestModalBtn = document.getElementById("closeRequestModal");
const requestForm = document.getElementById("requestForm");

const reqName = document.getElementById("reqName");
const reqEmail = document.getElementById("reqEmail");
const reqText = document.getElementById("reqText");
const requestStatus = document.getElementById("requestStatus");

function openRequestModal(){
  requestModal.classList.add("show");
  requestModal.setAttribute("aria-hidden", "false");
  requestStatus.textContent = "";
  setTimeout(() => reqName.focus(), 0);
}

function closeRequestModal(){
  requestModal.classList.remove("show");
  requestModal.setAttribute("aria-hidden", "true");
}

openRequestModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeFilterMenu();
  openRequestModal();
});

closeRequestModalBtn.addEventListener("click", closeRequestModal);

// close on backdrop
requestModal.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "true") {
    closeRequestModal();
  }
});


// --------------------
// Toast
// --------------------
const toast = document.getElementById("toast");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = reqName.value.trim();
  const email = reqEmail.value.trim();
  const text = reqText.value.trim();

  if (!name || !email || !text) {
    requestStatus.textContent = "Please fill Name, Email, and Request.";
    return;
  }

  requestStatus.textContent = "";
  reqName.value = "";
  reqEmail.value = "";
  reqText.value = "";

  showToast("Request sent successfully!");
});


// --------------------
// AUTH MODAL
// --------------------
const loginBtn = document.getElementById("loginBtn");
const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginStatus = document.getElementById("loginStatus");
const registerStatus = document.getElementById("registerStatus");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regPassword2 = document.getElementById("regPassword2");

function openAuthModal(){
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden","false");
}

function closeAuth(){
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden","true");
}

loginBtn.addEventListener("click",(e)=>{
  e.stopPropagation();
  closeFilterMenu();
  openAuthModal();
});

closeAuthModal.addEventListener("click",closeAuth);

// click outside
authModal.addEventListener("click",(e)=>{
  if(e.target.dataset.authClose === "true") closeAuth();
});

// tab switching
loginTab.addEventListener("click",()=>{
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

registerTab.addEventListener("click",()=>{
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// fake submit for now
loginForm.addEventListener("submit",(e)=>{
  e.preventDefault();

  loginStatus.textContent = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if(!email || !password){
    loginStatus.textContent = "Please fill all fields.";
    return;
  }

  if(!isValidEmail(email)){
    loginStatus.textContent = "Please enter a valid email.";
    return;
  }

  if(password.length < 6){
    loginStatus.textContent = "Password must be at least 6 characters.";
    return;
  }

  // success demo
  showToast("Logged in successfully!");
});

registerForm.addEventListener("submit",(e)=>{
  e.preventDefault();

  registerStatus.textContent = "";

  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const pass1 = regPassword.value.trim();
  const pass2 = regPassword2.value.trim();

  if(!name || !email || !pass1 || !pass2){
    registerStatus.textContent = "Please complete all fields.";
    return;
  }

  if(name.length < 2){
    registerStatus.textContent = "Name is too short.";
    return;
  }

  if(!isValidEmail(email)){
    registerStatus.textContent = "Invalid email address.";
    return;
  }

  if(pass1.length < 6){
    registerStatus.textContent = "Password must be at least 6 characters.";
    return;
  }

  if(pass1 !== pass2){
    registerStatus.textContent = "Passwords do not match.";
    return;
  }

  // success demo
  showToast("Account created successfully!");
});


// --------------------
// Close menus on outside click + ESC
// --------------------
document.addEventListener("click", (e) => {
  const clickedInsideFilterMenu = filterMenu.contains(e.target) || layersBtn.contains(e.target);
  if (!clickedInsideFilterMenu) closeFilterMenu();

  const clickedInsideFilter = filterPanel.contains(e.target) || filterToggleBtn.contains(e.target);
  if (!clickedInsideFilter) filterPanel.classList.remove("show");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeFilterMenu();
    filterPanel.classList.remove("show");
    closeRequestModal();
    closeAuth();
  }
});


// --------------------
// Helpers
// --------------------
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }