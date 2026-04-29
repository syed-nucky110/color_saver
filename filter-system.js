/* Filter System Logic */

const filterContainer = document.getElementById('filter-container');
const filterCloseBtn = document.getElementById('filter-close-btn');
const btnClearFilters = document.getElementById('btn-clear-filters');
const btnApplyFilters = document.getElementById('btn-apply-filters');
const filterChips = document.querySelectorAll('.filter-chip');
const resultsGrid = document.getElementById('filter-results-grid');
const resultsCount = document.getElementById('filter-results-count');
const filterSidebar = document.querySelector('.filter-sidebar');
const mobileFilterToggleBtn = document.getElementById('mobile-filter-toggle-btn');
const mobileFilterToggleText = document.getElementById('mobile-filter-toggle-text');

let activeFilters = {
    format: null,
    brightness: null,
    tone: null
};

// Toggle Filter Frame
function toggleFilterFrame(show = true) {
    if (show) {
        filterContainer.style.display = 'flex';
        setTimeout(() => filterContainer.classList.add('show'), 10);
        applyFilters(); // Real-time preview whenever opened
    } else {
        const filterBox = filterContainer.querySelector('.filter-box');
        filterBox.style.animation = 'hideSmooth 0.25s ease forwards';
        setTimeout(() => {
            filterContainer.style.display = 'none';
            filterBox.style.animation = '';
        }, 200);
    }
}

// Close events
filterCloseBtn.addEventListener('click', () => toggleFilterFrame(false));
window.addEventListener('click', (e) => {
    if (e.target === filterContainer) toggleFilterFrame(false);
});

// Mobile Sidebar Shutter Toggle
if (mobileFilterToggleBtn) {
    mobileFilterToggleBtn.addEventListener('click', () => {
        filterSidebar.classList.toggle('shutter-open');

        if (filterSidebar.classList.contains('shutter-open')) {
            mobileFilterToggleText.innerText = "Hide Filters";
        } else {
            mobileFilterToggleText.innerText = "Show Filters";
        }
    });
}

// Category Click Handling
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const category = chip.parentElement.dataset.category;
        const value = chip.dataset.value;

        // Toggle active state within the same category
        const siblingChips = chip.parentElement.querySelectorAll('.filter-chip');

        if (chip.classList.contains('active')) {
            chip.classList.remove('active');
            activeFilters[category] = null;
        } else {
            siblingChips.forEach(s => s.classList.remove('active'));
            chip.classList.add('active');
            activeFilters[category] = value;
        }

        // Instant preview in the right pane
        applyFilters();
    });
});

// Clear All
btnClearFilters.addEventListener('click', () => {
    filterChips.forEach(chip => chip.classList.remove('active'));
    Object.keys(activeFilters).forEach(key => activeFilters[key] = null);
    applyFilters();
});

// Apply Filters (Close and sync to main app)
btnApplyFilters.addEventListener('click', () => {
    applyFiltersToMainApp();
    toggleFilterFrame(false);
});

// Keyboard Shortcut (Shift + Alt + L)
window.addEventListener("keyup", (event) => {
    if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "l") {
        event.preventDefault();
        toggleFilterFrame(true);
    }
});

// Logic for Right-Side Preview Pane
function applyFilters() {
    // CRITICAL: Only select colors from the main list container, 
    // NOT the entire document, to avoid picking up preview results.
    const mainList = document.querySelector('.saved-colors-list');
    const colorBoxes = Array.from(mainList.querySelectorAll('.saved-clr'));
    let matchedColors = [];

    colorBoxes.forEach(box => {
        const colorValue = box.dataset.color || box.style.backgroundColor;
        const color = typeof tinycolor !== 'undefined' ? tinycolor(colorValue) : null;

        if (!color || !color.isValid()) return;

        let matches = true;

        if (activeFilters.format) {
            const desiredFormat = activeFilters.format; // 'hex', 'rgb', 'hsl', 'name'
            const actualFormat = color.getFormat(); // 'hex', 'rgb', 'hsl', 'name'

            if (desiredFormat !== actualFormat) {
                // Special case for color names like 'red' being parsed differently sometimes
                if (desiredFormat === 'name' && actualFormat !== 'name') matches = false;
                else if (desiredFormat === 'hex' && !actualFormat.includes('hex')) matches = false;
                else if (desiredFormat === 'rgb' && actualFormat !== 'rgb') matches = false;
                else if (desiredFormat === 'hsl' && actualFormat !== 'hsl') matches = false;
            }
        }

        if (matches && activeFilters.brightness) {
            const isDark = color.isDark();
            if (activeFilters.brightness === 'dark' && !isDark) matches = false;
            if (activeFilters.brightness === 'light' && isDark) matches = false;
        }

        if (matches && activeFilters.tone) {
            const saturation = color.toHsl().s; // 0 to 1
            const tone = activeFilters.tone;
            if (tone === 'grayscale' && saturation > 0.05) matches = false;
            else if (tone === 'muted' && (saturation <= 0.05 || saturation > 0.4)) matches = false;
            else if (tone === 'vibrant' && saturation <= 0.4) matches = false;
        }

        if (matches) {
            matchedColors.push({
                value: colorValue,
                name: box.querySelector('.color-name')?.innerText || colorValue
            });
        }
    });

    renderResults(matchedColors);
    updateFilterBadges();
}

function renderResults(colors) {
    if (colors.length === 0) {
        resultsGrid.innerHTML = `
            <div class="filter-empty-state">
                <ion-icon name="color-wand-outline"></ion-icon>
                <p>Select filters to see results</p>
            </div>
        `;
        resultsCount.innerText = "Results: 0 colors found";
        return;
    }

    resultsCount.innerText = `Results: ${colors.length} colors found`;

    resultsGrid.innerHTML = colors.map(clr => {
        const contrastColor = typeof getContrastColor === 'function' ? getContrastColor(clr.value) : '#fff';
        return `
            <div class="filter-color-box" 
                 data-color="${clr.value}" 
                 style="background: ${clr.value};"
                 onclick="copyFromFilter(this)">
                <span class="filter-color-name" style="color: ${contrastColor}">${clr.name}</span>
                <div class="copy-overlay">
                    <span class="copy-text">Click to copy</span>
                </div>
            </div>
        `;
    }).join('');
}

// Copy logic for filter cards
window.copyFromFilter = (el) => {
    const color = el.dataset.color;
    if (typeof copyText === 'function') {
        copyText(color);
        if (typeof playSound === 'function') playSound(menuSound);
    }

    const copyTextEl = el.querySelector('.copy-text');
    if (copyTextEl) {
        copyTextEl.innerText = "Copied!";

        // Reset text after 1.5 seconds
        setTimeout(() => {
            copyTextEl.innerText = "Click to copy";
        }, 1500);
    }
};

// Logic for Main Application UI
function applyFiltersToMainApp() {
    const mainList = document.querySelector('.saved-colors-list');
    const colorBoxes = mainList.querySelectorAll('.saved-clr');
    let visibleCount = 0;

    colorBoxes.forEach(box => {
        const colorValue = box.dataset.color || box.style.backgroundColor;
        const color = typeof tinycolor !== 'undefined' ? tinycolor(colorValue) : null;

        if (!color || !color.isValid()) {
            box.style.display = 'flex'; // Show if error
            visibleCount++;
            return;
        }

        let matches = true;

        if (activeFilters.format) {
            const desiredFormat = activeFilters.format;
            const actualFormat = color.getFormat();
            if (desiredFormat === 'name' && actualFormat !== 'name') matches = false;
            else if (desiredFormat === 'hex' && !actualFormat.includes('hex')) matches = false;
            else if (desiredFormat === 'rgb' && actualFormat !== 'rgb') matches = false;
            else if (desiredFormat === 'hsl' && actualFormat !== 'hsl') matches = false;
        }

        if (matches && activeFilters.brightness) {
            const isDark = color.isDark();
            if (activeFilters.brightness === 'dark' && !isDark) matches = false;
            if (activeFilters.brightness === 'light' && isDark) matches = false;
        }

        if (matches && activeFilters.tone) {
            const saturation = color.toHsl().s;
            if (activeFilters.tone === 'grayscale' && saturation > 0.05) matches = false;
            else if (activeFilters.tone === 'muted' && (saturation <= 0.05 || saturation > 0.4)) matches = false;
            else if (activeFilters.tone === 'vibrant' && saturation <= 0.4) matches = false;
        }

        if (matches) {
            box.style.display = 'flex';
            visibleCount++;
        } else {
            box.style.display = 'none';
        }
    });

    const counterDisplay = document.getElementById('color-counting');
    if (counterDisplay) counterDisplay.innerText = visibleCount;
}

function updateFilterBadges() {
    const preview = document.getElementById('active-filters-preview');
    const activeEntries = Object.entries(activeFilters).filter(([_, v]) => v !== null);

    if (activeEntries.length === 0) {
        preview.innerHTML = '<span style="color: var(--filter-category-title); font-size: 13px;">No filters active</span>';
        return;
    }

    preview.innerHTML = activeEntries.map(([cat, val]) => `
        <div class="filter-chip active" style="font-size: 11px; padding: 4px 12px; height: auto;">
            ${cat}: ${val}
        </div>
    `).join('');
}

// Initial call to set status
updateFilterBadges();

window.openFilterSystem = () => toggleFilterFrame(true);
