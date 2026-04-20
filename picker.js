// Smart Color Picker Logic
(function () {
    // Helper: Hex to RGB
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    // Helper: RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    async function startSmartPicker() {
        // Just open the frame in start mode
        loadPickerFrame(null);
    }

    // Initialize EyeDropper once for better performance
    const eyeDropper = window.EyeDropper ? new EyeDropper() : null;

    async function launchEyeDropper() {
        if (!eyeDropper) {
            if (!window.EyeDropper) {
                alert("Your browser doesn't support the EyeDropper API. Please use Chrome or Edge.");
            }
            return;
        }

        try {
            const result = await eyeDropper.open();
            // Once picked, render the details for that color
            renderPickerDetails(result.sRGBHex);
        } catch (e) {
            console.log("Picker cancelled or failed");
        }
    }

    function loadPickerFrame(hex) {
        const pickerFrame = document.querySelector("#picker-frame");
        const nav = window.rightPenalNav;

        if (!nav) return;

        // Populate Content
        if (hex) {
            renderPickerDetails(hex);
        } else {
            renderPickerStart();
        }

        // Open Frame
        nav.switchFrame(nav.activeFrame, pickerFrame, "forward");
        nav.previousFrame = nav.mainFrame;
        nav.activeFrame = pickerFrame;
        nav.updateBackButtonVisibility();
    }

    function renderPickerStart() {
        const content = document.querySelector(".picker-frame-content");
        if (!content) return;

        content.innerHTML = `
            <div class="picker-placeholder">
                <p>Use the Smart Picker to capture colors from your screen</p>
                <button class="picker-placeholder-btn" onclick="launchEyeDropper()">
                    <ion-icon name="eyedrop-outline"></ion-icon>
                    Open Picker
                </button>
            </div>
        `;
    }

    function renderPickerDetails(hex) {
        const content = document.querySelector(".picker-frame-content");
        if (!content) return;

        // Ensure we handle the hex being null/empty from any call
        if (!hex) {
            renderPickerStart();
            return;
        }

        // Integration of History Tracking
        if (typeof updatePickerHistory === 'function') {
            updatePickerHistory(hex);
        }

        // 1. Color Naming via ntc.js
        let colorName = "Unknown Color";
        if (window.ntc) {
            const nMatch = ntc.name(hex);
            colorName = nMatch[1]; // Index 1 is the name
        }

        // 2. Shades via getMoreShades(color, 10)
        let shadesHtml = "";
        if (window.getMoreShades) {
            const shadesObj = getMoreShades(hex, 10);
            const allShades = [...shadesObj.dark, ...shadesObj.light];

            shadesHtml = allShades.map((s, index) => `
                <div class="shade-item" style="background-color: ${s}; color: ${getContrastColor(s)}" onclick="copyText('${s}')" title="Click to Copy">
                    ${s}
                </div>
            `).join("");
        }

        const color = tinycolor(hex);
        const rgb = color.toRgb();
        const hsl = color.toHsl();
        const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const hslStr = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;

        content.innerHTML = `
            <!-- 4. Re-select Button (Moved to top) -->
            <button class="picker-reselect-btn" onclick="launchEyeDropper()">
                <ion-icon name="eyedrop-outline"></ion-icon>
                Pick Another Color
            </button>

            <!-- 1. Color Naming Box -->
            <div class="picker-name-box" style="background-color: ${hex}; color: ${getContrastColor(hex)}">
                <h2>${colorName}</h2>
                <span style="opacity: 0.7; font-weight: 600;">${hex.toUpperCase()}</span>
            </div>

            <!-- 2. Shades Section -->
            <div class="picker-section">
                <div class="picker-section-title">Shades Palette</div>
                <div class="picker-shades-container">
                    <button class="slider-nav-btn prev" onclick="scrollShades(-1)">
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </button>
                    <div class="shades-slider-wrapper">
                        <div class="shades-slider" id="shades-slider">
                            ${shadesHtml}
                        </div>
                    </div>
                    <button class="slider-nav-btn next" onclick="scrollShades(1)">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </button>
                </div>
            </div>

            <!-- 3. Formats Section -->
            <div class="picker-section">
                <div class="picker-section-title">Formats & Actions</div>
                <div class="picker-formats-list">
                    ${renderFormatRow("HEX", hex.toUpperCase())}
                    ${renderFormatRow("RGB", rgbStr)}
                    ${renderFormatRow("HSL", hslStr)}
                </div>
            </div>
        `;
    }

    function renderFormatRow(label, value) {
        // Check if this EXACT string is already saved
        const isSaved = isColorAvailableInStorage(value.toUpperCase());

        return `
            <div class="format-row">
                <div class="format-info">
                    <span class="format-label">${label}</span>
                    <span class="format-value">${value}</span>
                </div>
                <div class="format-actions">
                    <button class="format-btn" onclick="copyValue('${value}')" title="Copy">
                        <ion-icon name="copy-outline"></ion-icon>
                    </button>
                    <button class="format-btn ${isSaved ? 'active' : ''}" 
                            style="${isSaved ? 'color: #00ff00;' : ''}"
                            onclick="savePickerColor('${value}', this)" title="Save">
                        <ion-icon name="${isSaved ? 'checkmark-circle-outline' : 'download-outline'}"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    }

    // Global Exposure & Event Handlers
    window.startSmartPicker = startSmartPicker;

    window.scrollShades = (direction) => {
        const slider = document.getElementById('shades-slider');
        if (!slider) return;

        // Calculate scroll amount based on item width (60% + 10px gap)
        const itemWidth = slider.clientWidth * 0.6 + 10;
        slider.scrollBy({
            left: direction * itemWidth,
            behavior: 'smooth'
        });
    };

    // Keyboard Arrow Support
    window.addEventListener('keydown', (e) => {
        const pickerFrame = document.querySelector("#picker-frame");
        const isActive = pickerFrame && !pickerFrame.classList.contains("hidden");

        if (!isActive) return;

        if (e.key === "ArrowRight") {
            scrollShades(1);
        } else if (e.key === "ArrowLeft") {
            scrollShades(-1);
        }
    });

    window.savePickerColor = async (color, btn) => {
        const nav = window.rightPenalNav;

        if (nav && nav.handleSaveAction) {
            try {
                await nav.handleSaveAction(color, btn);
            } catch (e) {
                console.error("Save failed", e);
            }
        }
    };

    window.copyValue = (val) => {
        if (window.copyText) {
            copyText(val);
        } else {
            navigator.clipboard.writeText(val);
        }
    };

    let pickerHistory = [];

    // Initialize or load from session storage
    try {
        const saved = sessionStorage.getItem("picker_history");
        if (saved) pickerHistory = JSON.parse(saved);
    } catch (e) { }

    function updatePickerHistory(hex) {
        hex = hex.toUpperCase();
        pickerHistory = pickerHistory.filter(c => c !== hex);
        pickerHistory.unshift(hex);
        if (pickerHistory.length > 20) pickerHistory.pop();

        sessionStorage.setItem("picker_history", JSON.stringify(pickerHistory));
        renderHistorySection();
    }

    function renderHistorySection() {
        const container = document.querySelector(".history-section-content");
        if (!container) return;

        if (pickerHistory.length === 0) {
            container.innerHTML = `<span style="font-size: 10px; opacity: 0.4;">No history yet</span>`;
            return;
        }

        container.innerHTML = pickerHistory.map(h => `
            <div class="history-swatch" 
                 style="background-color: ${h}" 
                 onclick="window.renderPickerDetails('${h}')" 
                 title="${h}">
            </div>
        `).join("");

        // Update mask state immediately
        updateScrollMask(container);
    }

    function updateScrollMask(el) {
        if (!el) return;
        const scrollLeft = el.scrollLeft;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;

        const isAtStart = scrollLeft <= 2;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 2;
        const canScroll = scrollWidth > clientWidth;

        if (!canScroll) {
            el.style.setProperty('--mask-left', 'black');
            el.style.setProperty('--mask-right', 'black');
            return;
        }

        el.style.setProperty('--mask-left', isAtStart ? 'black' : 'transparent');
        el.style.setProperty('--mask-right', isAtEnd ? 'black' : 'transparent');
    }

    // Attach listener using delegation or after content is available
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(".history-section-content")) {
            const el = e.target.closest(".history-section-content");
            if (!el.dataset.hasScrollListener) {
                el.addEventListener("scroll", () => updateScrollMask(el));
                el.dataset.hasScrollListener = "true";
            }
        }
    }, { once: false });

    window.clearPickerHistory = () => {
        if (confirm("Clear your pick history?")) {
            pickerHistory = [];
            sessionStorage.setItem("picker_history", JSON.stringify(pickerHistory));
            renderHistorySection();
        }
    };

    // Global Exposure
    window.renderPickerDetails = renderPickerDetails;
    window.startSmartPicker = startSmartPicker;
    window.launchEyeDropper = launchEyeDropper;

    // Initialize History on Load
    renderHistorySection();

})();
