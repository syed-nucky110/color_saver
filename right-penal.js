const rightPenal = document.querySelector(".right-penal");
const rightPenalWrapper = document.querySelector(".right-penal-wrapper");
const frameHolder = document.querySelector(".frame-holder");
const mainFrame = document.querySelector(".main-frame");
const multishadesFrame = document.querySelector(".multishades-frame");
const pickerFrame = document.querySelector("#picker-frame");
const webColorPickerFrame = document.querySelector(".web-color-picker-frame");

const multishadesFrameContent = document.querySelector(".multishades-frame-content");
const mobileOpenCloseBtn = document.querySelectorAll(".mobile-open-close-btn");
const closeRightPenalBtn = document.querySelectorAll(".close-right-penal-btn");
const openRightPenalBtn = document.querySelector("#open-right-penal-btn");
const multishadesBtn = document.querySelector(".multishades-btn");
const mobileBackBtns = document.querySelectorAll(".mobile-back-btn");

const multishadesActionBtn = document.getElementById("search-selected-clr-or-save");
const multishadesActionIcon = multishadesActionBtn ? multishadesActionBtn.querySelector("ion-icon") : null;

let activeFrame = null;

let previousFrame = null;

mobileOpenCloseBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        rightPenalWrapper.classList.toggle("mobile-close");
    });
});

closeRightPenalBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        closeRightPenal();
    });
});

if (openRightPenalBtn) {
    openRightPenalBtn.addEventListener("click", () => {
        openRightPenal();
    });
}

if (multishadesBtn) {
    multishadesBtn.addEventListener("click", () => {
        openMultishadesFrameOnly();
    });
}

mobileBackBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!activeFrame || activeFrame === mainFrame) return;

        if (previousFrame) {
            // Standard back navigation
            switchFrame(activeFrame, previousFrame, "backward");
            activeFrame = previousFrame;
            previousFrame = null; // Clear history after returning
        } else {
            // Fallback to Main Frame
            switchFrame(activeFrame, mainFrame, "backward");
            activeFrame = mainFrame;
            previousFrame = null;
        }

        clearMultishadesSelection();
        updateSelectionMode();
        updateBackButtonVisibility();
    });
});

if (multishadesActionBtn) {
    multishadesActionBtn.addEventListener("click", () => {
        const colorInput = document.getElementById("multishades-text-input");
        if (!colorInput) return;

        const color = colorInput.value.trim().toUpperCase();
        if (!color || colorInput.value === "") return;

        if (!isColorValid(color)) return;

        if (isColorAvailableInStorage(color)) {
            highlightSavedColor(color);
        } else {
            colorListCreator(color);
            // After saving, update the button state
            multishadesActionIcon.setAttribute("name", "eye-outline");
            let colorBox = document.querySelector(`.saved-clr[data-id="${color}"]`);
            colorBox.classList.add('multishades-selected-clr');
        }
    });
}

function openMultishadesFrameOnly() {

    rightPenalWrapper.classList.remove("closed");
    openMultishades();
    showMultishadesPlaceholder();
}

function showMultishadesPlaceholder() {
    emptyMultishadesFrameContent();
    const placeholder = document.createElement("div");
    placeholder.className = "multishades-placeholder";
    placeholder.innerHTML = `
        <ion-icon name="layers-outline"></ion-icon>
        <p>Select a color to get multishades</p>
        <strong><p>Or</p></strong>
        <p>Type manually</p>
    `;
    multishadesFrameContent.appendChild(placeholder);
}

function openRightPenal() {
    rightPenalWrapper.classList.remove("closed");
    initializeMainFrame();
}

function closeRightPenal() {
    rightPenalWrapper.classList.add("closed");
    document.body.classList.remove("selection-active");
    activeFrame = null;
    previousFrame = null;
    resetFrames();
    clearMultishadesSelection();

    // Reset Web Color Picker state if function exists
    if (typeof resetWebColorPickerState === 'function') {
        resetWebColorPickerState();
    }
}


function clearMultishadesSelection() {
    document.querySelectorAll(".saved-clr.multishades-selected-clr").forEach(el => {
        el.classList.remove("multishades-selected-clr");
    });
}

function updateSelectionMode() {
    if (activeFrame === multishadesFrame) {
        document.body.classList.add("selection-active");
    } else {
        document.body.classList.remove("selection-active");
    }
}

function updateBackButtonVisibility() {
    mobileBackBtns.forEach(btn => {
        if (activeFrame && activeFrame !== mainFrame) {
            btn.classList.remove("hidden");
        } else {
            btn.classList.add("hidden");
        }
    });
}

function initializeMainFrame() {
    resetFrames();
    activeFrame = null;
    previousFrame = null;
    openMainFrame();
    clearMultishadesSelection();
    updateBackButtonVisibility();
}

function openMainFrame() {
    if (activeFrame === mainFrame) return;
    if (activeFrame) switchFrame(activeFrame, mainFrame, "backward");
    else mainFrame.classList.remove("hidden", "frame-prev");

    previousFrame = activeFrame;
    activeFrame = mainFrame;
    updateSelectionMode();
    clearMultishadesSelection();
    updateBackButtonVisibility();
}

function closeMainFrame() {
    mainFrame.classList.add("hidden");
    mainFrame.classList.remove("frame-prev");
}

function openMultishades() {
    if (activeFrame === multishadesFrame) return;
    if (activeFrame) switchFrame(activeFrame, multishadesFrame, "forward");
    else multishadesFrame.classList.remove("hidden", "frame-prev");

    previousFrame = activeFrame;
    activeFrame = multishadesFrame;
    updateSelectionMode();
    updateBackButtonVisibility();
}

function closeMultishades() {
    multishadesFrame.classList.add("hidden");
    multishadesFrame.classList.remove("frame-prev");
}

function switchFrame(from, to, direction = "forward") {
    clearMultishadesSelection();
    if (direction === "forward") {
        from.classList.add("frame-prev");
        from.classList.add("hidden");
        to.classList.remove("hidden", "frame-prev");
    } else {
        from.classList.remove("frame-prev");
        from.classList.add("hidden");
        to.classList.remove("hidden", "frame-prev");
    }
}

function resetFrames() {
    mainFrame.classList.add("hidden");
    multishadesFrame.classList.add("hidden");
    if (pickerFrame) pickerFrame.classList.add("hidden");
    if (webColorPickerFrame) webColorPickerFrame.classList.add("hidden");
    mainFrame.classList.remove("frame-prev");
    multishadesFrame.classList.remove("frame-prev");
    if (pickerFrame) pickerFrame.classList.remove("frame-prev");
    if (webColorPickerFrame) webColorPickerFrame.classList.remove("frame-prev");
}


function openMultishadesDirectly(color) {
    rightPenalWrapper.classList.remove("closed");
    openMultishades();
    loadMultishades(color);
}

function isMultishadesFrameActive() {
    return !rightPenalWrapper.classList.contains("closed") && !multishadesFrame.classList.contains("hidden");
}

window.openMultishadesDirectly = openMultishadesDirectly;
window.isMultishadesFrameActive = isMultishadesFrameActive;

// function getMultishades(color, count = 6) {

//     count = 6; // set as 6 forcefull

//     let baseHex = color;

//     // Check if color is already hex; if not, convert to hex
//     if (typeof color === 'string' && !color.startsWith('#')) {
//         baseHex = tinycolor(color).toHexString().toUpperCase();
//     } else if (typeof color === 'string') {
//         baseHex = color.toUpperCase();
//     }

//     const shades = {
//         original: baseHex,
//         dark: [],
//         light: []
//     };

//     const halfCount = Math.floor(count / 2);
//     const step = 10; // Percentage step for darkening/lightening

//     for (let i = 1; i <= halfCount; i++) {
//         const amount = i * step;
//         shades.dark.unshift(tinycolor(baseHex).darken(amount).toHexString().toUpperCase());
//         shades.light.push(tinycolor(baseHex).lighten(amount).toHexString().toUpperCase());
//     }

//     return shades;
// }

function getMultishades(color, count = 6) {
    const tc = tinycolor(color);
    const baseHex = tc.toHexString().toUpperCase();

    const shades = {
        original: baseHex,
        dark: [],
        light: []
    };

    // Try to get 3 unique dark shades
    let step = 1;
    while (shades.dark.length < 3 && step <= 10) {
        const darkColor = tinycolor(baseHex).darken(step * 5).toHexString().toUpperCase();
        if (darkColor !== baseHex && !shades.dark.includes(darkColor)) {
            shades.dark.unshift(darkColor);
        }
        step++;
    }

    // Try to get enough light shades to reach total of 6
    const targetLightCount = 6 - shades.dark.length;
    step = 1;
    while (shades.light.length < targetLightCount && step <= 10) {
        const lightColor = tinycolor(baseHex).lighten(step * 5).toHexString().toUpperCase();
        if (lightColor !== baseHex && !shades.light.includes(lightColor)) {
            shades.light.push(lightColor);
        }
        step++;
    }

    // Final fallback: If we still don't have 6 (rare), try to fill remaining from dark side
    if (shades.dark.length + shades.light.length < 6) {
        step = (shades.dark.length + 1);
        while (shades.dark.length + shades.light.length < 6 && step <= 20) {
            const darkColor = tinycolor(baseHex).darken(step * 5).toHexString().toUpperCase();
            if (darkColor !== baseHex && !shades.dark.includes(darkColor) && !shades.light.includes(darkColor)) {
                shades.dark.unshift(darkColor);
            }
            step++;
        }
    }

    return shades;
}

function getMoreShades(color, count) {
    const tc = tinycolor(color).toHsl();

    const shades = {
        original: tinycolor(color).toHexString().toUpperCase(),
        dark: [],
        light: []
    };

    const half = Math.floor(count / 2);

    // Define lightness boundaries (important!)
    const minL = 0.1;  // darkest limit
    const maxL = 0.9;  // lightest limit
    const baseL = tc.l;

    // Generate darker shades
    for (let i = half; i >= 1; i--) {
        const ratio = i / (half + 1);
        const newL = baseL - (baseL - minL) * ratio;

        shades.dark.push(
            tinycolor({ h: tc.h, s: tc.s, l: newL })
                .toHexString()
                .toUpperCase()
        );
    }

    // Generate lighter shades
    for (let i = 1; i <= half; i++) {
        const ratio = i / (half + 1);
        const newL = baseL + (maxL - baseL) * ratio;

        shades.light.push(
            tinycolor({ h: tc.h, s: tc.s, l: newL })
                .toHexString()
                .toUpperCase()
        );
    }

    return shades;
}

function getAllShades(color) {
    const tc = tinycolor(color).toHsl();

    const shades = [];

    const totalSteps = 20; // 0% to 100% → 20 intervals (21 colors)
    const stepSize = 1 / totalSteps; // 0.05 = 5%

    for (let i = 0; i <= totalSteps; i++) {
        const l = i * stepSize;

        const newColor = tinycolor({
            h: tc.h,
            s: tc.s,
            l: l
        }).toHexString().toUpperCase();

        shades.push({
            percent: Math.round(l * 100), // 0, 5, 10 ... 100
            hex: newColor
        });
    }

    return {
        base: tinycolor(color).toHexString().toUpperCase(),
        allShades: shades
    };
}


// Get dark shades and light shades
function getMutlishadesInOneArray(color) {
    const shades = getMultishades(color);
    const allShades = [];
    shades.dark.forEach((shade, index) => {
        allShades.push(shade);
    });
    shades.light.forEach((shade, index) => {
        allShades.push(shade);
    });
    return allShades;
}

function emptyMultishadesFrameContent() {
    multishadesFrameContent.innerHTML = "";
}

multishadesFrameContent.addEventListener("click", async (e) => {
    const box = e.target.closest(".multishades-clr-box");
    if (!box) return;

    const boxIndex = parseInt(box.dataset.index);
    const boxType = box.dataset.colorsType;

    const upppBox = document.querySelector(`.multishades-clr-box[data-colors-type="${boxType}"][data-index="${boxIndex - 1}"]`);
    const lowerBox = document.querySelector(`.multishades-clr-box[data-colors-type="${boxType}"][data-index="${boxIndex + 1}"]`);

    const color = box.dataset.color;
    const saveBtn = e.target.closest(".save-clr-btn");
    const copyBtn = e.target.closest(".copy-clr-btn");
    const showOrgColorBtn = e.target.closest(".show-org-color-btn");
    const getSubMultishadesBtn = e.target.closest('.get-sub-multishades-btn');
    const baseColorBox = e.target.closest('.base-color-box');
    const subColorItem = e.target.closest('.sub-shade-item');
    const swapVerticalBtn = e.target.closest('.swap-vertical-btn');
    const compareUpperColorBtn = e.target.closest('.compare-with-upper-color-btn');
    const compareLowerColorBtn = e.target.closest('.compare-with-lower-color-btn');

    if (saveBtn) await handleSaveAction(color, saveBtn);
    if (copyBtn) handleCopyAction(color);
    if (showOrgColorBtn) {
        let orgColorShade = box.querySelector(".org-color-shade");
        orgColorShade.classList.toggle("show");
    };
    if (getSubMultishadesBtn) {
        let subMultishadesBox = box.querySelector('.sub-multishades-box')
        subMultishadesBox.classList.toggle('show');

        // For All shades list
        if (box.getAttribute('data-colors-type') == 'all') {
            box.classList.toggle('box-height-50')
            box.classList.toggle('box-height-90')
        }
    };
    if (subColorItem) copyText(subColorItem.dataset.colorHex);
    if (baseColorBox && !e.target.closest('.swap-vertical-btn')) copyText(baseColorBox.dataset.colorHex);
    if (swapVerticalBtn) {
        let subMultishadesBox = box.querySelector('.sub-multishades-box');
        subMultishadesBox.classList.toggle('flex-col-rev');
    }
    if (compareUpperColorBtn) {
        box.classList.toggle('upper-radius-none');
        upppBox.classList.toggle('lower-radius-none');
    }
    if (compareLowerColorBtn) {
        box.classList.toggle('lower-radius-none');
        lowerBox.classList.toggle('upper-radius-none');
    }
});

async function handleSaveAction(color, btn) {
    if (isColorAvailableInStorage(color)) {
        throwMessage("Already Saved", "#00ff00", "checkmark-circle-outline");
        saveBtnToSavedState(btn);
        highlightSavedColor(color);
    }
    else if (isColorAvailableInTrash(color)) {
        const confirmed = await showRestorePopup(color);
        if (confirmed) {
            colorMoveToStorageFromTrash(color);
            renderColors(color);
            renderTrashColors();
            saveBtnToSavedState(btn);
            showSuccessMessage("Resotre Successfully");
        }
    }
    else {
        colorListCreator(color);
        saveBtnToSavedState(btn);
    }
}

function subMultishadesLayout(color, shadesCount) {
    const subMultishadesBox = document.createElement('div');
    subMultishadesBox.classList.add("sub-multishades-box");

    let swapBtnBgColor = getContrastColor(color);
    let swapBtnIconColor = (getContrastColor(color) === 'black') ? 'white' : 'black';

    subMultishadesBox.innerHTML =
        `<div data-color-hex='${color}' class="base-color-box" style="background-color: ${color}; color: ${getContrastColor(color)}">
            <button class="swap-vertical-btn" style="background-color: ${swapBtnBgColor}; color: ${swapBtnIconColor}">
                <ion-icon name="swap-vertical-outline"></ion-icon>
            </button>
            ${color}
        </div>
        <div class="sub-multishades-holder">
            ${getSubShades()}
        </div>
    `;

    function getSubShades() {
        const subShades = getMoreShades(color, shadesCount);
        const allShades = [];

        allShades.push(...subShades.dark, ...subShades.light);

        return allShades.map((shade, index) => {
            return `<span data-color-hex='${shade}' class="sub-shade-item" style="background-color: ${shade}; color: ${getContrastColor(shade)}">
                <span>${shade}</span>
            </span>`
        }).join('');

    }

    return subMultishadesBox;
}

function handleCopyAction(color) {
    copyText(color);
}

multishadesFrameContent.addEventListener("mouseover", (e) => {
    const box = e.target.closest(".multishades-clr-box");
    if (box) {
        const color = box.dataset.color;
        const saveBtn = box.querySelector(".save-clr-btn");
        const isSaved = isColorAvailableInStorage(color);

        if (isSaved) {
            saveBtnToSavedState(saveBtn);
        } else {
            saveBtnToDefaultState(saveBtn);
        }
    }
});

function saveBtnToSavedState(btn) {
    btn.style.color = "#00ff00";
    btn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>';
    btn.setAttribute('title', 'find')
}

function saveBtnToDefaultState(btn) {
    btn.style.color = "";
    btn.innerHTML = '<ion-icon name="download-outline"></ion-icon>';
    btn.setAttribute('title', 'save color')
}

function multishadesColorBoxLayout(color, number, orgColor, size = "box-height-90") {
    let textColor = getContrastColor(color);

    const layout = document.createElement("div");
    layout.classList.add("multishades-clr-box", "relative", size);
    layout.setAttribute('data-index', number + 1);
    layout.dataset.color = color;
    layout.style.backgroundColor = color;

    const isSaved = isColorAvailableInStorage(color);

    let innnerLayout = `
    ${number !== undefined ? `
        <span class="multishades-clr-number absolute" style="color: ${textColor};">${number + 1}</span>` : ""}
        <span class="multishades-clr-name" style="color: ${textColor};">${color}</span>
        <span class="org-color-shade" style="background-color: ${orgColor};"></span>
        <div class="buttons-box">
            <button class="hide-at-sub-shades show-org-color-btn" title="compare with selected color">
                <ion-icon name="contrast-outline"></ion-icon>
            </button>
            <button class="hide-at-sub-shades save-clr-btn" style="color: ${isSaved ? "#00ff00" : ""};" title="save color">
                <ion-icon name="${isSaved ? "checkmark-circle-outline" : "download-outline"}"></ion-icon>
            </button>
            <button class="hide-at-sub-shades copy-clr-btn" title="copy color">
                <ion-icon name="copy-outline"></ion-icon>
            </button>
            <div class="compare-color-buttons">
                <button class="compare-color-placeholder-btn">
                    <i class="ph ph-arrows-in-line-vertical"></i>
                </button>
                <button class="compare-with-upper-color-btn">
                    <i class="ph ph-arrow-line-up"></i>
                </button>
                <button class="compare-with-lower-color-btn">
                    <i class="ph ph-arrow-line-down"></i>
                </button>
            </div>
            <button class="get-sub-multishades-btn" title="get shades of this color">
                <ion-icon name="layers-outline"></ion-icon>
            </button>
        </div>
        `;
    layout.innerHTML = innnerLayout;
    layout.append(subMultishadesLayout(color, 5))

    return layout;
}

function createSeparator() {
    const separator = document.createElement("span");
    separator.classList.add("right-penal-content-separator", "mt-30", "mb-30");
    return separator;
}


function loadMultishades(color) {

    // Right penal handler for mobile device
    if (rightPenalWrapper.classList.contains('mobile-close')) {
        rightPenalWrapper.classList.remove('mobile-close');
    }
    // Highlight the selected color box in the list
    clearMultishadesSelection();
    const highlightColor = (typeof color === 'string' && color.startsWith('#')) ? color.toUpperCase() : color;
    const selectedBox = document.querySelector(`.saved-clr[data-id="${highlightColor}"]`);
    if (selectedBox) selectedBox.classList.add("multishades-selected-clr");

    emptyMultishadesFrameContent();
    multishadesFrameContent.scrollTo(0, 0);

    // Synchronize the input box if it exists
    const colorInput = document.getElementById("multishades-color-input");
    const textInput = document.getElementById("multishades-text-input");
    if (colorInput && color) colorInput.value = color;
    if (textInput && color) textInput.value = color.toUpperCase();

    // Update the action button icon based on color existence
    if (multishadesActionIcon && color) {
        const exists = isColorAvailableInStorage(color.toUpperCase());
        multishadesActionIcon.setAttribute("name", exists ? "eye-outline" : "download-outline");
        multishadesActionBtn.setAttribute('title', exists ? 'view color' : 'save color');
    }

    const basicShades = getMutlishadesInOneArray(color);

    basicShades.forEach((shade, index) => {
        let multishadesLayout = multishadesColorBoxLayout(shade, index, color, "box-height-90")
        multishadesLayout.dataset.colorsType = "basic";
        if (index === 0) multishadesLayout.classList.add("first-shade-box");
        if (index === basicShades.length - 1) multishadesLayout.classList.add("last-shade-box");
        multishadesFrameContent.appendChild(multishadesLayout);
    });


    // Create and append the "Get All Shades" link button
    const getAllBtn = document.createElement("button");
    getAllBtn.id = "get-all-shades-btn";
    getAllBtn.innerText = "Want All Shades ?";
    getAllBtn.className = "get-all-shades-link";

    getAllBtn.addEventListener("click", () => {
        getAllBtn.remove();
        const separator = appendSeparator(multishadesFrameContent);
        const firstAllShade = renderCompleteShades(color);

        // Scroll to the separator instead of the first shade 
        // to ensure we see the 'boundary' and avoid clipping at the top.
        const scrollTarget = separator || firstAllShade;

        if (scrollTarget) {
            setTimeout(() => {
                scrollTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });

    multishadesFrameContent.appendChild(getAllBtn);
}

function renderCompleteShades(color) {
    const allViewShades = getAllShades(color);
    let firstElement = null;
    let orgColor = color;

    allViewShades.allShades.forEach((shade, index) => {
        const layout = multishadesColorBoxLayout(shade.hex, index, orgColor, "box-height-50");
        layout.dataset.colorsType = "all";
        if (index === 0) {
            firstElement = layout;
            layout.classList.add("first-shade-box");
        }
        if (index === allViewShades.allShades.length - 1) layout.classList.add("last-shade-box");
        multishadesFrameContent.appendChild(layout);
    });

    return firstElement;
}

function appendSeparator(appendIn) {
    const separator = createSeparator();
    appendIn.appendChild(separator);
    return separator;
}

window.loadMultishades = loadMultishades;

// Navigation Exposure for external tools (like picker.js)
window.rightPenalNav = {
    switchFrame,
    updateBackButtonVisibility,
    updateSelectionMode,
    handleSaveAction,
    mainFrame,
    multishadesFrame,
    pickerFrame,
    webColorPickerFrame,
    get activeFrame() { return activeFrame; },
    set activeFrame(val) { activeFrame = val; },
    get previousFrame() { return previousFrame; },
    set previousFrame(val) { previousFrame = val; }
};


// appendSeparator(multishadesFrameContent);
// Multishades Input Box Logic
const mColorInput = document.getElementById("multishades-color-input");
const mTextInput = document.getElementById("multishades-text-input");

if (mColorInput && mTextInput) {
    mColorInput.addEventListener("change", (e) => {
        const val = e.target.value;
        mTextInput.value = val.toUpperCase();
        loadMultishades(val);

        if (isColorAvailableInStorage(val.toUpperCase())) {
            highlightSavedColor(val.toUpperCase(), false);
        }
    });

    mTextInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = e.target.value.trim();
            if (!val) return;

            const color = tinycolor(val);

            if (color.isValid()) {
                const hex = color.toHexString();
                mColorInput.value = hex;
                loadMultishades(hex);
                e.target.value = hex.toUpperCase();
                e.target.blur(); // Optional: remove focus after enter

                if (isColorAvailableInStorage(val.toUpperCase())) {
                    highlightSavedColor(val.toUpperCase(), false);
                }
            }
        }
    });

    // Handle blur for cleanup
    mTextInput.addEventListener("blur", (e) => {
        const val = e.target.value.trim();
        const color = tinycolor(val);
        if (color.isValid()) {
            e.target.value = color.toHexString().toUpperCase();
        }
    });
}
