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

// Close modal when clicking backdrop
requestModal.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "true") {
    closeRequestModal();
  }
});

// ⭐ UPDATE THIS: send to Spring Boot instead of fake success
// If your backend is on a different port, change it here:
const REQUEST_API_URL = "http://localhost:8080/api/request";

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = reqName.value.trim();
  const email = reqEmail.value.trim();
  const requestText = reqText.value.trim();

  if (!name || !email || !requestText) {
    requestStatus.textContent = "Please fill Name, Email, and Request.";
    return;
  }

  requestStatus.textContent = "Sending...";

  try {
    const res = await fetch(REQUEST_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        request: requestText
      })
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("Request failed:", res.status, errorBody);
      requestStatus.textContent = "Failed to send. Please try again.";
      return;
    }

    // success: clear + toast, keep popup open
    requestStatus.textContent = "";
    reqName.value = "";
    reqEmail.value = "";
    reqText.value = "";
    showToast("Request sent successfully!");
  } catch (err) {
    console.error(err);
    requestStatus.textContent = "Server not reachable (is Spring Boot running?).";
  }
});


// --------------------
// Login / Register button (fix bug)
// --------------------
// You have loginBtn in HTML, not authBtn.
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", () => {
  // For now placeholder (until you add auth modal)
  showToast("Login/Register popup coming next 🙂");
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