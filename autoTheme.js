// Auto Theme Mode Controller
let autoThemeBtn = document.getElementById('auto-theme-mode');
let autoThemeBtnThumb = autoThemeBtn.querySelector('.thumb');

// Dropdown + inputs
const autoThemeChevronBtn = document.getElementById('auto-theme-chevron');
const autoThemeDropdown = document.getElementById('auto-theme-dropdown');
const autoThemeFromInput = document.getElementById('auto-theme-from');
const autoThemeToInput = document.getElementById('auto-theme-to');
const autoThemeDesc = document.getElementById('auto-theme-desc');

const AUTO_MODE_KEY = "autoThemeMode"; // "enable" | "disable"
const AUTO_FROM_KEY = "autoThemeFrom"; // e.g. "20:00"
const AUTO_TO_KEY = "autoThemeTo";     // e.g. "09:00"

// Global variable to track the auto theme interval
let autoThemeInterval = null;

function getStoredTimes() {
      const from = localStorage.getItem(AUTO_FROM_KEY) || "20:00"; // 8 PM
      const to = localStorage.getItem(AUTO_TO_KEY) || "09:00";     // 9 AM
      return { from, to };
}

function setStoredTimes(from, to) {
      localStorage.setItem(AUTO_FROM_KEY, from);
      localStorage.setItem(AUTO_TO_KEY, to);
}

function toMinutes(hhmm) {
      const [h, m] = hhmm.split(":").map(Number);
      return h * 60 + m;
}

function format12h(hhmm) {
      let [h, m] = hhmm.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      const mm = String(m).padStart(2, "0");
      return `${h}:${mm} ${ampm}`;
}

function updateAutoThemeDescription() {
      const { from, to } = getStoredTimes();
      if (autoThemeDesc) {
            autoThemeDesc.textContent = `Dark Mode active from ${format12h(from)} to ${format12h(to)}`;
      }
}

function setInputsDisabled(disabled) {
      if (!autoThemeFromInput || !autoThemeToInput) return;
      autoThemeFromInput.disabled = disabled;
      autoThemeToInput.disabled = disabled;
}

function setInputsFromStorage() {
      const { from, to } = getStoredTimes();
      if (autoThemeFromInput) autoThemeFromInput.value = from;
      if (autoThemeToInput) autoThemeToInput.value = to;
}

function initAutoTheme() {
      const autoThemeMode = localStorage.getItem(AUTO_MODE_KEY) || "disable";
      setAutoThemeMode(autoThemeMode === "enable");

      // Initialize inputs and description
      setInputsFromStorage();
      updateAutoThemeDescription();

      // Attach chevron toggle
      if (autoThemeChevronBtn && autoThemeDropdown) {
            autoThemeChevronBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  const isOpen = autoThemeDropdown.classList.toggle('open');
                  autoThemeDropdown.setAttribute('aria-hidden', String(!isOpen));
                  autoThemeChevronBtn.classList.toggle('rotated', isOpen);
            });
      }

      // Time input handlers
      if (autoThemeFromInput) {
            autoThemeFromInput.addEventListener('change', () => {
                  const enabled = (localStorage.getItem(AUTO_MODE_KEY) || "disable") === "enable";
                  if (enabled) return; // editing not allowed
                  const from = autoThemeFromInput.value || "20:00";
                  const { to } = getStoredTimes();
                  setStoredTimes(from, to);
                  updateAutoThemeDescription();
            });
      }

      if (autoThemeToInput) {
            autoThemeToInput.addEventListener('change', () => {
                  const enabled = (localStorage.getItem(AUTO_MODE_KEY) || "disable") === "enable";
                  if (enabled) return; // editing not allowed
                  const to = autoThemeToInput.value || "09:00";
                  const { from } = getStoredTimes();
                  setStoredTimes(from, to);
                  updateAutoThemeDescription();
            });
      }

      if (autoThemeMode === "enable") {
            checkTimeAndSetTheme();
            // Clear any existing interval before creating a new one
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
            }
            // Check every minute for time-based theme changes
            autoThemeInterval = setInterval(checkTimeAndSetTheme, 60000);
      } else {
            // Clear the interval when auto mode is disabled
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
                  autoThemeInterval = null;
            }
      }
}

function toggleAutoThemeMode() {
      const currentMode = localStorage.getItem(AUTO_MODE_KEY) || "disable";
      const newMode = currentMode === "enable" ? "disable" : "enable";

      localStorage.setItem(AUTO_MODE_KEY, newMode);
      setAutoThemeMode(newMode === "enable");

      if (newMode === "enable") {
            checkTimeAndSetTheme();
            // Clear any existing interval before creating a new one
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
            }
            // Start the auto theme interval
            autoThemeInterval = setInterval(checkTimeAndSetTheme, 60000);
      } else {
            // Clear the interval when auto mode is disabled
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
                  autoThemeInterval = null;
            }
      }
}

function setAutoThemeMode(enabled) {
      if (enabled) {
            autoThemeBtnThumb.classList.add("switch-on");
            // autoThemeBtn.style.backgroundColor = "#1070d1";
            autoThemeBtn.style.backgroundColor = $accentColor;
            setInputsDisabled(true);
      } else {
            autoThemeBtnThumb.classList.remove("switch-on");
            autoThemeBtn.style.backgroundColor = "";
            setInputsDisabled(false);
            // Clear the interval when disabling auto theme
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
                  autoThemeInterval = null;
            }
      }
      updateAutoThemeDescription();
}

// Function to stop auto theme mode completely
function stopAutoThemeMode() {
      // Only notify and process if it was actually enabled
      if (localStorage.getItem(AUTO_MODE_KEY) === "enable") {
            if (typeof throwMessage === 'function') {
                  // throwMessage("Auto Theme Mode Disabled", "#ffffffff", "moon-outline");
                  throwMessage("Theme Updated", "#ffffffff", "moon-outline", "Auto Theme Mode Disabled");
            }

            localStorage.setItem(AUTO_MODE_KEY, "disable");
            setAutoThemeMode(false);
            // Clear the interval
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
                  autoThemeInterval = null;
            }
      }
}

function checkTimeAndSetTheme() {
      // Safety check: Don't run if auto mode is disabled
      const currentAutoMode = localStorage.getItem(AUTO_MODE_KEY) || "disable";
      if (currentAutoMode !== "enable") {
            // If auto mode is disabled but this function is still being called,
            // clear the interval to prevent further calls
            if (autoThemeInterval) {
                  clearInterval(autoThemeInterval);
                  autoThemeInterval = null;
            }
            return;
      }

      const { from, to } = getStoredTimes();
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const fromMins = toMinutes(from);
      const toMins = toMinutes(to);

      let isDarkHours = false;
      if (fromMins === toMins) {
            // Same times means never or always; treat as always-dark window disabled
            isDarkHours = false;
      } else if (fromMins < toMins) {
            // Same-day range, e.g., 18:00-22:00
            isDarkHours = nowMins >= fromMins && nowMins < toMins;
      } else {
            // Overnight range, e.g., 20:00-09:00
            isDarkHours = nowMins >= fromMins || nowMins < toMins;
      }

      if (isDarkHours) {
            if (typeof applyTheme === 'function') applyTheme('dark', true);
      } else {
            if (typeof applyTheme === 'function') applyTheme('light', true);
      }
}

// Initialize auto theme mode
document.addEventListener('DOMContentLoaded', initAutoTheme);

// Cleanup function to clear intervals
function cleanupAutoTheme() {
      if (autoThemeInterval) {
            clearInterval(autoThemeInterval);
            autoThemeInterval = null;
      }
}

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', cleanupAutoTheme);

// Add event listeners
autoThemeBtn.addEventListener('click', toggleAutoThemeMode);
autoThemeBtnThumb.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleAutoThemeMode();
});
