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
// Bottom-right filters panel toggle
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

  // success behavior
  requestStatus.textContent = "";
  reqName.value = "";
  reqEmail.value = "";
  reqText.value = "";

  // show green confirmation bar
  showToast("Request sent successfully!");
});

// --------------------
// Placeholder buttons
// --------------------

document.getElementById("authBtn").addEventListener("click", () => {
  alert("Login / Register clicked (wire to your auth flow).");
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