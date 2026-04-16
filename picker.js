// Smart Color Picker Logic
(function() {
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
        if (!window.EyeDropper) {
            alert("Your browser doesn't support the EyeDropper API. Please use Chrome or Edge.");
            return;
        }

        const eyeDropper = new EyeDropper();
        try {
            const result = await eyeDropper.open();
            loadPickerFrame(result.sRGBHex);
        } catch (e) {
            console.log("Picker cancelled or failed");
        }
    }

    function loadPickerFrame(hex) {
        const pickerFrame = document.querySelector("#picker-frame");
        const nav = window.rightPenalNav;

        if (!nav) return;

        // Populate Content
        renderPickerDetails(hex);

        // Open Frame
        nav.switchFrame(nav.activeFrame, pickerFrame, "forward");
        nav.previousFrame = nav.mainFrame; 
        nav.activeFrame = pickerFrame;
        nav.updateBackButtonVisibility();
    }

    function renderPickerDetails(hex) {
        const content = document.querySelector(".picker-frame-content");
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
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
            const allShades = [...shadesObj.dark, shadesObj.original, ...shadesObj.light];
            
            shadesHtml = allShades.map(s => `
                <div class="shade-item" style="background-color: ${s}; color: ${getContrastColor(s)}">
                    ${s}
                </div>
            `).join("");
        }

        const isSavedHex = isColorAvailableInStorage(hex);
        const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        content.innerHTML = `
            <!-- 4. Re-select Button (Moved to top) -->
            <button class="picker-reselect-btn" onclick="startSmartPicker()">
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

})();
