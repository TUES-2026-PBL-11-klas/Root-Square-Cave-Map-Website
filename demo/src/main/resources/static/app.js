// --------------------
// Elements
// --------------------
const layersBtn = document.getElementById("layersBtn");
const filterMenu = document.getElementById("filterMenu");

const loginBtn = document.getElementById("loginBtn");

const openRequestModalBtn = document.getElementById("openRequestModal");
const requestModal = document.getElementById("requestModal");
const closeRequestModalBtn = document.getElementById("closeRequestModal");
const requestForm = document.getElementById("requestForm");

const reqName = document.getElementById("reqName");
const reqEmail = document.getElementById("reqEmail");
const reqText = document.getElementById("reqText");
const requestStatus = document.getElementById("requestStatus");

const toast = document.getElementById("toast");

// Filter panel exists in HTML, but I don’t see a toggle button in your homepage.html.
// We’ll support it safely if you later add a button.
const filterPanel = document.getElementById("filterPanel");
const filterToggleBtn = document.getElementById("filterToggleBtn"); // may be null

// Auth modal
const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModal");

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


// --------------------
// Toast
// --------------------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}


// --------------------
// Menu (☰)
// --------------------
function closeFilterMenu() {
  filterMenu.classList.remove("show");
  filterMenu.setAttribute("aria-hidden", "true");
}

function toggleFilterMenu() {
  const isOpen = filterMenu.classList.toggle("show");
  filterMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

layersBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleFilterMenu();
});


// --------------------
// Filter panel (optional toggle if button exists)
// --------------------
if (filterToggleBtn && filterPanel) {
  filterToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanel.classList.toggle("show");
  });
}


// --------------------
// Request Modal
// --------------------
function openRequestModal() {
  requestModal.classList.add("show");
  requestModal.setAttribute("aria-hidden", "false");
  requestStatus.textContent = "";
  setTimeout(() => reqName.focus(), 0);
}

function closeRequestModal() {
  requestModal.classList.remove("show");
  requestModal.setAttribute("aria-hidden", "true");
}

openRequestModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeFilterMenu();
  openRequestModal();
});

closeRequestModalBtn.addEventListener("click", closeRequestModal);

requestModal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeRequestModal();
});

// Spring Boot endpoint (works when homepage.html is served by Spring)
const REQUEST_API_URL = "/api/request";

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = reqName.value.trim();
  const email = reqEmail.value.trim();
  const requestText = reqText.value.trim();

  if (!name || !email || !requestText) {
    requestStatus.textContent = "Please fill Name, Email, and Request.";
    return;
  }
  if (!isValidEmail(email)) {
    requestStatus.textContent = "Please enter a valid email.";
    return;
  }

  requestStatus.textContent = "Sending...";

  try {
    const res = await fetch(REQUEST_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, request: requestText })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Request API failed:", res.status, errText);
      requestStatus.textContent = "Failed to send. Please try again.";
      return;
    }

    requestStatus.textContent = "";
    reqName.value = "";
    reqEmail.value = "";
    reqText.value = "";
    showToast("Request sent successfully!");
  } catch (err) {
    console.error(err);
    requestStatus.textContent = "Server not reachable. Is Spring Boot running?";
  }
});


// --------------------
// Auth Modal
// --------------------
function openAuthModal() {
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
  // clear status messages
  loginStatus.textContent = "";
  registerStatus.textContent = "";
}

loginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeFilterMenu();
  openAuthModal();
});

closeAuthModalBtn.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", (e) => {
  if (e.target?.dataset?.authClose === "true") closeAuthModal();
});

// Tabs
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginStatus.textContent = "";
  registerStatus.textContent = "";
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  loginStatus.textContent = "";
  registerStatus.textContent = "";
});

// Login validation (demo)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  loginStatus.textContent = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    loginStatus.textContent = "Please fill all fields.";
    return;
  }
  if (!isValidEmail(email)) {
    loginStatus.textContent = "Please enter a valid email.";
    return;
  }
  if (password.length < 6) {
    loginStatus.textContent = "Password must be at least 6 characters.";
    return;
  }

  showToast("Logged in successfully! (demo)");
});

// Register validation (demo)
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  registerStatus.textContent = "";

  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const pass1 = regPassword.value.trim();
  const pass2 = regPassword2.value.trim();

  if (!name || !email || !pass1 || !pass2) {
    registerStatus.textContent = "Please complete all fields.";
    return;
  }
  if (name.length < 2) {
    registerStatus.textContent = "Name is too short.";
    return;
  }
  if (!isValidEmail(email)) {
    registerStatus.textContent = "Invalid email address.";
    return;
  }
  if (pass1.length < 6) {
    registerStatus.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (pass1 !== pass2) {
    registerStatus.textContent = "Passwords do not match.";
    return;
  }

  showToast("Account created successfully! (demo)");
});


// --------------------
// Close on outside click + ESC
// --------------------
document.addEventListener("click", (e) => {
  // close menu if clicked outside
  const clickedMenu = filterMenu.contains(e.target) || layersBtn.contains(e.target);
  if (!clickedMenu) closeFilterMenu();

  // close filter panel if you’re using it + clicked outside
  if (filterPanel && filterPanel.classList.contains("show")) {
    const clickedFilter = filterPanel.contains(e.target) || (filterToggleBtn && filterToggleBtn.contains(e.target));
    if (!clickedFilter) filterPanel.classList.remove("show");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeFilterMenu();
    if (filterPanel) filterPanel.classList.remove("show");
    closeRequestModal();
    closeAuthModal();
  }
});


// --------------------
// Helpers
// --------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}