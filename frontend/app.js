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
// Bottom-right layers panel toggle
// --------------------
const filterBtn = document.getElementById("filterBtn");
const legendPanel = document.getElementById("legendPanel");

filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  legendPanel.classList.toggle("show");
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
  // focus first field
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

// Close modal when clicking backdrop
requestModal.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "true") {
    closeRequestModal();
  }
});

// Submit handler (mock)
requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = reqName.value.trim();
  const email = reqEmail.value.trim();
  const text = reqText.value.trim();

  if (!name || !email || !text) {
    requestStatus.textContent = "Please fill Name, Email, and Request.";
    return;
  }

  // Mock success
  requestStatus.textContent = "Sent! (hook this to your backend)";
  reqName.value = "";
  reqEmail.value = "";
  reqText.value = "";

  // optional auto-close after a moment (comment out if you don’t want this)
  setTimeout(() => closeRequestModal(), 700);
});


// --------------------
// Placeholder buttons
// --------------------
document.getElementById("loginBtn").addEventListener("click", () => {
  alert("Login clicked (wire to your auth flow).");
});

document.getElementById("registerBtn").addEventListener("click", () => {
  alert("Register clicked (wire to your register flow).");
});


// --------------------
// Close menus on outside click + ESC
// --------------------
document.addEventListener("click", (e) => {
  const clickedInsideFilterMenu = filterMenu.contains(e.target) || layersBtn.contains(e.target);
  if (!clickedInsideFilterMenu) closeFilterMenu();

  const clickedInsideLegend = legendPanel.contains(e.target) || filterBtn.contains(e.target);
  if (!clickedInsideLegend) legendPanel.classList.remove("show");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeFilterMenu();
    legendPanel.classList.remove("show");
    closeRequestModal();
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