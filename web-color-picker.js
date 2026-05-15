const appAndGradientWrapper = document.querySelector(".app-and-gradient-wrapper");
const webColorPickerContainer = document.getElementById("web-color-picker-container");
const webColorPickerFrameContent = document.querySelector(".web-color-picker-frame-content");
const iframeHolder = document.getElementById("iframe-holder");
const iframeOptions = document.querySelector('.iframe-options');
const moveLeftRightBtn = document.querySelector('.move-left-right-btn');
const iframeFullScreenToggleBtn = document.getElementById("iframe-full-size-toggle-btn");
const iframeHideIframeBtn = document.getElementById("iframe-close-btn");

const webColorPickerBtn = document.querySelector(".web-color-picker-btn");
// webColorPickerFrame is declared in right-penal.js


const urlInputWrapper = document.querySelector(".web-color-picker-url-input-wrapper");
const searchSiteBtn = document.getElementById("search-site-btn");
const webUrlInput = document.getElementById("web-url-input");


const pickColorBtn = document.getElementById("pick-clr-from-web-btn");
const pickColorBtnFromBottom = document.getElementById("bottom-picker-btn");
const pickedColorsList = document.querySelector(".picked-clr-from-web-section-content");
const historyList = document.querySelector(".wcp-url-history-content");
const clearHistoryBtn = document.querySelector(".wcp-url-history-clear-btn");

const WCP_HISTORY_KEY = "wcp_url_history";
let pickedColorsArray = [];
let pickedColorCount = 0;

webColorPickerBtn.addEventListener("click", () => {
    const nav = window.rightPenalNav;
    if (!nav) return;

    nav.switchFrame(nav.mainFrame, nav.webColorPickerFrame, "forward");
    nav.activeFrame = nav.webColorPickerFrame;
    nav.previousFrame = nav.mainFrame;

    if (typeof nav.updateBackButtonVisibility === 'function') {
        nav.updateBackButtonVisibility();
    }

    // showWebColorPickerFrame(); #Don't change this until i modified mannually !!!
});



iframeFullScreenToggleBtn.addEventListener('click', () => {
    toggleIframeFullscreen();
});

iframeHideIframeBtn.addEventListener('click', () => {
    // switchFrame(webColorPickerFrame, mainFrame, "backward");
    // activeFrame = mainFrame;
    // previousFrame = webColorPickerFrame;

    // if (typeof updateBackButtonVisibility === 'function') {
    //     updateBackButtonVisibility();
    // }

    hideWebColorPicker();
});

searchSiteBtn.addEventListener("click", () => {
    searchSite();
});

webUrlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchSite();
    }
});

pickColorBtn.addEventListener("click", () => {
    pickColorFromWeb();
});

pickColorBtnFromBottom.addEventListener("click", () => {
    pickColorFromWeb();
});


clearHistoryBtn.addEventListener("click", () => {
    let confirmation = confirm("Are you sure to delete History ?");
    if (confirmation) clearHistory();
    else return;
});

function pickColorFromWeb() {

    if (!window.EyeDropper) {
        alert("Your browser does not support the EyeDropper API.");
        return;
    }

    const eyeDropper = new EyeDropper();

    eyeDropper.open().then(result => {
        const color = result.sRGBHex.toUpperCase();
        addPickedColorToList(color);
    }).catch(e => {
        console.log("Color picking cancelled or failed:", e);
    });
}

function addPickedColorToList(color) {
    // 1. Remove if already exists (to move to bottom)
    pickedColorsArray = pickedColorsArray.filter(c => c !== color);

    // 2. Add to list
    pickedColorsArray.push(color);

    // 3. Update UI
    renderPickedColors();
}

/* ----------------------------------------------------------
   render again the picked colors after delete a color
   from storage to update the color status icon in picked colors
   ----------------------------------------------------------
*/
savedColorList.addEventListener('click', (e) => {
    if (e.target.closest('.move-trash-btn') || e.target.closest('.delete-perm-btn')) {
        renderPickedColors();
    }
})

function renderPickedColors() {
    let colors = pickedColorsArray;
    pickedColorsList.innerHTML = "";
    pickedColorCount = 0;

    colors.forEach(color => {
        pickedColorCount++;
        const colorItem = document.createElement('div');
        colorItem.setAttribute('data-color', color);
        colorItem.className = 'picked-color-item';

        const isSaved = typeof isColorAvailableInStorage === 'function' ? isColorAvailableInStorage(color) : false;

        colorItem.innerHTML = `
            <div class="picked-color-box">
                <span class="picked-color-indicator" style="background-color: ${color}"></span>
                <div class="picked-color-headings">
                    <span class="picked-color-series">Color ${pickedColorCount}</span>
                    <div class="picked-color-name">${color}</div>
                </div>
                <div class="picked-color-options">
                    <button class="picked-color-copy" title="Copy Color">
                        <ion-icon name="copy-outline"></ion-icon>
                    </button>
                    <button class="picked-color-save" title="${isSaved ? 'Already saved. Find it ?' : 'Save to Favorites'}" style="color: ${isSaved ? "#00ff00" : ""};">
                        <ion-icon name="${isSaved ? "checkmark-circle-outline" : "download-outline"}"></ion-icon>
                    </button>
                    <button class="picked-color-remove" title="Remove">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;

        colorItem.addEventListener('click', async (event) => {
            if (event.target.closest('.picked-color-copy')) {
                copyText(color);
            }
            else if (event.target.closest('.picked-color-save')) {
                const saveBtn = event.target.closest('.picked-color-save');
                if (typeof handleSaveAction === 'function') {
                    await handleSaveAction(color, saveBtn);
                } else {
                    colorListCreator(color);
                }
            }
            else if (event.target.closest('.picked-color-remove')) {
                removePickedColor(color);
            }
        });

        pickedColorsList.append(colorItem);
        colorItem.scrollIntoView({ behavior: "smooth", block: "end" });
    });
}


function removePickedColor(color) {
    pickedColorsArray = pickedColorsArray.filter(c => c !== color);
    renderPickedColors();
}

// Initial load for history
renderHistory();



function saveToHistory(url) {
    let history = JSON.parse(localStorage.getItem(WCP_HISTORY_KEY)) || [];

    // Remove the URL if it already exists in the list (to avoid duplicates)
    history = history.filter(item => item !== url);

    // Add to the beginning
    history.unshift(url);

    // Limit to 20 items
    if (history.length > 20) history.pop();


    localStorage.setItem(WCP_HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem(WCP_HISTORY_KEY)) || [];
    historyList.innerHTML = "";

    history.forEach(url => {
        const item = document.createElement("div");
        item.className = "wcp-url-history-item";
        item.innerHTML = `
            <div class="wcp-url-history-item-icon">
                <ion-icon name="globe-outline"></ion-icon>
            </div>
            <div class="wcp-url-history-item-content">
                <div class="wcp-url-history-item-title">${new URL(url).hostname}</div>
                <div class="wcp-url-history-item-url">${url}</div>
            </div>
            <div class="goto-site-icon">
                <ion-icon name="open-outline"></ion-icon>
            </div>
        `;

        item.addEventListener("click", () => {
            webUrlInput.value = url;
            searchSite();
        });

        historyList.append(item);
    });
}

function clearHistory() {
    localStorage.removeItem(WCP_HISTORY_KEY);
    renderHistory();
}

// Initial load
renderHistory();



function searchSite() {
    let url = webUrlInput.value.trim();
    if (!url) return;

    // Auto-fix URL if missing protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    urlInputWrapper.classList.remove("as-placeholder");
    showWebColorPickerFrame(url);
    saveToHistory(url);
}



function showWebColorPickerFrame(webURL) {
    if (webURL) {
        urlInputWrapper.classList.remove("as-placeholder");
    } else {
        urlInputWrapper.classList.add("as-placeholder");
    }

    webColorPickerContainer.classList.remove("hidden");

    setTimeout(() => {
        webColorPickerContainer.classList.remove("opacity-0");
    }, 10);

    // Remove existing iframe if any
    const existingIframe = document.getElementById('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }

    iframeHolder.append(getIframe(webURL));
}

webColorPickerFrameContent.addEventListener("scroll", () => {
    if (webColorPickerFrameContent.scrollTop > 40) {
        pickColorBtnFromBottom.classList.add("show");
    } else {
        pickColorBtnFromBottom.classList.remove("show");
    }
});

function hideWebColorPicker() {
    webColorPickerContainer.classList.add("opacity-0");
    setTimeout(() => {
        webColorPickerContainer.classList.add("hidden");
        if (document.getElementById('iframe'))
            document.getElementById('iframe').remove();
    }, 300);
}

function resetWebColorPickerState() {
    // Hide the iframe container
    hideWebColorPicker();
    // Return to placeholder state
    urlInputWrapper.classList.add("as-placeholder");
    // Clear input
    webUrlInput.value = "";
}

// Global exposure
window.hideWebColorPicker = hideWebColorPicker;
window.resetWebColorPickerState = resetWebColorPickerState;


/* 
    These functions are not in use right now that why they are returning nothing.
*/
function getWebColorPickerFrame() {
    return; // This function is not in use right now that's why it returning nothing.
    const container = document.createElement('div');
    container.classList.add("web-color-picker-container", "active", "absolute", "h-full", "w-full", "inset-0");
    container.setAttribute('id', 'web-color-picker-container');

    container.append(getIframeHolder());

    return container;
}
function getIframeHolder() {
    return; // This function is not in use right now that's why it returning nothing.
    const iframeHolder = document.createElement('div');
    iframeHolder.classList.add("iframe-holder", "frame-outline");

    setTimeout(() => {
        iframeHolder.classList.remove('frame-outline');
    }, 700);

    iframeHolder.append(getIframeOptions());
    iframeHolder.append(getIframe());

    return iframeHolder;
}
function getIframeOptions() {
    return; // This function is not in use right now that's why it returning nothing.
    const iframeOptions = document.createElement('div');
    iframeOptions.classList.add("iframe-options");

    let iframeFullscreenToggleBtn = document.createElement('button');
    let iframeHideIframeBtn = document.createElement('button');

    iframeFullscreenToggleBtn.setAttribute('id', 'iframe-full-size-toggle-btn');
    iframeHideIframeBtn.setAttribute('id', 'iframe-close-btn');

    iframeFullscreenToggleBtn.innerHTML = `<ion-icon name="expand-outline"></ion-icon>`;
    iframeHideIframeBtn.innerHTML = `<ion-icon name="close-outline"></ion-icon>`

    iframeFullscreenToggleBtn.onclick = () => {
        toggleIframeFullscreen();
    }
    iframeHideIframeBtn.onclick = () => {
        hideIframe();
    }

    iframeOptions.append(iframeFullscreenToggleBtn);
    iframeOptions.append(iframeHideIframeBtn);

    return iframeOptions;
}

function getIframe(webURL) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iframe');
    iframe.setAttribute('frameborder', '0');

    iframe.classList.add('opacity-0');
    iframe.src = webURL || "";

    setTimeout(() => {
        iframe.classList.remove('opacity-0');
    }, 500);

    return iframe;
}

moveLeftRightBtn.addEventListener('click', () => {
    iframeOptions.style.animation = 'move-up-down .4s ease-in-out';

    setTimeout(() => {
        iframeOptions.classList.toggle('place-left');
    }, 200);

    // Clean up animation when done
    iframeOptions.addEventListener('animationend', () => {
        iframeOptions.style.animation = '';
    }, { once: true });
});



function toggleIframeFullscreen() {
    const holder = document.querySelector('.iframe-holder');
    const btn = document.getElementById('iframe-full-size-toggle-btn');

    if (!holder || !btn) return;

    if (holder.classList.contains('full-size')) {
        holder.classList.remove('full-size');
        btn.innerHTML = `<ion-icon name="expand-outline"></ion-icon>`;
    } else {
        holder.classList.add('full-size');
        btn.innerHTML = `<ion-icon name="contract-outline"></ion-icon>`;
    }
}

function hideIframe() {
    const container = document.getElementById('web-color-picker-container');
    if (!container) return;

    container.classList.remove('active');
    setTimeout(() => {
        container.remove();
    }, 500);
}

// <div id="web-color-picker-container"
//     class="web-color-picker-container absolute h-full w-full inset-0">
//     <div id="iframe-holder" class="iframe-holder">
//         <div class="iframe-options">
//             <button id="iframe-full-size-toggle-btn">
//                 <ion-icon name="expand-outline"></ion-icon>
//             </button>
//             <button id="iframe-close-btn">
//                 <ion-icon name="close-outline"></ion-icon>
//             </button>
//         </div>
//         <iframe id="iframe" src="https://skiper-ui.com/components" frameborder="0"></iframe>
//     </div>
// </div>