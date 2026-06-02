let AppWrapper = document.querySelector('.app-wrapper')
let logo = document.querySelector(".logo");

let isMergeModeOn = false;

let previousColors = JSON.parse(localStorage.getItem('saveColor'));

// window.addEventListener("focus", () => {

//       const currentColors = JSON.parse(localStorage.getItem('saveColor'));

//       if (!isArrayEqual(currentColors, previousColors)) {
//             previousColors = currentColors;
//             renderColors();
//       }

// });

// window.addEventListener("storage", (e) => {

//       if (e.key === "saveColor") {
//             renderColors();
//       }

// });

function isArrayEqual(arr1, arr2) {
      return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
}

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

// ============================================================
// ColorStore — single source of truth
// ============================================================
const ColorStore = (() => {
      const COLORS_KEY = "saveColor";
      const PINNED_KEY = "pinnedColors";

      const getColors = () => JSON.parse(localStorage.getItem(COLORS_KEY)) || [];
      const getPinned = () => JSON.parse(localStorage.getItem(PINNED_KEY)) || [];

      const getPinnedSet = () => new Set(getPinned().map(c => c.toUpperCase()));

      const isPinned = (color, cachedPinnedSet = null) => {
            const pinned = cachedPinnedSet || getPinnedSet();
            return pinned.has(color.toUpperCase());
      };

      const togglePin = (color) => {
            color = color.toUpperCase();
            const pinned = getPinned();
            const index = pinned.findIndex(c => c.toUpperCase() === color);

            if (index !== -1) {
                  pinned.splice(index, 1);
            } else {
                  pinned.push(color);
            }

            localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
            return index === -1;
      };

      const getSortedColors = () => {
            const colors = getColors();
            const pinned = getPinned();
            const pinnedSet = new Set(pinned.map(c => c.toUpperCase()));

            const unpinned = colors.filter(c => !pinnedSet.has(c.toUpperCase()));
            // We only show pinned items that actually exist in the colors list
            const validPinned = pinned.filter(c => colors.includes(c.toUpperCase()));

            return [...unpinned, ...validPinned];
      };

      const save = (color) => {
            color = color.toUpperCase();
            const colors = getColors();
            if (!colors.includes(color)) {
                  colors.push(color);
                  localStorage.setItem(COLORS_KEY, JSON.stringify(colors));
            }
      };

      const remove = (color) => {
            color = color.toUpperCase();
            // Remove from colors
            const colors = getColors().filter(c => c.toUpperCase() !== color);
            localStorage.setItem(COLORS_KEY, JSON.stringify(colors));
            // Remove from pinned
            const pinned = getPinned().filter(c => c.toUpperCase() !== color);
            localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
      };

      return { getColors, getPinned, getPinnedSet, isPinned, togglePin, getSortedColors, save, remove };
})();

// splashScreen.addEventListener("contextmenu", (event) => {
//       event.preventDefault();
// });

// splashScreen.addEventListener("keydown", (event) => {
//       event.preventDefault();
// });


function getDropAnimation(container, box, time = 230) {

      let animationName = getDropAnimationName();

      // hide container and box after animation completed
      setTimeout(() => {
            container.style.display = "none";
            box.style.animation = "";
            box.style.transformOrigin = "";
      }, time - 10);

      // return animation
      return `${animationName} ${time}ms linear`;
}

function getDropAnimationName() {
      let animationNames = [
            "drop-clockwise",
            "drop-anti-clockwise"
      ]

      return animationNames[Math.floor(Math.random() * animationNames.length)];
}

function getTrasnformOrigin() {
      let origines = [
            'top left',
            'top right',
      ]

      return origines[Math.floor(Math.random() * origines.length)];
}

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
                  throwMessage("Unmuted", "#00ff00", "volume-high-outline", "Sound Effects Enabled");
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
                  throwMessage("Muted", "#ff6b35", "volume-mute-outline", "Sound Effects Disabled");
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
const eyeDropperClrPicker = document.getElementById("eye-dropper-clr-picker");

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
setTooltip('#clr-picker', "Choose Color");
setTooltip('#preview-box-color-picker', "Pick Color");
setTooltip('#label-clr-picker', "Choose Color");
setTooltip('.input-color-indicator', 'Color Indicator');
setTooltip('#eye-dropper-clr-picker', 'Pick Color');


// Global Keyboard Shortcuts
document.addEventListener('keyup', (e) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();

      e.preventDefault();

      if (key === 'm') {

            return; // stop the function from running

            const mBtn = document.querySelector('.multishades-btn');
            if (mBtn) mBtn.click();
      } else if (key === 's') {

            return; // stop the function from running

            if (typeof startSmartPicker === 'function') {
                  startSmartPicker();
            }
      }
      else if (key === "/") {
            addColorInput.focus();
      }
      else if (e.altKey && key === 't') {
            if (!rightPenalWrapper.classList.contains('closed')) {
                  blinkRightPenal();
            }
            else openRightPenal();
      }


});



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
            throwMessage("Unable to Use", "#ffffff", "alert-circle", "First, turn off Auto Grid View")
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

      // Override: Always hide buttons when locked
      menuCloseBtn.style.visibility = "hidden";
      menu.style.display = "none";

      mainOptions.style.zIndex = "200";

      (localStorage.getItem("screen-size") == "full") ? arrangeDispalycontainerSize() : disarrangeDispalycontainerSize();
      menuIsLocked = true;

      arrangeDispalycontainerSize();
}

function unlockNavbar() {

      localStorage.setItem("isSidebarLocked", "no");

      navLockIcon.setAttribute("name", "lock-open-outline");
      navLockBtn.setAttribute("title", "Lock sidebar");

      // Respect the Auto Sidebar toggle state
      setCursorSidebarUI();

      mainOptions.style.zIndex = "";

      disarrangeDispalycontainerSize();
      menuIsLocked = false;

      disarrangeDispalycontainerSize();
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

      // disarrangeDispalycontainerSize();
      restoreContainerSize(); // Restore saved size when exiting fullscreen
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
const contextCopyHexOption = document.getElementById("context-copy-hex-option");
const contextCopyRgbOption = document.getElementById("context-copy-rgb-option");
const contextSeletOption = document.getElementById("context-select-option");
const contextSeletAllOption = document.getElementById("context-select-all-option");
const contextEditOption = document.getElementById("context-edit-option");
const contextPinOption = document.getElementById("context-pin-option");
const selectionBar = document.getElementById("selection-bar");
const selectionCount = document.getElementById("selection-count");
const deleteSelectedBtn = document.getElementById("delete-selected-btn");
const cancelSelectionBtn = document.getElementById("cancel-selection-btn");
const selectAllBtn = document.getElementById("select-all-btn");
const contextMultishadesOption = document.getElementById("context-multishades-option");
const editRevertColorBtn = document.getElementById("edit-revert-color-btn");

// const demoEditedColor = {
//       previousColor: '#000000',
//       editedColor: '#ffffff'
// }

// setEditedColor(demoEditedColor);


// remove edit revert color button
editRevertColorBtn.remove();

function isColorEdited(color) {
      const editedColors = getEditedColors();
      for (let i = 0; i < editedColors.length; i++) {
            if (editedColors[i].previousColor == color) {
                  return true;
            }
      }
      return false;
}

function setEditedColor(color) {
      const editedColors = getEditedColors();
      editedColors.push(color);
      sessionStorage.setItem("edited-colors", JSON.stringify(editedColors));
}

function removeEditedColor(color) {
      const editedColors = getEditedColors();
      const index = editedColors.indexOf(color);
      if (index > -1) {
            editedColors.splice(index, 1);
            sessionStorage.setItem("edited-colors", JSON.stringify(editedColors));
      }
}

function getEditedColors() {
      const editedColors = JSON.parse(sessionStorage.getItem("edited-colors")) || [];
      return editedColors;
}

let seletionModOn = false;
let selectedColors = []; // array to store selected colors

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "a") {
            event.preventDefault()
            seletionModOn = true;
            selectionBar.style.display = "flex";
            document.body.classList.add("selection-active");
            toggleSelectAllColors();
      }
})

// Selection mode toggle
contextSeletOption.addEventListener("click", () => {
      seletionModOn = true;
      selectionBar.style.display = "flex"; // show bar
      document.body.classList.add("selection-active");

      // Automatically select the color that triggered the context menu
      if (choosedCurrentColorBox) {
            const colorId = choosedCurrentColorBox.getAttribute("data-id");
            if (!choosedCurrentColorBox.classList.contains("selected")) {
                  choosedCurrentColorBox.classList.add("selected");
                  if (!selectedColors.includes(colorId)) {
                        selectedColors.push(colorId);
                  }
            }
      }

      updateSelectionCount();
});

contextSeletAllOption.addEventListener("click", () => {
      seletionModOn = true;
      selectionBar.style.display = "flex"; // show bar
      document.body.classList.add("selection-active");
      toggleSelectAllColors();
});

selectAllBtn.addEventListener("click", () => {
      toggleSelectAllColors();
});

contextEditOption.addEventListener("click", () => {
      openColorEditor(choosedCurrentColorBox);
      enableDisableEditingMode("enable");
      showColorPreviewBox();
      setTimeout(() => {
            colorNameInput.focus();
      }, 100);
});

contextPinOption.addEventListener("click", () => {
      if (choosedCurrentColorBox) {
            handlePinAction(choosedCurrentColorBox);
      }
});

contextCopyHexOption.addEventListener("click", () => {
      if (choosedCurrentColorBox) {
            const color = choosedCurrentColorBox.getAttribute("data-id");
            const hex = tinycolor(color).toHexString().toUpperCase();
            copyText(hex);
            playSound(menuSound);
      }
});

contextCopyRgbOption.addEventListener("click", () => {
      if (choosedCurrentColorBox) {
            const color = choosedCurrentColorBox.getAttribute("data-id");
            const rgb = tinycolor(color).toRgbString();
            copyText(rgb);
            playSound(menuSound);
      }
});

contextMultishadesOption.addEventListener("click", () => {
      if (choosedCurrentColorBox) {
            const color = choosedCurrentColorBox.getAttribute("data-id");
            if (typeof openRightPenal === "function") openRightPenal();
            if (typeof openMultishadesDirectly === "function") openMultishadesDirectly(color);
      }
});

function selectAllColors() {
      const savedColors = document.querySelectorAll(".saved-clr");

      savedColors.forEach(colorBox => {
            const color = colorBox.getAttribute("data-id");

            if (!colorBox.classList.contains("selected")) {
                  colorBox.classList.add("selected");
                  selectedColors.push(color);
            }
      });

      updateSelectionCount();
}

function deselectAllColors() {
      const savedColors = document.querySelectorAll(".saved-clr");
      selectedColors = [];
      savedColors.forEach(colorBox => {
            colorBox.classList.remove("selected");
      });
      updateSelectionCount();
}

function toggleSelectAllColors() {
      const total = document.querySelectorAll(".saved-clr").length;

      if (selectedColors.length === total && total > 0) {
            deselectAllColors();
      } else {
            selectAllColors();
      }
}


// Update count in bar
function updateSelectionCount() {
      const total = document.querySelectorAll(".saved-clr").length;
      selectionCount.innerText = `${selectedColors.length} / ${total}`;

      // Check if all colors are selected
      const isAllSelected = selectedColors.length === total && total > 0;

      // Update Selection Bar Button
      const barBtnText = selectAllBtn.querySelector("span");
      const barBtnIcon = selectAllBtn.querySelector("ion-icon");

      // Update Context Menu Option
      const ctxOptionText = contextSeletAllOption.querySelector("span");
      const ctxOptionIcon = contextSeletAllOption.querySelector("ion-icon");

      if (isAllSelected) {
            if (barBtnText) barBtnText.innerText = "Deselect All";
            if (barBtnIcon) barBtnIcon.setAttribute("name", "close-circle-outline");

            if (ctxOptionText) ctxOptionText.innerText = "Deselect All";
            if (ctxOptionIcon) ctxOptionIcon.setAttribute("name", "close-circle-outline");
      } else {
            if (barBtnText) barBtnText.innerText = "Select All";
            if (barBtnIcon) barBtnIcon.setAttribute("name", "checkmark-done-outline");

            if (ctxOptionText) ctxOptionText.innerText = "Select All";
            if (ctxOptionIcon) ctxOptionIcon.setAttribute("name", "checkmark-done-outline");
      }
      if (ctxOptionIcon && ctxOptionIcon.classList.contains('icon')) ctxOptionIcon.classList.add('icon')
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
      document.body.classList.remove("selection-active");
}

let choosedCurrentColorBox = null;
let touchTimer = null;

function hideCustomContextMenu() {
      if (!contextMenu.classList.contains("show")) return;

      contextMenu.classList.remove("show");
      contextMenu.classList.add("hide");

      const handleAnimationEnd = () => {
            if (contextMenu.classList.contains("hide")) {
                  contextMenu.style.display = "none";
                  contextMenu.classList.remove("hide");
            }
            contextMenu.removeEventListener("animationend", handleAnimationEnd);
      };

      contextMenu.addEventListener("animationend", handleAnimationEnd);
}

function showCustomContextMenu(x, y, targetBox) {
      choosedCurrentColorBox = targetBox;

      const color = targetBox.getAttribute("data-id");
      const pinnedColors = JSON.parse(localStorage.getItem("pinnedColors")) || [];
      const isPinned = pinnedColors.includes(color.toUpperCase());

      // Update Pin Option Text and Icon
      const pinOptionText = contextPinOption.querySelector("span");
      const pinOptionIcon = contextPinOption.querySelector("i");

      if (isPinned) {
            pinOptionText.innerText = "Unpin Color";
            pinOptionIcon.className = "ph ph-push-pin-slash-fill icon"; // Outline for unpinning
      } else {
            pinOptionText.innerText = "Pin Color";
            pinOptionIcon.className = "ph ph-push-pin-fill icon"; // Fill for pinning
      }

      // Reset animation state if already visible to re-trigger it
      if (contextMenu.classList.contains("show")) {
            contextMenu.classList.remove("show");
            void contextMenu.offsetWidth; // Trigger reflow to restart animation
      }
      contextMenu.classList.remove("hide"); // Ensure hide class is gone

      // Screen dimensions
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Menu dimensions (temporarily show to measure)
      contextMenu.style.display = "block";
      const menuW = contextMenu.offsetWidth;
      const menuH = contextMenu.offsetHeight;

      // Position logic
      let posX = x + 2;
      let posY = y + 2;

      if (posX + menuW > screenW) {
            posX = x - menuW - 2;
            contextMenu.style.transformOrigin = "top right";
      } else {
            contextMenu.style.transformOrigin = "top left";
      }

      if (posY + menuH > screenH) {
            posY = y - menuH - 2;
            if (posX + menuW > screenW) {
                  contextMenu.style.transformOrigin = "bottom right";
            } else {
                  contextMenu.style.transformOrigin = "bottom left";
            }
      }

      contextMenu.style.left = posX + "px";
      contextMenu.style.top = posY + "px";

      // Trigger show animation
      contextMenu.classList.add("show");
}

savedColorList.addEventListener("contextmenu", (event) => {
      const targetBox = event.target.closest(".saved-clr");
      if (!targetBox || event.target.closest(".delete-clr-container")) return;

      // Ignore context menu if multishades frame is active
      if (window.isMultishadesFrameActive && window.isMultishadesFrameActive()) {
            event.preventDefault();
            return;
      }

      event.preventDefault();
      showCustomContextMenu(event.clientX, event.clientY, targetBox);
});

// Mobile Long Press Support
savedColorList.addEventListener("touchstart", (event) => {
      const targetBox = event.target.closest(".saved-clr");
      if (!targetBox || event.target.closest(".delete-clr-container")) return;

      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      touchTimer = setTimeout(() => {
            showCustomContextMenu(x, y, targetBox);
            // Vibrate if supported
            if (navigator.vibrate) navigator.vibrate(50);
      }, 700); // 700ms for long press
}, { passive: true });

savedColorList.addEventListener("touchend", () => {
      clearTimeout(touchTimer);
});

savedColorList.addEventListener("touchmove", () => {
      clearTimeout(touchTimer);
});

// Click anywhere → hide menu
document.addEventListener("click", () => {
      hideCustomContextMenu();
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
      // Only allow left click (button 0) to trigger copy/click logic
      if (event.button !== 0) return;

      const box = event.target.closest(".saved-clr");
      if (!box || event.target.closest(".delete-clr-container")) return;

      // If Multishades is active, clicking updates it instead of copying/editing
      if (window.isMultishadesFrameActive && window.isMultishadesFrameActive()) {
            const color = box.dataset.id;
            if (typeof loadMultishades === "function") {
                  loadMultishades(color);
            }
            return;
      }
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


      if (!box || event.target.closest(".delete-clr-container")) return;

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

      choosedColorBox.style.animation = getDropAnimation(choosedColorContainer, choosedColorBox);
      disableEditing();
      // choosedColorBox.style.animation = "smoothHide 0.2s ease";
      // setTimeout(() => {
      //       choosedColorContainer.style.display = "none";
      //       choosedColorBox.style.animation = "";
      // }, 190);

      colorNameInput.disabled = true;
}


let getShadesBtn = document.querySelector("#get-shades-btn");
let colorNameInput = document.querySelector("#color-code-box");

getShadesBtn.addEventListener("click", () => {
      if (window.openMultishadesDirectly) {
            window.openMultishadesDirectly(colorNameInput.value);
            closeColorEditor();
      }
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
      }, 2500); // visible for 2s 500ms
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
            if (!isColorValid(typedColor)) {
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
      if (typedColor === orgColorCode.toUpperCase()) {
            hideClrPopUpErrorMessage();
            return;
      }

      if (isColorAvailableInStorage(typedColor)) {
            showClrPopUpErrorMessage('saved')
      }
      else if (isColorAvailableInTrash(typedColor)) {
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
            throwMessage("Empty", "#ffffff", "alert-circle", "Please Fill Color First",)
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

// Native EyeDropper API logic for the new button
eyeDropperClrPicker.addEventListener("click", async () => {
      // 1. Check if browser supports the API
      if (!window.EyeDropper) {
            throwMessage("Unable to Use", "#ff4747", "warning-outline", "EyeDropper is not supported in this browser");
            return;
      }

      // 2. Create the EyeDropper instance
      const eyeDropper = new EyeDropper();

      try {
            // 3. Open the picker (returns a Promise)
            const result = await eyeDropper.open();

            // 4. Get the selected color
            const pickedColor = result.sRGBHex.toUpperCase();

            // 5. Populate input and trigger input event to show color indicator
            addColorInput.value = pickedColor;

            addColorInput.dispatchEvent(new Event("input"));

            // Put focus back on the input for a seamless experience
            focusInput(false);

      } catch (error) {
            // 6. Handle user cancellation (pressing escape)
            console.log("EyeDropper cancelled by user.");
      }
});

// update color counter
savedColorCounting.textContent = allColors.length;

addColorInput.addEventListener("input", () => {

      // hide color indicator and return if input is empty
      if (addColorInput.value.trim() === "") {
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
      // if (!isColorValid(color)) {
      //       return hideColorIndicator();
      // }

      colorIndicator.style.backgroundColor = color;
      colorIndicator.classList.remove("hidden");
}

function hideColorIndicator() {
      if (colorIndicator.classList.contains("hidden")) return;

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
                        renderColors(newColor);
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

      hideColorIndicator();

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
                  renderColors(newColor);
                  renderTrashColors();
                  hideColorIndicator();
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


function highlightSavedColor(colorValue, zoomEffect = true) {
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
                  if (zoomEffect) {
                        box.classList.add("highlight-outline");
                        setTimeout(() => {
                              box.classList.remove("highlight-outline");
                        }, 1200);
                  }

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
      saveColorInStorage(color);
      createColorBox(color, true); // Create individual box instead of full render
      focusInput();
}

function createColorBox(color, animate = false, skipReposition = false, cachedPinnedSet = null) {
      color = color.toUpperCase();
      let colorBox = document.createElement("div");
      colorBox.setAttribute("class", "saved-clr");
      if (animate) {
            colorBox.style.animation = "smoothEntrance 0.4s ease-out";
      }
      colorBox.style.backgroundColor = color;
      colorBox.setAttribute("tabindex", "0");
      colorBox.setAttribute("data-id", `${color}`);
      colorBox.setAttribute("data-color", color);

      colorBox.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                  copyText(color)
            }
      });

      let colorCode = getContrastColor(color);

      colorBox.innerHTML = `
            <span title="${color}" class="color-name" style="color:${colorCode};">${color}</span>
            <span class="pin-clr-btn" title="Pin Color" style="color:${colorCode};">
                  <i></i>
            </span>
            <div class="delete-clr-container">
                <button class="delete-clr-btn"><ion-icon name="trash-outline"></ion-icon></button>
                <div class="delete-confirm-hover">
                    <button class="confirm-btn move-trash-btn" title="Move to Trash"><ion-icon name="archive-outline"></ion-icon></button>
                    <button class="confirm-btn delete-perm-btn" title="Delete Permanently"><ion-icon name="trash"></ion-icon></button>
                </div>
            </div>
      `;

      // Sync pin state on creation
      applyPinState(colorBox, ColorStore.isPinned(color, cachedPinnedSet));

      // Professional approach: Place in its correct chronological position
      if (!skipReposition) {
            repositionColorBox(colorBox);
      } else {
            savedColorList.prepend(colorBox);
      }

      colorBox.scrollIntoView({ behavior: "instant", block: "start" });

      // Hide color indicator when it is visible
      hideColorIndicator();

      // Hide error message when it is visible
      hideErrorMessage();
}

function saveColorInStorage(getColor) {
      ColorStore.save(getColor);
      updateColorCounter();
}

function focusInput(doEmpty = true) {
      if (doEmpty) {
            addColorInput.value = "";
      }
      addColorInput.focus();
}

// ============================================================
// applyPinState — pure DOM reflect, zero decisions
// ============================================================
function applyPinState(colorBox, isPinned) {
      const pinBtn = colorBox.querySelector(".pin-clr-btn");
      const pinIcon = pinBtn.querySelector("i");

      colorBox.classList.toggle("pinned", isPinned);
      pinBtn.classList.toggle("pinned", isPinned);
      pinBtn.title = isPinned ? "Unpin color" : "Pin color";
      pinIcon.className = isPinned ? "ph ph-push-pin-fill" : "ph ph-push-pin";
}

// ============================================================
function repositionColorBox(colorBox) {
      const currentId = colorBox.dataset.id;
      const sortedColors = ColorStore.getSortedColors();

      // DOM order is reversed getSortedColors (because of prepend)
      const domOrder = [...sortedColors].reverse();
      const domIndex = domOrder.indexOf(currentId);

      if (domIndex === -1) return;

      // 1. First (Capture current position)
      const first = colorBox.getBoundingClientRect();
      const hasPosition = first.top !== 0 || first.left !== 0;

      // 2. Last (Move in DOM)
      if (domIndex === 0) {
            savedColorList.prepend(colorBox);
      } else {
            // Find the element that is at domIndex - 1 in the expected DOM order
            const prevId = domOrder[domIndex - 1];
            const prevBox = savedColorList.querySelector(`[data-id="${prevId}"]`);
            if (prevBox) {
                  prevBox.after(colorBox);
            } else {
                  savedColorList.prepend(colorBox);
            }
      }

      // 3. Invert/Play (Only for existing elements to achieve the "sliding" effect)
      if (hasPosition) {
            const last = colorBox.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;

            if (dx !== 0 || dy !== 0) {
                  colorBox.animate([
                        { transform: `translate(${dx}px, ${dy}px)` },
                        { transform: 'translate(0, 0)' }
                  ], {
                        duration: 400,
                        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                        fill: 'both'
                  });
            }
      }
}

// ============================================================
// handlePinAction — thin orchestrator only
// ============================================================
function handlePinAction(colorBox) {
      if (!colorBox) return;
      const colorId = colorBox.dataset.id;
      const isPinned = ColorStore.togglePin(colorId); // 1. update state
      playSound(lockSound);
      applyPinState(colorBox, isPinned);              // 2. reflect in DOM
      repositionColorBox(colorBox);                   // 3. reorder in DOM
      updateColorCounter();
}

function renderColors(animateColor = null) {
      savedColorList.innerHTML = "";
      const pinnedSet = ColorStore.getPinnedSet(); // Cache pinned set for the loop
      ColorStore.getSortedColors().forEach(color => {
            // skipReposition=true during bulk render for performance
            createColorBox(color, color === animateColor, true, pinnedSet);
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
      const colorBox = event.target.closest(".saved-clr");
      if (!colorBox) return;

      const colorName = colorBox.querySelector(".color-name").textContent;

      if (event.target.closest(".move-trash-btn")) {
            if (isTrashFull()) {
                  let res = confirm("Trash is full! Delete this color permanently?");
                  if (!res) return;

                  deleteColorFromStorage(colorName);
                  removeFromDOM(colorBox);
                  showSuccessMessage("Deleted Permanently!");
                  updateColorCounter();
                  return;
            }

            saveToTrash(colorName);
            playSound(swooshSound);
            showSuccessMessage("Moved to Trash Bin");
            deleteColorFromStorage(colorName);
            removeFromDOM(colorBox);
            updateColorCounter();
            isTrashFull();
      }
      else if (event.target.closest(".delete-perm-btn")) {
            const confirmed = confirm(`Are you sure you want to permanently delete ${colorName}?`);
            if (!confirmed) return;

            deleteColorFromStorage(colorName);
            removeFromDOM(colorBox);
            playSound(toggleSwitchSound);
            showSuccessMessage("Permanently Deleted!");
            updateColorCounter();
      }
      else if (event.target.closest(".pin-clr-btn")) {
            handlePinAction(colorBox);
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
      ColorStore.remove(colorName);
}

// setSelectedLayoutOption function remains here

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
      return throwMessage("Connection Lost", "#ff0000", "ph-wifi-slash", "Check your internet connection");
      // connectionLostContainer.style.display = "flex";
}

function connectionFound() {
      // connectionLostContainer.style.display = "none";
}

let checkIcon = document.querySelector("#hover-effect-check-icon");
let hoverEffectBtn = document.getElementById("hover-effect-btn");


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
      throwMessage("Reset", "#ff6b35", "refresh-outline", "Box set at actual size");
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
      if (msgBox) msgBox.remove();
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLocaleLowerCase() === "w") {
            event.preventDefault();
            (resizerIsOn) ? OffResizer() : OnResizer();
      }
})

/* 
     moved the logic in the 'Global Keyboard Shortcuts' section 
*/

// window.addEventListener('keyup', (event) => {
//       if (event.key.toLowerCase() === "/") {
//             addColorInput.focus();
//       }
// })

function OnResizer() {
      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") {
            return throwMessage("Cannot use", "#ffffff", 'alert-circle-outline', 'Exit Full screen first to use');
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
      throwMessage("Saved", "#00ff00", "checkmark-circle-outline", "New Box size is saved");

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

// ============================================================
// Custom Resizer UI and Logic
// ============================================================
function initializeCustomResizer() {
      const handle = document.getElementById("resizer-handle");
      const container = document.querySelector(".fav-color-list-container");

      let isDragging = false;
      let startX, startY, startWidth, startHeight;

      if (!handle || !container) return;

      handle.addEventListener("mousedown", (e) => {
            // Only allow dragging if resizer mode is ON
            if (!container.classList.contains("resizable")) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);

            document.body.classList.add("resizing");

            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);

            e.preventDefault();
      });

      function doDrag(e) {
            if (!isDragging) return;

            // Calculate new dimensions
            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);

            // Enforce minimum constraints
            if (newWidth < 300) newWidth = 300;
            if (newHeight < 400) newHeight = 400;

            // Update UI
            container.style.width = newWidth + 'px';
            container.style.height = newHeight + 'px';
      }

      function stopDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            document.body.classList.remove("resizing");

            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);

            // Save the final size to localStorage
            const containerRect = container.getBoundingClientRect();
            localStorage.setItem("favColorBoxW", containerRect.width);
            localStorage.setItem("favColorBoxH", containerRect.height);
      }
}
// Init the custom resizer
initializeCustomResizer();

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
let messageContainer = document.querySelector("#message-container");
function throwMessage(text, color, icon = "alert-circle-outline", description = undefined) {

      playSound(alertSound);

      // make icon without outline if it is already outline
      if (icon.includes("outline")) {
            icon = icon.replace("-outline", "");
      }

      let boxWrapper = document.createElement("div");
      boxWrapper.classList.add("message-layout-wrapper");
      messageContainer.append(boxWrapper);
      let box = document.createElement("div");
      let textBox = document.createElement("div");
      let msgTitle = document.createElement('div');
      let msgDescription = document.createElement('p')

      let setIcon;

      // create icon according to icon library name (icon name must contain 'ph-' for ph-icon library)
      if (icon.includes("ph-")) {
            setIcon = document.createElement("i");
      } else {
            setIcon = document.createElement("ion-icon");
      }
      let closeBtn = document.createElement("div");

      box.classList.add("message-layout", "bubbling");
      textBox.classList.add('msg-text-area');
      msgTitle.classList.add('msg-title');
      msgDescription.classList.add('msg-desc');
      setIcon.classList.add('msg-icon');
      closeBtn.classList.add("msg-close-btn");

      closeBtn.innerHTML = "<ion-icon name='close-outline'></ion-icon>";

      closeBtn.addEventListener("click", () => {
            box.style.animation = "swipeRight .3s ease";

            box.addEventListener("animationend", () => {
                  if (box) box.remove();
                  // if (boxWrapper) boxWrapper.remove();
                  boxWrapper.classList.remove('show');
                  setTimeout(() => {
                        if (boxWrapper) boxWrapper.remove();
                  }, 300);
                  if (messageContainer.children.length === 0) {
                        messageContainer.classList.add("hidden");
                  }
            })
      })

      box.addEventListener('animationend', (e) => {
            if (e.animationName === "bubbling") {
                  box.style.animation = "";
            }
      })

      msgTitle.innerText = text;
      msgDescription.innerText = description != undefined ? description : "";

      msgTitle.style.color = "#ffffff";
      msgDescription.style.color = "#ffffff";
      setIcon.style.color = color;

      // set icon according to icon library name
      if (icon.includes("ph-")) {
            setIcon.classList.add("ph", icon);
      } else {
            setIcon.setAttribute("name", icon);
      }

      textBox.append(msgTitle);
      if (description != undefined) textBox.append(msgDescription);
      box.append(setIcon);
      box.append(textBox);
      box.append(closeBtn);
      // document.body.append(box);
      if (messageContainer.classList.contains("hidden")) {
            messageContainer.classList.remove("hidden");
      }
      setTimeout(() => {
            messageContainer.prepend(boxWrapper);
            requestAnimationFrame(() => {
                  boxWrapper.classList.add('show');
            });
            setTimeout(() => {
                  boxWrapper.append(box);
            }, 50);
      }, 20);

      box.style.animation = "swipeDown .3s ease";

      let timeoutId;
      let startTime = Date.now();
      let remainingTime = 10000;

      // return;
      const removeMessage = () => {
            box.style.animation = "swipeRight .3s ease";
            box.addEventListener("animationend", () => {
                  if (box) box.remove();
                  // if (boxWrapper) boxWrapper.remove();
                  boxWrapper.classList.remove('show');
                  setTimeout(() => {
                        if (boxWrapper) boxWrapper.remove();
                  }, 300);
                  if (messageContainer.children.length === 0) {
                        // if (!messageContainer.contains(boxWrapper)) {
                        messageContainer.classList.add("hidden");
                  }
            });
      };

      const startTimer = () => {
            timeoutId = setTimeout(removeMessage, remainingTime);
      };

      const pauseTimer = () => {
            clearTimeout(timeoutId);
            remainingTime -= (Date.now() - startTime);
      };

      const resumeTimer = () => {
            startTime = Date.now();
            startTimer();
      };

      // Start the timer initially
      startTimer();

      // Pause the timer when the user hovers over the message
      box.addEventListener("mouseenter", pauseTimer);

      // Resume the timer when the hover goes back (mouse leaves)
      box.addEventListener("mouseleave", resumeTimer);
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
                  throwMessage("Text not found", "#ff0000", "alert-circle", "No text found in clipboard");
            }
      } catch (err) {
            throwMessage("Failed", "#ff0000", "alert-circle", "Failed to paste from clipboard");
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
      // hideMenuBar();
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
                  throwMessage("Empty", "#ff6b35", "alert-circle", "Trash is already empty");
                  trashDropdownMenu.classList.remove('show');
                  return;
            }

            localStorage.setItem("trashColors", JSON.stringify([]));
            renderTrashColors();
            isTrashFull();
            throwMessage("Emptied", "#00ff00", "trash-outline", "Trash emptied successfully");
            trashDropdownMenu.classList.remove('show');
      });
}

if (restoreAllTrashBtn) {
      restoreAllTrashBtn.addEventListener('click', () => {
            const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
            if (trashColors.length === 0) {
                  throwMessage("Colors not available", "#ff6b35", "alert-circle", "No any color available to restore");
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
                  throwMessage("Restored", "#00ff00", "refresh-outline", "All colors are restored successfully");
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
      trashColorBox.style.animation = getDropAnimation(trashColorContainer, trashColorBox, 200);
      // trashColorBox.style.animation = "bounce .6s ease";
      // setTimeout(() => {
      //       trashColorContainer.style.display = "none";
      //       trashColorBox.style.animation = "";
      // }, 195);
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
                  return throwMessage('Already saved', "#00ff00", 'alert-circle', `${color} Color is already saved in your storage`);
            }
            showSuccessMessage("Restore Successfully!")
            colorMoveToStorageFromTrash(color);
            removeFromDOM(colorBox);
            updateTrashColorCounter();
            renderColors(color);

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
            shortcutBox.style.animation = getDropAnimation(shorcutContainer, shortcutBox);
            // shortcutBox.style.animation = "bounce .6s ease";
            // setTimeout(() => {
            //       shorcutContainer.style.display = "none";
            //       shortcutBox.style.animation = "";
            // }, 145);
      }
}

let sidebarSettingsOption = document.getElementById('settings');
let settingsContainer = document.getElementById('settings-container');
let settingsBox = document.getElementById('settings-box');
let settingsCloseBtn = document.getElementById('settings-close-btn');
let autoGridViewBtn = document.getElementById('auto-grid-view');
let autoGridViewBtnThumb = autoGridViewBtn.querySelector('.thumb');
let cursorSidebarBtn = document.getElementById('cursor-sidebar-btn');
let cursorSidebarBtnThumb = cursorSidebarBtn.querySelector('.thumb');

cursorSidebarBtn.addEventListener("click", toggleCursorSidebar);
cursorSidebarBtnThumb.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCursorSidebar();
});

function toggleCursorSidebar() {
      let isCursorModeOn = localStorage.getItem("cursorSidebar") || "off";
      if (isCursorModeOn === "on") {
            localStorage.setItem("cursorSidebar", "off");
      } else {
            localStorage.setItem("cursorSidebar", "on");
      }
      setCursorSidebarUI();
}

function setCursorSidebarUI() {
      // One-time reset for all users to "off" as default
      if (!localStorage.getItem("autoSidebarReset_v1")) {
            localStorage.setItem("cursorSidebar", "off");
            localStorage.setItem("autoSidebarReset_v1", "true");
      }

      let isCursorModeOn = localStorage.getItem("cursorSidebar") || "off";
      if (isCursorModeOn === "on") {
            cursorSidebarBtnThumb.classList.add("switch-on");
            cursorSidebarBtn.style.backgroundColor = $accentColor;

            // Aligned with lockNavbar behavior
            if (menu) menu.style.display = "none";
            if (menuCloseBtn) menuCloseBtn.style.visibility = "hidden";
      } else {
            cursorSidebarBtnThumb.classList.remove("switch-on");
            cursorSidebarBtn.style.backgroundColor = "";

            // Aligned with unlockNavbar behavior
            if (menu) menu.style.display = "flex";
            if (menuCloseBtn) menuCloseBtn.style.visibility = "visible";
      }
}
setCursorSidebarUI();

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
            // settingsBox.style.animation = "bounce .6s ease";
            settingsBox.style.animation = getDropAnimation(settingsContainer, settingsBox);
            // setTimeout(() => {
            //       settingsContainer.style.display = "none";
            //       settingsBox.style.animation = "";
            // }, 300);
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
let sidebarIndicatorTimer;
const sidebarHoverIndicator = document.getElementById('sidebar-hover-indicator');

window.addEventListener("mousemove", (event) => {
      let isCursorModeOn = localStorage.getItem("cursorSidebar") || "off";

      // Manage sidebar hover indicator (visual cue)
      if (sidebarHoverIndicator) {
            const isSidebarClosed = !menuOptionsBox.classList.contains("open");
            const isDesktopSize = window.innerWidth >= 786;

            if (isCursorModeOn === "on" && !menuIsLocked && isSidebarClosed && isDesktopSize) {
                  sidebarHoverIndicator.style.opacity = "1";
                  clearTimeout(sidebarIndicatorTimer);
                  sidebarIndicatorTimer = setTimeout(() => {
                        sidebarHoverIndicator.style.opacity = "0";
                  }, 1000); // Hide after 1 second of inactivity
            } else {
                  sidebarHoverIndicator.style.opacity = "0";
            }
      }

      if (isCursorModeOn === "off") return;

      if (window.innerWidth >= 786) {
            let percentY = (event.clientY / window.innerHeight) * 100;
            if (event.clientX <= 5 && percentY >= 10 && percentY <= 90) {
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
                  if (entry.contentRect.width >= 550) {
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
      adjustBrightness();
});

function adjustBrightness() {
      let brightness = brightnessSlider.value;
      document.body.style.filter = `brightness(${brightness}%)`;
      localStorage.setItem("brightness", brightness);
}

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
      // showSplashScreen(); // temporary #########
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

// ============================================================
// Deep Dark Mode Toggle — simple body class + settings toggle
// ============================================================
const deepDarkModeBtn = document.getElementById('deep-dark-mode-btn');
const deepDarkModeBtnThumb = deepDarkModeBtn?.querySelector('.thumb');
const DEEP_DARK_STORAGE_KEY = 'deepDarkMode';

function setDeepDarkMode(enabled, saveState = true) {
      document.body.classList.toggle('deep-dark', enabled);
      if (!deepDarkModeBtn) return;
      deepDarkModeBtnThumb?.classList.toggle('switch-on', enabled);
      deepDarkModeBtn.style.backgroundColor = enabled ? $accentColor : '';
      if (saveState) {
            localStorage.setItem(DEEP_DARK_STORAGE_KEY, enabled ? 'on' : 'off');
      }
}

function enableDeepDarkMode(saveState = true) {
      setDeepDarkMode(true, saveState);
}

function disableDeepDarkMode(saveState = true) {
      setDeepDarkMode(false, saveState);
}

function toggleDeepDarkMode() {
      setDeepDarkMode(!document.body.classList.contains('deep-dark'));
}

function initializeDeepDarkMode() {
      setDeepDarkMode(localStorage.getItem(DEEP_DARK_STORAGE_KEY) === 'on', false);
}

if (deepDarkModeBtn) {
      deepDarkModeBtn.addEventListener('click', toggleDeepDarkMode);
}

document.addEventListener('DOMContentLoaded', initializeDeepDarkMode);