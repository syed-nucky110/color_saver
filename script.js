let AppWrapper = document.querySelector('.app-wrapper')
let logo = document.querySelector(".logo");

let isMergeModeOn = false;

let sharpSound = document.getElementById('sharp-sound')
let popupSound = document.getElementById('popup-sound')
let menuSound = document.getElementById('menu-sound')
let alertSound = document.getElementById('alert-sound')
let lightSwitchSound = document.getElementById('light-switch-sound')
let popSound = document.getElementById('pop-sound')
let swooshSound = document.getElementById('swoosh-sound')
let toggleSwitchSound = document.getElementById('toggle-switch-sound')
let mouseClickSound = document.getElementById('mouse-click-sound')
let lockSound = document.getElementById('lock-sound')
let typingClickSound = document.getElementById('typing-click-sound')

let $rootElem = document.querySelector(":root");
let $accentColor = getComputedStyle($rootElem).getPropertyValue('--accent-color');

// Handle splash screen
const splashScreen = document.querySelector('.splash-screen');
// const splashMask = document.getElementById('splash-mask');
let displayContainer = document.querySelector(".display-container");

let isSidebarLocked = localStorage.getItem("isSidebarLocked");
let menuIsLocked = false;

let bubblingAnimation = "bubbling 520ms cubic-bezier(0.22, 0.61, 0.36, 1)";

// splashScreen.addEventListener("contextmenu", (event) => {
//       event.preventDefault();
// });

// splashScreen.addEventListener("keydown", (event) => {
//       event.preventDefault();
// });

let cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (event) => {
      cursorGlow.style.opacity = 1;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.left = `${event.clientX}px`;
})


function checkSidebarIsLocked() {

      if (isSidebarLocked !== "yes" && isSidebarLocked !== "no") {
            isSidebarLocked = "no";
            localStorage.setItem("isSidebarLocked", "no");
            unlockNavbar();

      }

      if (isSidebarLocked === "yes") {
            setTimeout(() => {
                  showMenuBar();
                  lockNavbar();
            }, 500);
      }

}

function restoreContainerSize() {
      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") return; // Don't restore size if in fullscreen

      const savedWidth = localStorage.getItem("favColorBoxW");
      const savedHeight = localStorage.getItem("favColorBoxH");

      // Only restore if both values exist and are not empty strings
      if (savedWidth && savedHeight && savedWidth !== "" && savedHeight !== "") {
            favColorListContainer.style.width = savedWidth + "px";
            favColorListContainer.style.height = savedHeight + "px";
      }
}

let muteSoundBtn = document.getElementById('mute-sound-btn')
let muteSoundBtnThumb = muteSoundBtn.querySelector(".thumb");

let soundStatus = localStorage.getItem("soundStatus") || "mute";

// Set initial state - default muted with proper styling
if (soundStatus === "mute") {
      muteSoundBtnThumb.classList.add("switch-on");
      // muteSoundBtn.style.backgroundColor = "#1070d1"; // Blue background when muted
      muteSoundBtn.style.backgroundColor = $accentColor;
}
else if (soundStatus !== "mute" && soundStatus !== "" && soundStatus !== "unmute" && !soundStatus) {
      localStorage.setItem("soundStatus", "mute");
      muteSoundBtnThumb.classList.add('switch-on');
      muteSoundBtn.style.backgroundColor = $accentColor;
}
else if (soundStatus === "unmute") {
      muteSoundBtnThumb.classList.remove('switch-on');
      muteSoundBtn.style.backgroundColor = ""; // Default background when unmuted
}

// Sound toggle functionality
muteSoundBtn.addEventListener("click", () => {
      soundStatus = localStorage.getItem("soundStatus");

      if (soundStatus === "mute") {
            // Unmute sounds
            localStorage.setItem("soundStatus", "unmute");
            muteSoundBtnThumb.classList.remove("switch-on");
            muteSoundBtn.style.backgroundColor = "";

            // Play test sound
            playSound(toggleSwitchSound);

            // Show feedback
            if (typeof throwMessage === 'function') {
                  throwMessage("Sound Effects Enabled", "#00ff00", "volume-high-outline");
            }
      }
      else {
            // Mute sounds
            localStorage.setItem("soundStatus", "mute");
            muteSoundBtnThumb.classList.add("switch-on");
            // muteSoundBtn.style.backgroundColor = "#1070d1";
            muteSoundBtn.style.backgroundColor = $accentColor;

            // Show feedback
            if (typeof throwMessage === 'function') {
                  throwMessage("Sound Effects Disabled", "#ff6b35", "volume-mute-outline");
            }
      }
});

// Keyboard shortcut for sound toggle
window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "q") {
            event.preventDefault();
            muteSoundBtn.click(); // Trigger the same logic
      }
});


let favColorListContainer = document.querySelector(".fav-color-list-container");
let colorPicker = document.querySelector('input[type="color"]');
let savedColorList = document.querySelector(".saved-colors-list");
let menu = document.querySelector(".menu");
let menuIcon = document.querySelector("#menu-icon");
let menuOptionsBox = document.querySelector(".menu-options-box");
let allOptions = document.querySelector(".all-options");
let fullScreenBtn = document.querySelector(".screen-size-options .option");
let savedColorCounting = document.querySelector("#color-counting");
let allColorsCounting = document.querySelectorAll(".saved-clr");
let searchBar = document.querySelector("#search-bar");
let searchSuggestions = document.querySelector("#search-suggestions");
const themeBtns = document.querySelectorAll(".theme-btn");
const lightThemeBtn = document.getElementById("light-theme-btn");
const darkThemeBtn = document.getElementById("dark-theme-btn");
const systemThemeBtn = document.getElementById("system-theme-btn");

// function to set tooltip
function setTooltip(selector, text) {
      if (window.innerWidth > 992) {
            tippy(selector, {
                  content: text,
                  allowHTML: true,
                  trigger: 'mouseenter focus'
            })
      }
}

// Calling functions to set tooltip
setTooltip('#clr-picker', "Pick Color");
setTooltip('#preview-box-color-picker', "Pick Color");
setTooltip('#label-clr-picker', "Pick Color");
setTooltip('.input-color-indicator', 'Color Indicator')

// Search functionality
function handleSearch(event) {
      //     const searchText = event.target.value.toLowerCase();
      const searchText = event.target.value.toUpperCase();
      const allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
      const filteredColors = allColors.filter(color =>
            //   color.toLowerCase().includes(searchText)
            color.toUpperCase().includes(searchText)
      );

      if (searchText && filteredColors.length > 0) {
            searchSuggestions.style.display = "block";
            searchSuggestions.innerHTML = filteredColors
                  .map((color, index) => `
                <div class="search-suggestion-item" data-index="${index}" data-color="${color}">
                    <div class="color-preview" style="background-color: ${color}"></div>
                    <span class="suggestion-color-name">${color}</span>
                </div>
            `)
                  .join("");
      } else {
            searchSuggestions.style.display = "none";
      }
}

function handleSuggestionClick(event) {
      const item = event.target.closest('.search-suggestion-item');
      if (item) {
            const color = item.dataset.color;
            searchBar.value = '';
            searchSuggestions.style.display = "none";
            highlightSavedColor(color);
      }
}

function handleSearchKeydown(event) {
      const items = searchSuggestions.querySelectorAll('.search-suggestion-item');
      const activeItem = searchSuggestions.querySelector('.search-suggestion-item.active');
      let activeIndex = Array.from(items).indexOf(activeItem);

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();

            if (event.key === 'ArrowDown') {
                  activeIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
            } else {
                  activeIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
            }

            items.forEach(item => item.classList.remove('active'));
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
      }

      if (event.key === 'Enter' && activeItem) {
            const color = activeItem.dataset.color;
            searchBar.value = '';
            searchSuggestions.style.display = "none";
            highlightSavedColor(color);
      }

      if (event.key === 'Escape') {
            searchBar.value = '';
            searchSuggestions.style.display = "none";
      }
}

// Hide suggestions when clicking outside
document.addEventListener('click', (event) => {
      if (!event.target.closest('#search-color-box')) {
            searchSuggestions.style.display = "none";
      }
});

searchBar.addEventListener('input', handleSearch);
searchBar.addEventListener('keydown', handleSearchKeydown);
searchSuggestions.addEventListener('click', handleSuggestionClick);

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "e") {
            searchBar.focus();
      }
})

let currentTheme = localStorage.getItem("theme") || "system";

// Function to apply theme
function applyTheme(themeMode, fromAutoMode = false) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Remove active class from all buttons
      themeBtns.forEach(btn => btn.classList.remove("active"));

      if (themeMode === "dark") {
            enableDarkMode(fromAutoMode);
            darkThemeBtn.classList.add("active");
      } else if (themeMode === "light") {
            disableDarkMode(fromAutoMode);
            lightThemeBtn.classList.add("active");
      } else {
            // System mode
            if (systemThemeBtn) systemThemeBtn.classList.add("active");
            if (isDark) {
                  document.body.classList.add("dark-theme");
            } else {
                  document.body.classList.remove("dark-theme");
            }
            localStorage.setItem("theme", "system");
      }
}

// Initial application
applyTheme(currentTheme);

// Button listeners
if (lightThemeBtn) {
      lightThemeBtn.addEventListener("click", () => {
            if (typeof stopAutoThemeMode === 'function') stopAutoThemeMode();
            playSound(toggleSwitchSound);
            applyTheme("light");
      });
}

if (darkThemeBtn) {
      darkThemeBtn.addEventListener("click", () => {
            if (typeof stopAutoThemeMode === 'function') stopAutoThemeMode();
            playSound(toggleSwitchSound);
            applyTheme("dark");
      });
}

if (systemThemeBtn) {
      systemThemeBtn.addEventListener("click", () => {
            if (typeof stopAutoThemeMode === 'function') stopAutoThemeMode();
            playSound(toggleSwitchSound);
            applyTheme("system");
      });
}

// Update on system change if in system mode
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (localStorage.getItem("theme") === "system") {
            applyTheme("system");
      }
});

function enableDarkMode(fromAutoMode = false) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
}

function disableDarkMode(fromAutoMode = false) {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
}

// Modern Layout Toggle Elements
const layoutToggleContainer = document.querySelector(".layout-toggle-container");
let listView = document.getElementById("list-view");
let gridView = document.getElementById("grid-view");
let layoutToggleSlider = document.querySelector(".layout-toggle-slider");
let layoutOptions = document.querySelectorAll(".layout-toggle-option");

// Initialize layout
let getLayoutType = localStorage.getItem("layout-type") || "";

if (getLayoutType === "") {
      setLayoutType("list");
}

// Apply initial layout state
setSelectedLayoutOption();

// Modern Toggle Event Listeners
function initializeLayoutToggle() {
      // Click events for both options
      listView.addEventListener("click", () => toggleLayoutOption("list"));
      gridView.addEventListener("click", () => toggleLayoutOption("grid"));

      // Keyboard accessibility for the container
      layoutToggleContainer.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  // Toggle to opposite of current selection
                  const currentType = localStorage.getItem("layout-type") || "list";
                  const newType = currentType === "list" ? "grid" : "list";
                  toggleLayoutOption(newType);
            }

            // Arrow key navigation
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  const currentType = localStorage.getItem("layout-type") || "list";
                  const newType = currentType === "list" ? "grid" : "list";
                  toggleLayoutOption(newType);
            }
      });
}

// Initialize the toggle functionality
initializeLayoutToggle();

function toggleLayoutOption(layoutType) {
      // Check if Auto Grid View is enabled - if so, disable toggle
      if (localStorage.getItem("autoGridView") === "enable") {
            layoutToggleContainer.classList.add("disabled");
            throwMessage("First, turn off Auto Grid View")
            return;
      }

      // Turn off Auto Grid View when manually changing layout
      if (localStorage.getItem("autoGridView") === "enable") {
            setAutoGridView("disable");
      }

      // Update layout type
      setLayoutType(layoutType);
      setSelectedLayoutOption();
}

function setLayoutType(type) {
      localStorage.setItem("layout-type", type);
}

function setSelectedLayoutOption() {
      const type = localStorage.getItem("layout-type") || "list";

      // Remove all active states first
      listView.classList.remove("active");
      gridView.classList.remove("active");
      listView.setAttribute("aria-checked", "false");
      gridView.setAttribute("aria-checked", "false");
      layoutToggleContainer.classList.remove("grid-active");

      if (type === "list") {
            // Set list view as active
            listView.classList.add("active");
            listView.setAttribute("aria-checked", "true");
            savedColorList.classList.remove("saved-color-grid-view");

            // Move slider to list position (left)
            layoutToggleContainer.classList.remove("grid-active");

      } else if (type === "grid") {
            // Set grid view as active
            gridView.classList.add("active");
            gridView.setAttribute("aria-checked", "true");
            savedColorList.classList.add("saved-color-grid-view");

            // Move slider to grid position (right)
            layoutToggleContainer.classList.add("grid-active");
      }
}

colorPicker.addEventListener("input", (event) => {
      addColorInput.value = colorPicker.value.toUpperCase();
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "g") {
            event.preventDefault();

            let currentLayout = localStorage.getItem("layout-type") || "list";
            let newLayout = currentLayout === "grid" ? "list" : "grid";

            toggleLayoutOption(newLayout);
      }
});


let sidebarBtnArea = document.querySelector(".sidebar-buttons-area");
let sidebarOptions = document.querySelector(".menu-options-box .all-options"); // change .menu-scroll instead of .all-options
let menuCloseBtn = document.getElementById("menu-close-btn");

sidebarOptions.addEventListener("scroll", () => {
      sidebarBtnArea.style.transition = "background .3s ease, box-shadow .3s ease";
      if (sidebarOptions.scrollTop >= 20) {
            sidebarBtnArea.style.backgroundColor = "#000000";
            // sidebarBtnArea.style.backdropFilter = "blur(10px)";
            sidebarBtnArea.style.boxShadow = "0 0 40px rgba(0, 0, 0, 1)"
      }
      else {
            sidebarBtnArea.style.backgroundColor = "transparent";
            // sidebarBtnArea.style.backdropFilter = "blur(0)";
            sidebarBtnArea.style.boxShadow = "none"
      }
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "s") {
            event.stopPropagation();
            event.preventDefault();
            if (menuOptionsBox.classList.contains("open")) {
                  hideMenuBar();
            }
            else {
                  showMenuBar();
            }
      }
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "x") {
            event.preventDefault();
            // if (localStorage.getItem("screen-size") == "full") return throwMessage("Exit Fullscreen First")

            if (menuOptionsBox.classList.contains("open")) {
                  menuIsLocked ? unlockNavbar() : lockNavbar();
            }
            else {
                  menuIsLocked ? unlockNavbar() : showMenuBar(), lockNavbar();
            }
      }
})

menu.addEventListener("click", (event) => {
      // showHideMenuOptions();
      playSound(mouseClickSound)
      showMenuBar();
      event.stopPropagation();
});

menu.addEventListener("dblclick", (event) => {
      console.log("hello");
      event.stopPropagation();
});

menuCloseBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      // showHideMenuOptions();
      playSound(mouseClickSound)
      hideMenuBar();
});


// *** THIS FUNCTION IS TEMPORARLY DISABLED *** //

// function showHideMenuOptions() {
//       allOptions.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

//       if (menuIsOpen == false) {
//             menuOptionsBox.style.display = "flex";
//             // menuIcon.setAttribute("name", "close");
//             setTimeout(() => {
//                   allOptions.style.transform = "translateX(0)";
//             }, 100);
//             menuIsOpen = true;

//             // Reset scroll position 
//             allOptions.scrollTop = 0;
//       }
//       else {
//             allOptions.style.transition = "transform 0.4s ease"
//             allOptions.style.transform = "translateX(-100%)";
//             // menuIcon.setAttribute("name", "ellipsis-vertical");
//             setTimeout(() => {
//                   menuOptionsBox.style.display = "none";
//             }, 500);
//             menuIsOpen = false;
//       }
// }

function showMenuBar() {
      menuOptionsBox.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

      // menuOptionsBox.style.visibility = "visible";
      menuOptionsBox.classList.add("open");
      setTimeout(() => {
            menuOptionsBox.style.transform = "translateX(0)";
      }, 10);
      // menuIsOpen = true;

      // Reset scroll position 
      allOptions.scrollTop = 0;
}

function hideMenuBar() {
      if (menuIsLocked) {
            return;
      }
      menuOptionsBox.style.transition = "transform 0.4s ease"

      menuOptionsBox.style.transform = "translateX(-100%)";
      menuOptionsBox.classList.remove("open");
      setTimeout(() => {
            // menuOptionsBox.style.visibility = "hidden";
      }, 500);
}

function arrangeDispalycontainerSize() {
      displayContainer.style.width = "calc(100% - 220px)"
      displayContainer.style.marginLeft = "220px";
}

function disarrangeDispalycontainerSize() {
      displayContainer.style.width = "";
      displayContainer.style.marginLeft = "";
}

let navLockBtn = document.getElementById("lock-navbar-btn");
let navLockIcon = document.getElementById("nav-lock-icon");

navLockBtn.addEventListener("click", () => {

      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") {
            // return throwMessage("Exit Fullscreen First", "white");
            // arrangeDispalycontainerSize();
      }
      playSound(lockSound)

      if (menuIsLocked) {
            unlockNavbar();
      }
      else {
            lockNavbar();
      }
})

let mainOptions = document.querySelector('.top-area-options')

function lockNavbar() {

      localStorage.setItem("isSidebarLocked", "yes");

      navLockIcon.setAttribute("name", "lock-closed");
      navLockBtn.setAttribute("title", "Unlock sidebar");
      menuCloseBtn.style.visibility = "hidden";
      // themeBtn.style.transform = "translateX(170px)";

      menu.style.display = "none";
      mainOptions.style.zIndex = "200";

      (localStorage.getItem("screen-size") == "full") ? arrangeDispalycontainerSize() : disarrangeDispalycontainerSize();
      menuIsLocked = !menuIsLocked;
}

function unlockNavbar() {

      localStorage.setItem("isSidebarLocked", "no");

      navLockIcon.setAttribute("name", "lock-open-outline");
      navLockBtn.setAttribute("title", "Lock sidebar");
      menuCloseBtn.style.visibility = "visible";
      // themeBtn.style.transform = "translateX(0px)";

      menu.style.display = "";
      mainOptions.style.zIndex = "";

      disarrangeDispalycontainerSize();
      menuIsLocked = !menuIsLocked;
}

menuOptionsBox.addEventListener("click", (event) => {
      event.stopPropagation();
});

displayContainer.addEventListener("click", (event) => {
      if (event.target == displayContainer || event.target != allOptions) {
            // showHideMenuOptions(); // hide options
            hideMenuBar();
      }
});

let fullScreenIcon = document.querySelector(".screen-size-icon");
let screenSizeText = document.querySelector(".screen-size-options .option span");
let deleteAllColor = document.querySelector(".delete-color-options .option ");

let screenSize = localStorage.getItem("screen-size") || "";

if (screenSize === "") {
      localStorage.setItem("screen-size", "normal");
      removeFullScreen();
}
else if (screenSize === "full") {
      setFullScreen();
}
else if (screenSize === "normal") {
      removeFullScreen();
}

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "f") {
            event.preventDefault();
            if (resizerIsOn) {
                  OffResizer();
            }

            // if (menuIsLocked) {
            //       throwMessage("Unlock Sidebar First");
            // }
            // else {
            // }
            (localStorage.getItem("screen-size") == "full") ? removeFullScreen() : setFullScreen();
      }
})

fullScreenBtn.addEventListener("click", () => {
      screenSize = localStorage.getItem("screen-size");

      // disarrangeDispalycontainerSize();
      // Full screen not allowd while sidebar is locked
      if (menuIsLocked) {
            // return throwMessage("Unlock Sidebar First", "white");
            // arrangeDispalycontainerSize();
      }

      if (resizerIsOn) {
            // return throwMessage("Turn off Resize First", "white");
            OffResizer();
      }

      if (screenSize === "normal") {
            setFullScreen();
            // showHideMenuOptions();
            // hideMenuBar();
      }
      else if (screenSize === "full") {
            removeFullScreen();
            // showHideMenuOptions();
            // hideMenuBar();
      }
});

function setFullScreen() {
      favColorListContainer.classList.add("full-screen");
      fullScreenIcon.setAttribute("name", "contract-outline");
      screenSizeText.innerText = "Exit full screen";
      localStorage.setItem("screen-size", "full");

      hideMenuBar();
      (menuIsLocked) ? arrangeDispalycontainerSize() : disarrangeDispalycontainerSize();
}

function removeFullScreen() {
      favColorListContainer.classList.remove("full-screen");
      fullScreenIcon.setAttribute("name", "expand-outline");
      screenSizeText.innerText = "Full screen";
      localStorage.setItem("screen-size", "normal");

      disarrangeDispalycontainerSize();
      // restoreContainerSize(); // Restore saved size when exiting fullscreen
}

function enableDisableBtn() {
      if (window.innerWidth < 480) {
            fullScreenBtn.style.pointerEvents = "none";
            fullScreenBtn.style.opacity = ".5";
            fullScreenBtn.style.cursor = "no-drop";
      }
      else {
            fullScreenBtn.style.pointerEvents = "auto";
            fullScreenBtn.style.cursor = "";
            fullScreenBtn.style.opacity = "1";
      }
}

// Delete all colors
let resposnse;
deleteAllColor.addEventListener("click", () => {
      const saved = JSON.parse(localStorage.getItem("saveColor")) || [];
      const trash = JSON.parse(localStorage.getItem("trashColors")) || [];
      const existingCount = trash.length;
      const spaceLeft = orgTrashColorLimit - existingCount;
      const toTrashCount = Math.max(0, Math.min(spaceLeft, saved.length));
      const toDeleteCount = Math.max(0, saved.length - toTrashCount);

      deleteAllPlan = {
            toTrashColors: saved.slice(0, toTrashCount),
            toDeleteCount,
            total: saved.length
      };

      if (deletePopupTitle) {
            deletePopupTitle.textContent = `Out of ${saved.length} colors, ${toTrashCount} will be moved to Trash, and ${toDeleteCount} will be permanently deleted.`;
      }

      popUpContainer.style.display = "flex";
});

window.addEventListener("load", enableDisableBtn);
window.addEventListener("resize", enableDisableBtn);

// tippy('.cross-btn', {
//       content: 'close',
//       theme: 'dark',
// });

// tippy('.theme-btn', {
//       content: 'theme',
// });

let choosedColorContainer = document.querySelector(".choosed-color-container");
let choosedColorBox = document.querySelector(".choosed-color-box");
let closeClrBoxBtn = document.querySelector(".cross-btn");

choosedColorContainer.addEventListener("click", (event) => {
      if (event.target != choosedColorBox && event.target == choosedColorContainer) {
            closeColorEditor();
      }
});

choosedColorContainer.addEventListener("keydown", (event) => {
      if (event.key == "Escape") {
            closeColorEditor();
      }
});

const contextMenu = document.getElementById("custom-context-menu");
const contextSeletOption = document.getElementById("context-select-option");
const contextSeletAllOption = document.getElementById("context-select-all-option");
const contextEditOption = document.getElementById("context-edit-option");
const selectionBar = document.getElementById("selection-bar");
const selectionCount = document.getElementById("selection-count");
const deleteSelectedBtn = document.getElementById("delete-selected-btn");
const cancelSelectionBtn = document.getElementById("cancel-selection-btn");

let seletionModOn = false;
let selectedColors = []; // array to store selected colors

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "a") {
            event.preventDefault()
            seletionModOn = true;
            selectionBar.style.display = "flex";
            selectAllColors();
      }
})

// Selection mode toggle
contextSeletOption.addEventListener("click", () => {
      seletionModOn = true;
      selectionBar.style.display = "flex"; // show bar
      updateSelectionCount();
});

contextSeletAllOption.addEventListener("click", () => {
      seletionModOn = true;
      selectionBar.style.display = "flex"; // show bar
      selectAllColors();
});

contextEditOption.addEventListener("click", () => {
      openColorEditor(choosedCurrentColorBox);
      enableDisableEditingMode("enable");
      showColorPreviewBox();
      setTimeout(() => {
            colorNameInput.focus();
      }, 100);
})

function selectAllColors() {
      const savedColors = document.querySelectorAll(".saved-clr");

      savedColors.forEach(colorBox => {
            const color = colorBox.getAttribute("data-id"); // assume har colorBox me ek data-color attribute hai

            // Agar pehle se selected nahi hai to add karo
            if (!colorBox.classList.contains("selected")) {
                  colorBox.classList.add("selected");
                  selectedColors.push(color);
            }
      });

      updateColorCounter(); // count update karna ho to
      updateSelectionCount(); // count update karna ho to
}


// Update count in bar
function updateSelectionCount() {
      const total = document.querySelectorAll(".saved-clr").length;
      selectionCount.innerText = `${selectedColors.length} / ${total}`;
}

// Delete only selected colors with Trash Limit check
deleteSelectedBtn.addEventListener("click", () => {
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
      const existingCount = trashColors.length;
      const selectedCount = selectedColors.length;
      const spaceLeft = orgTrashColorLimit - existingCount;

      if (selectedCount <= 0) return;

      if (existingCount + selectedCount <= orgTrashColorLimit) {
            // ✅ Saare fit ho jayenge trash me
            selectedColors.forEach(id => {
                  const el = document.querySelector(`.saved-clr[data-id="${id}"]`);
                  if (el) {
                        deleteColorFromStorage(el.dataset.id);
                        trashColors.push(el.dataset.id); // trash me add
                        removeFromDOM(el);
                  }
            });
            localStorage.setItem("trashColors", JSON.stringify(trashColors));
            showSuccessMessage(`${selectedCount} colors moved to Trash`);

      } else {
            if (spaceLeft > 0) {
                  // ⚠️ Kuch trash me, kuch permanent delete
                  if (confirm(`Only ${spaceLeft} colors can be moved to Trash. The rest will be permanently deleted. Continue?`)) {
                        const toTrash = selectedColors.slice(0, spaceLeft);
                        const toDelete = selectedColors.slice(spaceLeft);

                        toTrash.forEach(id => {
                              const el = document.querySelector(`.saved-clr[data-id="${id}"]`);
                              if (el) {
                                    deleteColorFromStorage(el.dataset.id);
                                    trashColors.push(el.dataset.id);
                                    removeFromDOM(el);
                              }
                        });

                        toDelete.forEach(id => {
                              const el = document.querySelector(`.saved-clr[data-id="${id}"]`);
                              if (el) {
                                    deleteColorFromStorage(el.dataset.id);
                                    removeFromDOM(el); // trash nahi → direct delete
                              }
                        });

                        localStorage.setItem("trashColors", JSON.stringify(trashColors));
                        showSuccessMessage(`${toTrash.length} moved to Trash, ${toDelete.length} permanently deleted`);
                  }
            } else {
                  // ❌ Trash full → sab permanent delete
                  if (confirm(`Trash is full. Selected colors will be permanently deleted. Continue?`)) {
                        selectedColors.forEach(id => {
                              const el = document.querySelector(`.saved-clr[data-id="${id}"]`);
                              if (el) {
                                    deleteColorFromStorage(el.dataset.id);
                                    removeFromDOM(el);
                              }
                        });
                        showSuccessMessage(`${selectedColors.length} permanently deleted`);
                  }
            }
      }

      // Clear array & UI
      selectedColors = [];
      updateSelectionCount();
      exitSelectionMode();
      isTrashFull();
      updateColorCounter();
});

// Cancel selection
cancelSelectionBtn.addEventListener("click", () => {
      exitSelectionMode();
});

// Exit selection mode
function exitSelectionMode() {
      seletionModOn = false;
      selectedColors = [];
      document.querySelectorAll(".saved-clr.selected").forEach(el => {
            el.classList.remove("selected");
      });
      selectionBar.style.display = "none";
}

let choosedCurrentColorBox = null;
savedColorList.addEventListener("contextmenu", (event) => {

      choosedCurrentColorBox = event.target.closest(".saved-clr");

      if (event.target.closest(".delete-clr-btn")) return;

      if (event.target.closest(".saved-clr")) {
            event.preventDefault();

            // Pehle hide kar do (agar already open hai)
            contextMenu.style.display = "block";

            // Screen dimensions
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            // Menu dimensions
            const menuW = contextMenu.offsetWidth;
            const menuH = contextMenu.offsetHeight;

            // Default position
            let posX = event.clientX;
            let posY = event.clientY;

            // Agar right side space nahi hai → left side
            if (posX + menuW > screenW) {
                  posX = event.clientX - menuW;
            }

            // Agar bottom space nahi hai → upar
            if (posY + menuH > screenH) {
                  posY = event.clientY - menuH;
            }

            contextMenu.style.left = posX + "px";
            contextMenu.style.top = posY + "px";
      }
});

// Click anywhere → hide menu
document.addEventListener("click", () => {
      contextMenu.style.display = "none";
});

// contextSeletOption.addEventListener("click", () => {
//       seletionModOn = true;
// })

let clickCount = 0;
let clickTimer = null;

function moveCenter(box) {
      const boxRect = box.getBoundingClientRect();

      // Viewport (Screen) ka center nikalein
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      // Element ka maujooda center nikalein
      const elementCenterX = boxRect.left + boxRect.width / 2;
      const elementCenterY = boxRect.top + boxRect.height / 2;

      // Kitna move karna hai (Distance)
      const moveX = viewportCenterX - elementCenterX;
      const moveY = viewportCenterY - elementCenterY;

      // Apply transform
      box.style.transition = "transform 0.3s ease"; // Smooth animation
      box.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.3)`;
}

savedColorList.addEventListener("mouseup", (event) => {

      const box = event.target.closest(".saved-clr");
      // moveCenterbox);

      if (event.target.closest(".delete-clr-btn")) return;
      if (seletionModOn && box) {

            box.classList.toggle("selected");

            const colorId = box.dataset.id;

            if (box.classList.contains("selected")) {
                  if (!selectedColors.includes(colorId)) {
                        selectedColors.push(colorId);
                  }
            } else {
                  selectedColors = selectedColors.filter(id => id !== colorId);
            }

            updateSelectionCount();
            return;
      }


      if (!box || event.target.closest(".delete-clr-btn")) return;

      clickCount++;

      if (clickCount === 1) {
            // Wait for second click
            clickTimer = setTimeout(() => {
                  // Single click
                  const textToCopy = box.querySelector(".color-name").innerText;
                  copyText(textToCopy);
                  playSound(menuSound);

                  clickCount = 0;
                  clickTimer = null;
            }, 250); // Max gap allowed between clicks
      } else if (clickCount === 2) {
            // Double click detected
            clearTimeout(clickTimer);
            openColorEditor(box);

            // Hide color preveiw box if, it is open already
            hideColorPreviewBox();

            clickCount = 0;
            clickTimer = null;
      }
})

let currentEditingBox = null;
let currentChoosedBox = null;

// openColorEditor(); // for testing
function openColorEditor(box) {

      // currentChoosedBox = box;
      setTimeout(() => {
            choosedColorContainer.style.display = "flex";
            playSound(popupSound)
      }, 100);

      // return;

      // moveCenter(box);

      let colorName = box.querySelector(".color-name").innerText;
      let bgColor = colorName;
      document.querySelector('input[type="color"]').value = colorName;

      let colorNameInput = document.querySelector("#color-code-box");
      let displayColorBox = document.querySelector("#display-color-box");

      colorNameInput.value = colorName;
      displayColorBox.style.backgroundColor = bgColor;

      currentEditingBox = box;
}

closeClrBoxBtn.addEventListener("click", () => closeColorEditor());

function closeColorEditor() {

      hideClrPopUpErrorMessage();

      // choosedColorBox.style.animation = "drop .7s ease";
      choosedColorBox.style.animation = "smoothHide 0.2s ease";
      disableEditing();
      setTimeout(() => {
            choosedColorContainer.style.display = "none";
            choosedColorBox.style.animation = "";
      }, 190);

      colorNameInput.disabled = true;
}


let copyTextBtn = document.querySelector("#copy-clr-btn");
let colorNameInput = document.querySelector("#color-code-box");

copyTextBtn.addEventListener("click", () => {
      copyText(colorNameInput.value);
});

function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
            // Modern method
            navigator.clipboard.writeText(text)
                  .then(() => { })
                  .catch(() => fallbackCopy(text));
      } else {
            // Fallback for Safari/iPhone/Old browsers
            fallbackCopy(text);
      }
      showSuccessMessage("Copied!");
}

function showSuccessMessage(text) {
      const popupWrapper = document.createElement('div');
      const popup$gradientBorder = document.createElement('div');
      const copyTextPopup = document.createElement("div");
      const icon = document.createElement("ion-icon");
      const textBox = document.createElement("span");

      popupWrapper.classList.add('success-message-layout-wrapper');
      popup$gradientBorder.classList.add('gradient-border');
      copyTextPopup.classList.add("success-message-layout");
      icon.setAttribute("name", "checkmark-circle");
      textBox.textContent = text;

      copyTextPopup.appendChild(icon);
      copyTextPopup.appendChild(textBox);
      popupWrapper.appendChild(popup$gradientBorder);
      popupWrapper.appendChild(copyTextPopup)
      document.body.appendChild(popupWrapper);

      // Slide down animation
      popupWrapper.style.animation = "slideDown 0.3s ease forwards";
      popup$gradientBorder.classList.add('rotation-glow');

      setTimeout(() => {
            // Slide up animation
            popupWrapper.style.animation = "slideUp 0.3s ease forwards";

            // Remove after animation ends
            popupWrapper.addEventListener("animationend", (e) => {
                  if (e.animationName === "slideUp") {
                        popupWrapper.remove();
                  }
            });
      }, 2500); // visible for 1s 5ms
}

function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.style.position = "fixed";
      textarea.style.top = "-100px";
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999); // iPhone compatibility
      document.execCommand('copy');
      document.body.removeChild(textarea);
}


// Editing controling
let defaultButtons = document.querySelector(".default-btns");
let editingButtons = document.querySelector(".editing-btns");
let editBtn = document.querySelector("#edit-clr-btn");
let backBtn = document.querySelector("#back-btn");
let saveBtn = document.querySelector("#save-btn");
let save_clr = document.querySelector('#save');
let save_as_copy = document.querySelector('#save-as-copy');
let previewBox = document.getElementById("color-preview-box");
let previewBoxColorPicker = document.getElementById("preview-box-color-picker");
let emptyInputBoxBtn = document.getElementById("empty-input-btn");

let orgColorCode = "";
editBtn.addEventListener("click", () => {
      enableDisableEditingMode("enable");
      showColorPreviewBox();
      // previewBox.style.backgroundColor = "transparent";
      // orgColorCode = colorNameInput.value;
});

emptyInputBoxBtn.addEventListener("click", () => {
      colorNameInput.value = "";
      previewBox.style.backgroundColor = "transparent";
      colorNameInput.focus();
      hideClrPopUpErrorMessage();
})

colorNameInput.addEventListener("keydown", (event) => {
      let typedColor = colorNameInput.value.toUpperCase();
      if (event.key == "Enter") {
            if(!isColorValid(typedColor)) {
                  let colorCodeWrapper = document.querySelector(".color-code-box-wrapper");
                  showClrPopUpErrorMessage('wrong');
                  errorVibration(colorCodeWrapper);
                  return;
            }
            colorSavingProcess();
      }
})

colorNameInput.addEventListener("input", () => {
      playSound(typingClickSound)
      colorNameInput.value = colorNameInput.value.toUpperCase();
      let typedColor = colorNameInput.value.toUpperCase();
      previewBox.style.backgroundColor = typedColor;

      checkColorStatus(typedColor);
})

function checkColorStatus(typedColor) {
      if(typedColor === orgColorCode.toUpperCase()) {
            hideClrPopUpErrorMessage();
            return;
      }
      
      if(isColorAvailableInStorage(typedColor)) {
            showClrPopUpErrorMessage('saved')
      }
      else if(isColorAvailableInTrash(typedColor)) {
            showClrPopUpErrorMessage('trash');
      }
      else {
            hideClrPopUpErrorMessage();
      }

}

let errorMessageBox = document.getElementById('popup-clr-error-message')
function showClrPopUpErrorMessage(reason) {
      let errorMessage;
      let errorColor;

      switch (reason) {
            case 'saved':
                  errorMessage = '<ion-icon name="checkmark-circle"></ion-icon> Already Saved';
                  errorColor = "#008000";
                  break;
            case 'trash':
                  errorMessage = '<ion-icon name="alert-circle"></ion-icon> Available in Trash';
                  errorColor = '#0051B0';
                  break;
            case 'wrong':
                  errorMessage = '<ion-icon name="close-circle"></ion-icon> Not a Valid Color';
                  errorColor = '#ff0000';
                  break
            default:
                  break;
      }

      errorMessageBox.innerHTML = errorMessage;
      errorMessageBox.style.color = errorColor;
      colorNameInput.classList.add('move-upwarded-color-code-box');
      errorMessageBox.classList.remove('hidden');
}

function hideClrPopUpErrorMessage() {
      colorNameInput.classList.remove('move-upwarded-color-code-box');
      errorMessageBox.classList.add('hidden');
}

function errorVibration(el) {
      el.classList.add('magic-vibrate-2');

      el.addEventListener('animationend', (e) => {
            if (e.animationName === 'magic-vibrate-2') {
                  el.classList.remove('magic-vibrate-2');
            }
      });
}

previewBoxColorPicker.addEventListener("input", () => {
      colorNameInput.value = previewBoxColorPicker.value.toUpperCase();
      previewBox.style.backgroundColor = previewBoxColorPicker.value;

      checkColorStatus(colorNameInput.value);
})

previewBoxColorPicker.addEventListener('focus', () => {
      previewBox.style.transition = "none"
})
previewBoxColorPicker.addEventListener('blur', () => {
      previewBox.style.transition = ""
})

saveBtn.addEventListener("click", (event) => {
      return;
      colorSavingProcess('save');
      // let newColor = colorNameInput.value.trim().toUpperCase();
      // colorListCreator(newColor);
});

save_clr.addEventListener('click', () => {
      colorSavingProcess('save');
})

save_as_copy.addEventListener('click', () => {
      let newColor = colorNameInput.value.trim().toUpperCase();
      // if(isColorSaved(newColor)) {
      //       throwMessage('Color Already Saved');
      //       return;
      // }
      colorSavingProcess('save as copy');
})

function colorSavingProcess(method) {
      // let newColor = colorNameInput.value.trim().toLowerCase();
      let newColor = colorNameInput.value.trim().toUpperCase();

      // if (newColor === orgColorCode.toLowerCase()) {
      if (newColor === orgColorCode.toUpperCase()) {
            enableDisableEditingMode("disable");
            return;
      }

      if (newColor === "") {
            throwMessage("Please Fill Color First",)
            return;
      }

      if (!isColorValid(newColor)) {
            // throwMessage("This is not a color", "white", "close-circle-outline");
            return;
      }

      let allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      // check if color already exists
      // if (allColors.some(color => color.toLowerCase() === newColor)) {
      if (allColors.some(color => color.toUpperCase() === newColor)) {
            // throwMessage("Color Already Saved", "#00ff00", "checkmark-circle-outline")
            return;
      }

      if (isColorAvailableInTrash(newColor)) {
            // throwMessage("Color is Available in Trash", "#00ff00", "checkmark-circle-outline")
            return;
      }

      if (method === 'save as copy') {
            colorListCreator(newColor);
      }
      else {
            // Replace in storage
            // let index = allColors.findIndex(color => color.toLowerCase() === orgColorCode.toLowerCase());
            let index = allColors.findIndex(color => color.toUpperCase() === orgColorCode.toUpperCase());
            if (index !== -1) {
                  allColors[index] = newColor;
                  localStorage.setItem("saveColor", JSON.stringify(allColors));
            }

            // Replace in DOM
            if (currentEditingBox) {
                  let span = currentEditingBox.querySelector(".color-name");
                  span.textContent = newColor;
                  span.setAttribute("title", newColor);
                  span.style.color = getContrastColor(newColor);
                  currentEditingBox.style.backgroundColor = newColor;

                  // Highlight animation
                  currentEditingBox.classList.add("highlight-outline");
                  setTimeout(() => {
                        currentEditingBox.classList.remove("highlight-outline");
                  }, 1200);
            }
      }

      orgColorCode = newColor;
      enableDisableEditingMode("disable");
      hideErrorMessage();
      closeColorEditor();
}

backBtn.addEventListener("click", () => {
      enableDisableEditingMode("disable");
      hideColorPreviewBox();
      colorNameInput.value = orgColorCode;
})

function enableDisableEditingMode(mode) {

      // toggling buttons
      defaultButtons.classList.toggle("hide-default-btns");
      editingButtons.classList.toggle("hide-editing-btns");
      colorNameInput.classList.toggle("color-code-box-visibility");
      hideColorPreviewBox();

      // change input mode
      if (mode === "enable") {
            colorNameInput.disabled = false;
            colorNameInput.removeAttribute("readonly");
            colorNameInput.focus();
      }
      else if (mode === "disable") {
            disableEditing();
            colorNameInput.disabled = true;
            hideClrPopUpErrorMessage();
      }
}

function showColorPreviewBox() {
      previewBox.style.display = "flex";
      previewBox.style.backgroundColor = "transparent";
      orgColorCode = colorNameInput.value;

}

function hideColorPreviewBox() {
      previewBox.style.display = "none";
}

function disableEditing() {
      defaultButtons.classList.remove("hide-default-btns");
      editingButtons.classList.add("hide-editing-btns");
      colorNameInput.classList.remove("color-code-box-visibility");

      colorNameInput.setAttribute("readonly", "");
}

// color checkig controling

let allColors = JSON.parse(localStorage.getItem("saveColor")) || [];


let addColorBtn = document.querySelector("#add-color-btn");
let addColorInput = document.querySelector("#get-color-input");
let colorIndicator = document.querySelector("#color-indicator");
let input$gradientBorder = document.getElementById('gradient-border');
let errorMessage = document.querySelector(".error-message-div");

function showGradientBorder() {
      input$gradientBorder.classList.add("rotation-glow");
}

function hideGradientBorder() {
      input$gradientBorder.classList.remove("rotation-glow");
}

addColorInput.addEventListener("focus", showGradientBorder);
addColorInput.addEventListener("blur", hideGradientBorder);

// update color counter
savedColorCounting.textContent = allColors.length;

addColorInput.addEventListener("input", () => {

      // hide color indicator and return if input is empty
      if(addColorInput.value.trim() === "") {
            hideColorIndicator();
            return;
      }

      playSound(typingClickSound)

      // addColorInput.value = addColorInput.value.toLowerCase();
      addColorInput.value = addColorInput.value.toUpperCase();

      let res = isColorSaved(addColorInput.value);

      showColorIndicator(addColorInput.value);

      if (res === 'saved color') {
            showErrorMessage('saved color');
      }
      else if (isColorAvailableInTrash(addColorInput.value)) {
            showErrorMessage('in trash');
      }
      else hideErrorMessage();

      const quickPreviewMode = localStorage.getItem("quickPreviewMode") || "off";
      if (quickPreviewMode === "on") {
            highlightSavedColor(addColorInput.value);
      }
});

function showColorIndicator(color) {
      colorIndicator.style.backgroundColor = color;
      colorIndicator.classList.remove("hidden");
}

function hideColorIndicator() {
      colorIndicator.style.backgroundColor = "transparent";
      colorIndicator.classList.add("hidden");
}

// Add color using Enter key
addColorInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
            playSound(lockSound)
            // const newColor = addColorInput.value.trim().toLowerCase();
            const newColor = addColorInput.value.trim().toUpperCase();

            // Trash check
            if (isColorAvailableInTrash(newColor)) {
                  addColorInput.blur();
                  const confirmed = await showRestorePopup(newColor);
                  if (confirmed) {
                        addColorInput.value = "";
                        focusInput();
                        colorMoveToStorageFromTrash(newColor);
                        renderColors();
                        renderTrashColors();
                        hideErrorMessage(); // hide error message (Available in trash)
                  }
                  hideColorIndicator();
                  return; // stop further execution
            }

            
            // Normal save process
            const result = isColorSaved(newColor);
            if (result === "not saved") {
                  colorListCreator(newColor);
                  hideColorIndicator();
            } else {
                  highlightSavedColor(newColor);
            }
            updateSelectionCount();
      }

      if (event.key == " ") {
            event.preventDefault();
            // throwMessage("Space Not Allowd");
      }
});

let bubblingElements = document.querySelectorAll('.bubbling');

bubblingElements.forEach(element => {
      element.addEventListener('click', () => {
            // element.classList.add('bubbling');
            element.style.animation = bubblingAnimation;
      })

      element.addEventListener('animationend', (e) => {
            // element.classList.remove('bubbling');
            if (e.animationName === "bubbling") {
                  element.style.animation = "";
            }
      })
});

// Add color using Add button click
addColorBtn.addEventListener("click", async () => {

      playSound(lockSound)

      // addColorBtn.style.animation = "bubbling 520ms cubic-bezier(0.22, 0.61, 0.36, 1)";


      // addColorBtn.addEventListener("animationend", () => {
      //       addColorBtn.style.animation = "";
      // })

      // const newColor = addColorInput.value.trim().toLowerCase();
      const newColor = addColorInput.value.trim().toUpperCase();

      // if(newColor.includes(" ")) {
      //       throwMessage('Space Not Allowd');
      //       return;
      // }

      // Trash check
      if (isColorAvailableInTrash(newColor)) {
            const confirmed = await showRestorePopup(newColor);
            if (confirmed) {
                  colorMoveToStorageFromTrash(newColor);
                  renderColors();
                  renderTrashColors();
            }
            return;
      }

      // Normal save process
      const result = isColorSaved(newColor);
      if (result === "not saved") {
            colorListCreator(newColor);
      } else {
            highlightSavedColor(newColor);
      }
});


function highlightSavedColor(colorValue) {
      const savedColors = document.querySelectorAll(".saved-clr");

      for (let box of savedColors) {
            const nameSpan = box.querySelector(".color-name");
            // if (nameSpan?.textContent.toLowerCase() === colorValue.toLowerCase()) {
            if (nameSpan?.textContent.toUpperCase() === colorValue.toUpperCase()) {

                  // Scroll into view
                  box.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                  });

                  let colorList = allColorsCounting;
                  // setTimeout(() => {
                  //       colorList.scrollBy(0, -10);
                  // }, 400);

                  // Highlight
                  box.classList.add("highlight-outline");

                  setTimeout(() => {
                        box.classList.remove("highlight-outline");
                  }, 1200);

                  break;
            }
      }
}



function isColorSaved(checkingColor) {
      if (checkingColor.trim() === "") {
            focusInput();
            return;
      }


      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];


      for (const color of allColors) {
            // if (color.toLowerCase() === checkingColor.toLowerCase()) {
            if (color.toUpperCase() === checkingColor.toUpperCase()) {
                  showErrorMessage("saved color");
                  return 'saved color';
            }
            else {
                  hideErrorMessage();
            }
      }
      return "not saved";
}

function showErrorMessage(reason) {
      addColorInput.style.transform = 'translateY(-8px)'

      let errorIcon = errorMessage.querySelector("ion-icon");
      let errorText = errorMessage.querySelector("span");

      errorMessage.style.display = "flex";

      playSound(popSound)

      if (reason == "saved color") {
            // errorText.textContent = "This color is already saved";
            errorText.innerHTML = "<label for='get-color-input'>Already saved<label>";
            errorIcon.setAttribute("name", "checkmark-circle");
            errorMessage.style.color = "green";
      }
      else if (reason == "in trash") {
            // errorText.textContent = "This color is already saved";
            errorText.innerHTML = "<label for='get-color-input'>Available in trash<label>";
            errorIcon.setAttribute("name", "alert-circle");
            errorMessage.style.color = "#0051B0";
      }
      else if (reason == "not color") {
            // errorText.textContent = "This is not a color";
            errorText.textContent = "Not a color";
            errorIcon.setAttribute("name", "close-circle");
            errorMessage.style.color = " #ff0000";
            let el = document.getElementById('input-area-wrapper');

            errorVibration(el);

            // el.classList.add('magic-vibrate-2');

            // el.addEventListener('animationend', (e) => {
            //       if (e.animationName === 'magic-vibrate-2') {
            //             el.classList.remove('magic-vibrate-2');
            //       }
            // });
      }
}

function hideErrorMessage() {
      errorMessage.style.display = "none";
      addColorInput.style.transform = '' // return to default

}

function isColorValid(color) {
      // strictly check color is valid or not
      if (!isNaN(color)) {
            if (!color.includes("#")) {
                  return false;
            }
      }
      return tinycolor(color).isValid();
}

function colorListCreator(color) {
      if (!isColorValid(color)) {
            showErrorMessage("not color");
            return;
      }
      createColorBox(color);
      saveColorInStorage(color);
      focusInput();

      // Calling two time to mantain hover effect
      changeHover();
      changeHover();
}

function createColorBox(color) {
      color = color.toUpperCase();
      let colorBox = document.createElement("div");
      colorBox.setAttribute("class", "saved-clr");
      // colorBox.style.animation = bubblingAnimation;

      // New added
      // let colorBoxWrapper = document.createElement('div');
      // colorBoxWrapper.classList.add('bubbling', 'saved-clr-wrapper');

      colorBox.style.backgroundColor = color;
      colorBox.setAttribute("tabindex", "0");
      colorBox.setAttribute("data-id", `${color}`);

      colorBox.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                  copyText(color)
            }
      });

      let colorCode = getContrastColor(color);

      colorBox.innerHTML = `
            <span title="${color}" class="color-name" style="color:${colorCode};">${color}</span>
            <button class="delete-clr-btn"><ion-icon name="trash-outline"></ion-icon></button>
      `;

      // New added hover bubbling
      // colorBoxWrapper.addEventListener('click', () => {
      //       colorBoxWrapper.style.animation = bubblingAnimation;
      // })
      // colorBoxWrapper.addEventListener('animationend', (e) => {
      //       if(e.animationName === "bubbling") {
      //             colorBoxWrapper.style.animation = "";
      //       }
      // })

      // setTooltip(`#${color}`, color);

      // colorBoxWrapper.appendChild(colorBox)
      savedColorList.prepend(colorBox);
      savedColorList.scrollTop = 0;
}

function saveColorInStorage(getColor) {
      getColor = getColor.toUpperCase();
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
      allColors.push(getColor);
      localStorage.setItem("saveColor", JSON.stringify(allColors));
      updateColorCounter();
}

function focusInput() {
      addColorInput.value = "";
      addColorInput.focus();
}

function renderColors() {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
      savedColorList.innerHTML = "";

      allColors.forEach(color => {
            createColorBox(color);
      });
      updateColorCounter();
}

renderColors();


function deleteSpecificColor(index) {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      allColors.splice(index, 1);

      localStorage.setItem("saveColor", JSON.stringify(allColors));
}

function updateColorCounter() {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      if (allColors.length <= 0) {
            savedColorCounting.textContent = 0;
      }
      else {
            savedColorCounting.textContent = allColors.length;
      }
}

updateColorCounter();

function getContrastColor(color) {
      let clr = tinycolor(color);

      return clr.isLight() ? "black" : "white";
}

// Delete a perticular color
savedColorList.addEventListener("click", (event) => {
      if (event.target.closest(".delete-clr-btn")) {
            const colorBox = event.target.closest(".saved-clr");
            const colorName = colorBox.querySelector(".color-name").textContent;

            if (isTrashFull()) {
                  let res = confirm("trash is full are you permanently delete this color ?");
                  if (res) {
                        deleteColorFromStorage(colorName);
                        removeFromDOM(colorBox);
                        showSuccessMessage("Deleted!")
                        return;
                  }
                  else return;
            }

            saveToTrash(colorName);

            playSound(swooshSound)

            showSuccessMessage("Move to Trash Bin");

            // Remove from localStorage
            deleteColorFromStorage(colorName);

            // Remove from DOM
            removeFromDOM(colorBox);

            // Update counter
            updateColorCounter();

            isTrashFull();
      }
});

function removeFromDOM(colorBox) {
      colorBox.style.transition = "all .4s";
      colorBox.style.opacity = 0;
      colorBox.style.transform = "scale(0)";
      colorBox.style.height = "0px";
      setTimeout(() => {
            colorBox.remove();
      }, 300);
} ``

function deleteColorFromStorage(colorName) {
      colorName = colorName.toUpperCase();
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
      // allColors = allColors.filter(color => color.toLowerCase() !== colorName.toLowerCase());
      allColors = allColors.filter(color => color.toUpperCase() !== colorName.toUpperCase());
      localStorage.setItem("saveColor", JSON.stringify(allColors));
}

function setSelectedLayoutOption() {
      const type = localStorage.getItem("layout-type") || "list";

      // Check if Auto Grid View is enabled - disable toggle if so
      if (localStorage.getItem("autoGridView") === "enable") {
            layoutToggleContainer.classList.add("disabled");
      } else {
            layoutToggleContainer.classList.remove("disabled");
      }

      // Remove all active states first
      listView.classList.remove("active");
      gridView.classList.remove("active");
      listView.setAttribute("aria-checked", "false");
      gridView.setAttribute("aria-checked", "false");
      layoutToggleContainer.classList.remove("grid-active");

      if (type === "list") {
            // Set list view as active
            listView.classList.add("active");
            listView.setAttribute("aria-checked", "true");
            savedColorList.classList.remove("saved-color-grid-view");

            // Move slider to list position (left)
            layoutToggleContainer.classList.remove("grid-active");

      } else if (type === "grid") {
            // Set grid view as active
            gridView.classList.add("active");
            gridView.setAttribute("aria-checked", "true");
            savedColorList.classList.add("saved-color-grid-view");

            // Move slider to grid position (right)
            layoutToggleContainer.classList.add("grid-active");
      }
}

// Deletion of color controling 
let popUpContainer = document.querySelector(".pop-up-container");
let popUpButtons = document.querySelectorAll(".pop-up-buttons .btn");
let deletePopupTitle = document.getElementById("title");
let deleteAllPlan = null;

popUpButtons.forEach(btn => {
      btn.addEventListener("click", () => {
            let work = btn.getAttribute("data-work");

            if (work == "no-delete") {
                  popUpContainer.style.display = "none";
                  deleteAllPlan = null;
            }
            else if (work == "yes-delete") {
                  popUpContainer.style.display = "none";

                  const saved = JSON.parse(localStorage.getItem("saveColor")) || [];
                  const trash = JSON.parse(localStorage.getItem("trashColors")) || [];

                  if (deleteAllPlan) {
                        const newTrash = [...trash, ...deleteAllPlan.toTrashColors].slice(0, orgTrashColorLimit);
                        localStorage.setItem("trashColors", JSON.stringify(newTrash));

                        const startIndex = (deleteAllPlan.toTrashColors.length || 0) + (deleteAllPlan.toDeleteCount || 0);
                        const remaining = saved.slice(startIndex);
                        localStorage.setItem("saveColor", JSON.stringify(remaining));
                  } else {
                        localStorage.removeItem("saveColor");
                  }

                  // UI updates
                  savedColorList.innerHTML = "";
                  // renderSavedColors && renderSavedColors();
                  renderTrashColors();
                  focusInput();
                  updateColorCounter();

                  deleteAllPlan = null;
            }
      });
});

let bgChanger = document.getElementById("bg-change");
bgChanger.addEventListener("change", () => {
      displayContainer.style.background = bgChanger.value;
})

// network checking controling
let connectionLostContainer = document.querySelector(".connection-lost-container");

window.addEventListener("offline", connectionCheck);
window.addEventListener("load", connectionCheck);
window.addEventListener("online", connectionCheck);
window.addEventListener("DOMContentLoaded", connectionCheck);

function connectionCheck() {
      if (!navigator.onLine) {
            connectionLost();
      } else {
            connectionFound();
      }
}

function connectionLost() {
      return alert("connection lost")
      connectionLostContainer.style.display = "flex";
}

function connectionFound() {
      // return alert("connection recover")
      connectionLostContainer.style.display = "none";
}

let checkIcon = document.querySelector("#hover-effect-check-icon");
let hoverEffectBtn = document.getElementById("hover-effect-btn");

hoverEffectBtn.addEventListener("click", () => {
      changeHover();
});

// window.addEventListener("resize", () => {
//       if (window.innerWidth <= 768) {
//             hoverEffectBtn.classList.remove("hover-on");
//       } else {
//             hoverEffectBtn.classList.add("hover-on");
//       }
//       changeHover();
// });

function changeHover() {
      let colorBoxs = document.querySelectorAll(".saved-clr");

      hoverEffectBtn.classList.toggle("hover-on");
      const hoverEffectOption = document.getElementById("hover-effect-option");
      if (hoverEffectOption) {
            hoverEffectOption.classList.toggle("selected-nav-option");
      }

      if (hoverEffectBtn.classList.contains("hover-on")) {
            // checkIcon.style.color = "";
            colorBoxs.forEach(box => {
                  box.classList.remove("hover-effect");
            });
      }
      else {
            // checkIcon.style.color = "#00ff00";
            colorBoxs.forEach(box => {
                  box.classList.add("hover-effect");
            });
      }
}

let resizerIsOn = false;
let resizeBtn = document.getElementById("resize-color-list-btn");

resizeBtn.addEventListener("click", () => {
      if (resizerIsOn) {
            OffResizer();
      }
      else {
            OnResizer();
      }
});

// Remove ResizeObserver since we don't need to track during resize
// We'll only save the size when resizer is turned off

function resetFavColorBoxSize() {
      // First turn off resizer if it's on to prevent OffResizer from saving the current size
      if (resizerIsOn) {
            resizeBtn.classList.remove("selected-nav-option")
            favColorListContainer.classList.remove("resizable");
            resizerIsOn = false;
      }

      // Clear localStorage entries
      localStorage.removeItem("favColorBoxW");
      localStorage.removeItem("favColorBoxH");

      // Reset container to default size
      favColorListContainer.style.width = "";
      favColorListContainer.style.height = "";

      // Show confirmation message
      throwMessage("Box Size Reset", "#ff6b35", "refresh-outline");
}

let msgBox, textTag;
resizeBtn.addEventListener("mouseover", () => {
      let boxShadow = localStorage.getItem("theme");
      if (localStorage.getItem("screen-size") == "full") return;
      if (!resizerIsOn) {
            // favColorListContainer.style.boxShadow = `0 0 15px ${(boxShadow == "light") ? "#ff0000" : "#b87af5"}`;
            favColorListContainer.style.outline = `5px solid ${$accentColor}`;
            favColorListContainer.style.outlineOffset = "5px";

            msgBox = document.createElement("div");
            textTag = document.createElement("p");

            msgBox.classList.add("resizable-tool-tip");
            textTag.textContent = "Resize this focused Box";

            msgBox.append(textTag);
            document.body.append(msgBox);
      }
})

resizeBtn.addEventListener("mouseout", () => {
      // favColorListContainer.style.boxShadow = "";
      favColorListContainer.style.outline = "";
      favColorListContainer.style.outlineOffset = "";
      msgBox.remove();
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() === "w") {
            event.preventDefault();
            (resizerIsOn) ? OffResizer() : OnResizer();
      }
})

window.addEventListener('keyup', (event) => {
      if (event.key.toLowerCase() === "/") {
            addColorInput.focus();
      }
})

function OnResizer() {
      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") {
            return throwMessage("Exit Fullscreen First", "white");
      }
      resizeBtn.classList.add("selected-nav-option")
      favColorListContainer.classList.add("resizable");

      hideLogo();

      resizerIsOn = !resizerIsOn;
}

function OffResizer() {
      resizeBtn.classList.remove("selected-nav-option")
      favColorListContainer.classList.remove("resizable");

      // Get current container size and save to localStorage when resizer is turned off
      const containerRect = favColorListContainer.getBoundingClientRect();
      const currentWidth = containerRect.width;
      const currentHeight = containerRect.height;

      localStorage.setItem("favColorBoxW", currentWidth);
      localStorage.setItem("favColorBoxH", currentHeight);

      // Show confirmation that size was saved
      throwMessage("Box Size Saved", "#00ff00", "checkmark-circle-outline");

      showLogo();

      resizerIsOn = !resizerIsOn;
}

function hideLogo() {
      logo.style.transform = "translateX(200px)";
      logo.style.transition = "transform .6s ease";
}

function showLogo() {
      logo.style.transform = "translateX(0px)";
      logo.style.transition = "transform .3s ease";
}

let quickPreviewToggle = document.getElementById("quick-preview-toggle");
let quickPreviewToggleThumb = quickPreviewToggle ? quickPreviewToggle.querySelector('.thumb') : null;

let isQuickPreviewModeON = localStorage.getItem("quickPreviewMode") || "off";
if (quickPreviewToggleThumb) {
      if (isQuickPreviewModeON === "on") {
            quickPreviewToggleThumb.classList.add("switch-on");
            quickPreviewToggle.style.backgroundColor = $accentColor;
      } else {
            quickPreviewToggleThumb.classList.remove("switch-on");
            quickPreviewToggle.style.backgroundColor = "";
      }

      quickPreviewToggle.addEventListener("click", () => {
            const currentMode = localStorage.getItem("quickPreviewMode") || "off";

            if (currentMode === "on") {
                  localStorage.setItem("quickPreviewMode", "off");
                  quickPreviewToggleThumb.classList.remove("switch-on");
                  quickPreviewToggle.style.backgroundColor = "";
            } else {
                  localStorage.setItem("quickPreviewMode", "on");
                  quickPreviewToggleThumb.classList.add("switch-on");
                  quickPreviewToggle.style.backgroundColor = $accentColor;
            }
      });
}

// throwMessage("Error message handling");
function throwMessage(text, color, icon = "alert-circle-outline") {

      playSound(alertSound);

      // If the message is already showing, remove it before showing a new one
      if(icon.includes("outline")) {
            icon = icon.replace("-outline", "");
      }

      let box = document.createElement("div");
      let textBox = document.createElement("p");
      let setIcon = document.createElement("ion-icon");

      box.classList.add("message-layout", "bubbling");

      box.addEventListener('click', () => {
            box.style.animation = bubblingAnimation;
      })

      box.addEventListener('animationend', (e) => {
            if (e.animationName === "bubbling") {
                  box.style.animation = "";
            }
      })

      textBox.innerText = text;
      textBox.style.color = "white";
      setIcon.style.color = color;
      setIcon.setAttribute("name", icon);

      box.append(setIcon);
      box.append(textBox);
      document.body.append(box);

      box.style.animation = "swipeDown .3s ease";

      setTimeout(() => {
            box.style.animation = "swipeRight .3s ease";

            box.addEventListener("animationend", () => {
                  box.remove();
            })
      }, 2000);
}


document.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "d") {
            const currentTheme = localStorage.getItem("theme") || "light";
            event.preventDefault();

            if (typeof stopAutoThemeMode === 'function') stopAutoThemeMode();
            playSound(toggleSwitchSound);

            if (currentTheme === "light") {
                  applyTheme("dark");
            } else if (currentTheme === "dark") {
                  applyTheme("system");
            } else {
                  applyTheme("light");
            }
      }
});

async function pasteToInput(inputElement) {
      try {
            let pastedText = "";

            if (navigator.clipboard && window.isSecureContext) {
                  pastedText = await navigator.clipboard.readText();
            } else {
                  pastedText = await fallbackPasteInput(); // fallback for Safari
            }

            const cleanText = pastedText.trim();
            if (cleanText !== "") {
                  inputElement.value = cleanText.toUpperCase();
                  addColorInput.focus();
                  showColorIndicator(inputElement.value);
                  return cleanText;
            } else {
                  throwMessage("No text found in clipboard", "red");
            }
      } catch (err) {
            throwMessage("Failed to paste from clipboard", "red");
      }
}

function fallbackPasteInput() {
      return new Promise((resolve) => {
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("readonly", "");
            input.style.position = "fixed";
            input.style.opacity = 0;

            document.body.appendChild(input);
            input.focus();

            // User manually triggers paste (on iOS, Safari)
            document.execCommand("paste");

            setTimeout(() => {
                  const value = input.value;
                  document.body.removeChild(input);
                  resolve(value);
            }, 200); // small delay to allow paste
      });
}


const pasteBtn = document.getElementById("paste-color-btn");
const crossClrValueBtn = document.getElementById('cross-clr-input-value');

crossClrValueBtn.addEventListener('click', () => {
      addColorInput.value = "";
      addColorInput.focus();
      hideErrorMessage();
      hideColorIndicator();
})

pasteBtn.addEventListener("click", async () => {
      const pastedValue = await pasteToInput(addColorInput);

      // Optional: Apply preview
      if (pastedValue) {
            isColorSaved(pastedValue);
            if (isColorAvailableInTrash(pastedValue)) {
                  showErrorMessage('in trash')
            }
            if (!isColorValid(pastedValue)) {
                  showErrorMessage("not color");
            }

            const quickPreviewMode = localStorage.getItem("quickPreviewMode") || "off";
            if (quickPreviewMode === "on") {
                  highlightSavedColor(pastedValue);
            }
      }
});

let trashBinBtn = document.getElementById("trash-color-option");

let trashColorContainer = document.getElementById("trash-color-container");
let trashColorBox = document.querySelector(".trash-color-box");
let trashColorCounter = document.getElementById("trash-clr-counter");
let trashColorCounting = document.getElementById("trash-clr-counting");
let trashColorLimit = document.getElementById("trash-clr-limit");
let closeTrashBoxBtn = document.getElementById("close-trash-box-btn");
let trashColorsList = document.querySelector(".trash-colors-list");
let orgTrashColorLimit = 30;
let isTrashOpen = false;

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "r") {
            event.preventDefault();
            isTrashOpen ? closeTrashColorBox() : openTrashColorBox();
      }
})

trashBinBtn.addEventListener("click", () => {
      openTrashColorBox();
      hideMenuBar();
});

trashColorContainer.addEventListener("click", (event) => {
      const dropdown = document.querySelector('.trash-dropdown-menu');
      const isDropdownBtn = event.target.closest('#trash-options-btn');
      const isDropdownMenu = event.target.closest('.trash-dropdown-menu');

      // Toggling dropdown
      if (isDropdownBtn) {
            dropdown.classList.toggle('show');
            isDropdownBtn.classList.toggle('rotate-180');
      }
      // Close dropdown if clicking outside
      else if (!isDropdownMenu) {
            if (dropdown && dropdown.classList.contains('show')) {
                  dropdown.classList.remove('show');
                  document.getElementById('trash-options-btn').classList.remove('rotate-180');
            }
      }

      // Close Trash Box
      if (event.target == closeTrashBoxBtn || (event.target == trashColorContainer && event.target != trashColorBox)) {
            closeTrashColorBox();
            if (dropdown && dropdown.classList.contains('show')) {
                  dropdown.classList.remove('show');
                  document.getElementById('trash-options-btn').classList.remove('rotate-180');
            }
      }
})

// Trash Options Dropdown Logic
const trashDropdownMenu = document.querySelector('.trash-dropdown-menu');
const emptyTrashBtn = document.getElementById('empty-trash-btn');
const restoreAllTrashBtn = document.getElementById('restore-all-trash-btn');

// Note: trashOptionsBtn listener removed as it is handled in trashColorContainer click

if (emptyTrashBtn) {
      emptyTrashBtn.addEventListener('click', () => {
            const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
            if (trashColors.length === 0) {
                  throwMessage("Trash is already empty", "#ff6b35");
                  trashDropdownMenu.classList.remove('show');
                  return;
            }

            localStorage.setItem("trashColors", JSON.stringify([]));
            renderTrashColors();
            isTrashFull();
            throwMessage("Trash emptied successfully", "#00ff00", "trash-outline");
            trashDropdownMenu.classList.remove('show');
      });
}

if (restoreAllTrashBtn) {
      restoreAllTrashBtn.addEventListener('click', () => {
            const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
            if (trashColors.length === 0) {
                  throwMessage("No colors to restore", "#ff6b35");
                  trashDropdownMenu.classList.remove('show');
                  return;
            }

            let savedColors = JSON.parse(localStorage.getItem("saveColor")) || [];

            // Filter out colors that are already in savedColors to avoid duplicates
            const newColors = trashColors.filter(color => !savedColors.includes(color));

            // Add non-duplicate colors to savedColors
            savedColors = [...savedColors, ...newColors];

            localStorage.setItem("saveColor", JSON.stringify(savedColors));
            localStorage.setItem("trashColors", JSON.stringify([]));

            renderTrashColors();
            renderColors(); // Update the main list
            isTrashFull();

            const restoredCount = newColors.length;
            const duplicateCount = trashColors.length - restoredCount;

            if (duplicateCount > 0) {
                  throwMessage(`Restored ${restoredCount} colors (${duplicateCount} were duplicates)`, "#00ff00", "refresh-outline");
            } else {
                  throwMessage("All colors restored successfully", "#00ff00", "refresh-outline");
            }

            trashDropdownMenu.classList.remove('show');
      });
}

closeTrashBoxBtn.addEventListener("click", () => {
      closeTrashColorBox();
})

isTrashFull();

function isTrashFull() {
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
      if (trashColors.length == 30) {
            trashBinBtn.classList.add("trash-is-full");
      }
      else {
            trashBinBtn.classList.remove("trash-is-full");
      }
      return trashColors.length >= orgTrashColorLimit;
}

function saveToTrash(color) {
      color = color.toUpperCase();
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      // Ignore when already color is saved in trash bin
      if (trashColors.includes(color)) {
            return;
      }

      trashColors.push(color);
      localStorage.setItem("trashColors", JSON.stringify(trashColors));
}

function openTrashColorBox() {
      trashColorContainer.style.display = "flex";
      trashColorsList.scrollTop = 0;
      renderTrashColors();
      isTrashOpen = !isTrashOpen;
}

function closeTrashColorBox() {
      trashColorBox.style.animation = "bounce .6s ease";
      setTimeout(() => {
            trashColorContainer.style.display = "none";
            trashColorBox.style.animation = "";
      }, 300);
      isTrashOpen = !isTrashOpen;
}

function renderTrashColors() {
      // return;
      trashColorsList.innerHTML = "";
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      updateTrashColorCounter();
      updateTrashButtonsState(trashColors.length);

      if (trashColors.length == 0) {
            // trashColorsList.innerHTML = emptyTrash();
            return;
      }
      for (const color of trashColors) {
            trashColorBoxCreator(color);
      }
}

function updateTrashButtonsState(count) {
      const emptyTrashBtn = document.getElementById('empty-trash-btn');
      const restoreAllTrashBtn = document.getElementById('restore-all-trash-btn');

      if (emptyTrashBtn) {
            emptyTrashBtn.disabled = count === 0;
      }
      if (restoreAllTrashBtn) {
            restoreAllTrashBtn.disabled = count === 0;
      }
}

function emptyTrash() {
      return `<center>
                  <p style="margin-top:20px; color: gray; user-select:none;">
                        Empty Trash Bin
                  </p>
            </center>
      `
}

function updateTrashColorCounter() {
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      trashColorCounting.textContent = trashColors.length;
      trashColorLimit.textContent = orgTrashColorLimit;
}

function trashColorBoxCreator(color) {
      // color = color.toLowerCase();
      color = color.toUpperCase();

      let colorCode = getContrastColor(color);
      updateTrashColorCounter();

      // Parent div
      const item = document.createElement("div");
      item.classList.add("trash-color-list-item");
      item.style.backgroundColor = color; // background color set
      item.style.color = colorCode; // text color set

      // Color name span
      const nameSpan = document.createElement("span");
      nameSpan.classList.add("trash-color-name");
      nameSpan.textContent = color; // color name display

      // Options container
      const optionsDiv = document.createElement("div");
      optionsDiv.classList.add("trash-color-item-options");

      // Revert button
      const revertBtn = document.createElement("button");
      revertBtn.classList.add("trash-color-item-btn", "revert-color-btn");

      const revertIcon = document.createElement("ion-icon");
      revertIcon.classList.add("revert-color-btn-icon");
      revertIcon.setAttribute("name", "refresh-outline");

      revertBtn.appendChild(revertIcon);

      // Delete permanently button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("trash-color-item-btn", "delete-permanently-color-btn");

      const deleteIcon = document.createElement("ion-icon");
      deleteIcon.classList.add("delete-permanently-color-btn-icon");
      deleteIcon.setAttribute("name", "trash-outline");

      deleteBtn.appendChild(deleteIcon);

      // Append buttons to options container
      optionsDiv.appendChild(revertBtn);
      optionsDiv.appendChild(deleteBtn);

      // Append name and options to main item
      item.appendChild(nameSpan);
      item.appendChild(optionsDiv);

      trashColorsList.prepend(item);

}

trashColorsList.addEventListener("click", (event) => {
      let colorBox = event.target.closest(".trash-color-list-item");
      let color;

      if (colorBox) {
            color = colorBox.querySelector(".trash-color-name").textContent;
      }

      if (event.target.closest(".revert-color-btn")) {
            if (isColorAvailableInStorage(color)) {
                  return throwMessage(`${color} is already saved in your storage`);
            }
            showSuccessMessage("Restore Successfully!")
            colorMoveToStorageFromTrash(color);
            removeFromDOM(colorBox);
            updateTrashColorCounter();
            renderColors();

      }
      else if (event.target.closest(".delete-permanently-color-btn")) {
            deleteColorFromeTrashStorage(color);
            removeFromDOM(colorBox);
            updateTrashColorCounter();
      }

      isTrashFull();
})

function colorMoveToStorageFromTrash(color) {
      // color = color.toLowerCase();
      color = color.toUpperCase();

      // Get trash colors from localStorage (or empty array if none exist)
      let trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      // Get saved colors from localStorage (or empty array if none exist)
      let savedColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      // Remove the given color from trash
      trashColors = trashColors.filter(c => c !== color);

      // Update trash colors in localStorage
      localStorage.setItem("trashColors", JSON.stringify(trashColors));

      // Add the color to saved colors
      savedColors.push(color);

      // Update saved colors in localStorage
      localStorage.setItem("saveColor", JSON.stringify(savedColors));
}

function deleteColorFromeTrashStorage(color) {
      // color = color.toLowerCase();
      color = color.toUpperCase();

      let trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      trashColors = trashColors.filter(c => c != color);

      localStorage.setItem("trashColors", JSON.stringify(trashColors));

      // if(trashColors.length == 0) {
      //       trashColorsList.innerHTML = emptyTrash();
      // }
}

// Check if a color is available in saved colors
function isColorAvailableInStorage(color) {
      // color = color.toLowerCase();
      color = color.toUpperCase();

      let saveColor = JSON.parse(localStorage.getItem("saveColor")) || [];

      if (saveColor.includes(color)) return true;
      else return false;
}

// Check if a color is available in Trash bin
function isColorAvailableInTrash(color) {
      // color = color.toLowerCase();
      color = color.toUpperCase();

      let trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      if (trashColors.includes(color)) return true;
      else return false;
}

// Custom restore confirmation popup
function showRestorePopup(color) {
      return new Promise((resolve) => {
            const popup = document.getElementById("restore-popup");
            const text = document.getElementById("restore-popup-text");
            const yesBtn = document.getElementById("restore-yes");
            const noBtn = document.getElementById("restore-no");


            text.textContent = `"${color}" is in trash. Restore it?`;
            popup.style.display = "flex";


            // Remove old listeners by cloning
            yesBtn.replaceWith(yesBtn.cloneNode(true));
            noBtn.replaceWith(noBtn.cloneNode(true));

            // Get new button references
            const newYesBtn = document.getElementById("restore-yes");
            const newNoBtn = document.getElementById("restore-no");

            newYesBtn.addEventListener("click", () => {
                  popup.style.display = "none";
                  resolve(true); // YES clicked
            });

            newNoBtn.addEventListener("click", () => {
                  popup.style.display = "none";
                  resolve(false); // NO clicked
            });

            requestAnimationFrame(() => {
                  newYesBtn.focus();
            });
      });
}

let shorcutContainer = document.getElementById('shortcut-container');
let shortcutBox = document.getElementById('shortcut-box');
let shorcutBoxCloseBtn = document.getElementById('shortcut-box-close-btn');
let shortcutOption = document.getElementById('shortcut-option');
let shortcutBoxOpen = false;

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "z") {
            event.preventDefault();
            toggleShortcutBox();
      }
})

shorcutContainer.addEventListener("click", (event) => {
      if (event.target == shorcutContainer && event.target != shortcutBox) {
            toggleShortcutBox();
      }
})

shortcutOption.addEventListener("click", () => {
      toggleShortcutBox();
});

shorcutBoxCloseBtn.addEventListener("click", () => {
      toggleShortcutBox();
})

function toggleShortcutBox() {
      shortcutBoxOpen = !shortcutBoxOpen;
      // shorcutContainer.style.display = shortcutBoxOpen ? "flex" : "none";
      if (shortcutBoxOpen) {
            shorcutContainer.style.display = "flex";
      }
      else {
            shortcutBox.style.animation = "bounce .6s ease";
            setTimeout(() => {
                  shorcutContainer.style.display = "none";
                  shortcutBox.style.animation = "";
            }, 300);
      }
}

let sidebarSettingsOption = document.getElementById('settings');
let settingsContainer = document.getElementById('settings-container');
let settingsBox = document.getElementById('settings-box');
let settingsCloseBtn = document.getElementById('settings-close-btn');
let autoGridViewBtn = document.getElementById('auto-grid-view');
let autoGridViewBtnThumb = document.querySelector('.thumb');

let settingBoxOpen = false;

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "c") {
            event.preventDefault();
            toggleSettingsBox();
      }
})

autoGridViewBtn.addEventListener("click", toggleAutoGridView);
autoGridViewBtnThumb.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleAutoGridView();
});

function toggleAutoGridView() {
      let isAutoModeOn = localStorage.getItem("autoGridView") || "disable";

      if (isAutoModeOn === "enable") {
            localStorage.setItem("autoGridView", "disable");
      }
      else {
            localStorage.setItem("autoGridView", "enable");
      }

      setAutoGridView();
}

function setAutoGridView(mode) {
      let isAutoModeOn;

      if (mode) {
            // If mode is passed as parameter, use it
            localStorage.setItem("autoGridView", mode);
            isAutoModeOn = mode;
      } else {
            // Otherwise, get from localStorage
            isAutoModeOn = localStorage.getItem("autoGridView") || "disable";
      }

      const layoutToggleContainer = document.querySelector(".layout-toggle-container");

      if (isAutoModeOn === "enable") {
            autoGridViewBtnThumb.classList.add("switch-on");
            // autoGridViewBtn.style.backgroundColor = "#1070d1";
            autoGridViewBtn.style.backgroundColor = $accentColor;
            // Disable the layout toggle when Auto Grid View is enabled
            if (layoutToggleContainer) {
                  layoutToggleContainer.classList.add("disabled");
            }
      } else {
            autoGridViewBtnThumb.classList.remove("switch-on");
            autoGridViewBtn.style.backgroundColor = "";
            // Enable the layout toggle when Auto Grid View is disabled
            if (layoutToggleContainer) {
                  layoutToggleContainer.classList.remove("disabled");
            }
      }
}

setAutoGridView();


sidebarSettingsOption.addEventListener("click", () => {
      toggleSettingsBox();
})

settingsCloseBtn.addEventListener("click", toggleSettingsBox);
function toggleSettingsBox() {
      settingBoxOpen = !settingBoxOpen;
      // settingsContainer.style.display = settingBoxOpen ? "flex" : "none";
      if (settingBoxOpen) {
            settingsContainer.style.display = "flex";
      }
      else {
            settingsBox.style.animation = "bounce .6s ease";
            setTimeout(() => {
                  settingsContainer.style.display = "none";
                  settingsBox.style.animation = "";
            }, 300);
      }
}

settingsContainer.addEventListener("click", (event) => {
      if (event.target == settingsContainer && event.target != settingsBox) {
            toggleSettingsBox();
      }
});


// function enableRotateScreenOnlyOnMobile() {
//       const rotateScreen = document.getElementById("rotate-screen");
//       const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//       if (isMobileDevice) {
//             rotateScreen.classList.add("mobile-only"); // Allow CSS to trigger
//       } else {
//             rotateScreen.classList.remove("mobile-only");
//             rotateScreen.style.display = "none"; // Force hidden on desktop
//       }
// }

// enableRotateScreenOnlyOnMobile();

let cursorMove = false;
window.addEventListener("mousemove", (event) => {
      return; // stop strictly for sometime
      if (window.innerWidth >= 786) {
            if (event.clientX <= 5) {
                  cursorMove = true;
                  showMenuBar();
            }
            else if (event.clientX >= 220) {
                  cursorMove = false;
                  hideMenuBar();
            }
      }
})

const observer = new ResizeObserver(entries => {
      if (localStorage.getItem("autoGridView") == "enable") {
            for (let entry of entries) {
                  if (entry.contentRect.width >= 700) {
                        // localStorage.setItem("layout-type", "grid");
                        setLayoutType("grid");
                  } else {
                        // localStorage.setItem("layout-type", "list");
                        setLayoutType("list");
                  }
                  setSelectedLayoutOption();
            }
      }
});

observer.observe(favColorListContainer);


// ####  " Stoped changes immediate "

let brightnessSlider = document.getElementById("brightness-slider");

brightnessSlider.addEventListener("input", () => {
      let brightness = brightnessSlider.value;
      document.body.style.filter = `brightness(${brightness}%)`;
      localStorage.setItem("brightness", brightness);
});

function setBrightness() {
      let brightness = localStorage.getItem("brightness") || 100;

      // Check if brightness is valid
      if (parseInt(brightness) > 100 || parseInt(brightness) < 40) {
            brightness = 100;
      }

      brightnessSlider.value = brightness;
      document.body.style.filter = `brightness(${brightness}%)`;
      localStorage.setItem("brightness", brightness);
}

setBrightness();

function setLayoutType(type) {
      manualOverride = true; // user ne manually change kiya
      localStorage.setItem("layout-type", type);
      //     setSelectedLayoutOption();
}

function playSound(soundType) {
      // Check if sound is muted
      let currentSoundStatus = localStorage.getItem("soundStatus") || "mute";
      if (currentSoundStatus === "mute") {
            return; // Don't play if muted
      }

      try {
            soundType.currentTime = 0;
            soundType.play().catch(error => {
                  console.warn('Sound play failed:', error);
            });
      } catch (error) {
            console.warn('Sound error:', error);
      }
}

let sidebarAllOptions = document.querySelectorAll(".all-options .option");

sidebarAllOptions.forEach(option => {
      option.addEventListener("click", () => {
            playSound(menuSound)
      })
});

// document.addEventListener('DOMContentLoaded', () => {
//       const alreadyVisited = sessionStorage.getItem('visited');

//       // Strict control
//       displayContainer.style.display = "none";
//       splashScreen.style.display = 'none';

//       if (!alreadyVisited) {
//             splashScreen.style.display = 'flex';
//             displayContainer.style.display = "none";
//             // Show splash screen for 3 seconds
//             setTimeout(() => {
//                   splashScreen.classList.add('fade-out');
//                   setTimeout(() => {
//                         splashScreen.style.display = 'none';
//                         displayContainer.style.display = "flex";
//                         checkSidebarIsLocked();
//                         restoreContainerSize();
//                         // logo shown
//                         setTimeout(() => {
//                               logo.style.display = "flex";
//                         }, 1000);
//                   }, 500);
//             }, 3000);

//             // Mark as visited in sessionStorage
//             sessionStorage.setItem('visited', 'true');
//       } else {
//             // Directly hide splash screen if already visited in session
//             splashScreen.style.display = 'none';
//             // displayContainer.style.display = "flex";
//             checkSidebarIsLocked();
//             restoreContainerSize();
//             // logo shown
//             setTimeout(() => {
//                   logo.style.display = "flex";
//             }, 1000);
//       }
// });

// Splash Screen Logic - Shows only on first visit in session
// Uses sessionStorage to track if user has visited in current browser session
// sessionStorage clears when browser tab/window is closed, localStorage persists
function initializeSplashScreen() {
      const hasVisitedInSession = sessionStorage.getItem('hasVisited');
      // showSplashScreen();
      // return;  // temporary #########

      if (!hasVisitedInSession) {
            showSplashScreen();
            // First visit in this session - show splash screen
            // Mark as visited for this session only
            sessionStorage.setItem('hasVisited', 'true');
      } else {
            // Already visited in this session (page reload) - skip splash screen
            hideSplashScreenDirectly();
      }
}

function showSplashScreen() {
      // Hide main content and show splash screen
      displayContainer.style.display = 'none';
      AppWrapper.style.display = 'none';
      logo.style.display = 'none';
      // splashMask.classList.add('hidden-splash-mask')
      // splashScreen.style.display = 'flex';
      splashScreen.classList.remove('hidden');

      // Auto-hide splash screen after 4 seconds
      setTimeout(() => {
            hideSplashScreen();
      }, 4000);
}

function hideSplashScreen() {
      // return;
      // Add fade-out animation
      splashScreen.classList.add('fade-out');

      setTimeout(() => {
            // splashScreen.style.display = 'none';
            splashScreen.classList.add('hidden');
            showMainContent();
      }, 500); // Wait for fade-out animation
}

function hideSplashScreenDirectly() {
      // return;
      // Hide splash screen immediately without animation
      // splashScreen.style.display = 'none';
      splashScreen.classList.add('hidden');
      showMainContent();
}

function showMainContent() {
      // Show main application content
      requestAnimationFrame(() => {
            addColorInput.focus();
      })
      displayContainer.style.display = 'flex';
      AppWrapper.style.display = 'block';

      // Initialize app features
      checkSidebarIsLocked();
      restoreContainerSize();

      // Show logo with delay for smooth transition
      setTimeout(() => {
            logo.style.display = 'flex';
      }, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSplashScreen);

// Optional: Add click to skip splash screen
// splashScreen.addEventListener('click', () => {
//       const isVisible = splashScreen.style.display !== 'none';
//       if (isVisible) {
//             hideSplashScreen();
//       }
// });

// Optional: Add Escape key to skip splash screen
// document.addEventListener('keydown', (event) => {
//       if (event.key === 'Escape') {
//             const isVisible = splashScreen.style.display !== 'none';
//             if (isVisible) {
//                   hideSplashScreen();
//             }
//       }
// });