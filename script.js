// Handle splash screen
const splashScreen = document.querySelector('.splash-screen');
let displayContainer = document.querySelector(".display-container");

let isSidebarLocked = localStorage.getItem("isSidebarLocked");
let menuIsLocked = false;

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

document.addEventListener('DOMContentLoaded', () => {
      const alreadyVisited = sessionStorage.getItem('visited');

      // Strict control
      displayContainer.style.display = "none";
      splashScreen.style.display = 'none';

      if (!alreadyVisited) {
            splashScreen.style.display = 'flex';
            displayContainer.style.display = "none";
            // Show splash screen for 3 seconds
            setTimeout(() => {
                  splashScreen.classList.add('fade-out');
                  setTimeout(() => {
                        splashScreen.style.display = 'none';
                        displayContainer.style.display = "flex";
                        checkSidebarIsLocked();
                  }, 500);
            }, 3000);

            // Mark as visited in sessionStorage
            sessionStorage.setItem('visited', 'true');
      } else {
            // Directly hide splash screen if already visited in session
            splashScreen.style.display = 'none';
            displayContainer.style.display = "flex";
            checkSidebarIsLocked();
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
let themeBtn = document.querySelector(".theme-btn");

let themeIcon = document.querySelector("#theme-icon");
let themeText = document.querySelector("#theme-text");

let theme = localStorage.getItem("theme") || "";
if (theme === "") {
      localStorage.setItem("theme", "light");
      // theme = "light";
}

// Apply theme on page load
if (theme === "dark") {
      enableDarkMode();
} else {
      disableDarkMode();
}

themeBtn.addEventListener("click", () => {
      let currentTheme = localStorage.getItem("theme");
      if (currentTheme === "light") {
            enableDarkMode();
      }
      else if (currentTheme === "dark") {
            disableDarkMode();
      }
});

function enableDarkMode() {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
      themeIcon.setAttribute("name", "sunny-outline");
      themeText.innerText = "Light";
}

function disableDarkMode() {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      themeIcon.setAttribute("name", "moon-outline");
      themeText.innerText = "Dark";
}

let listView = document.getElementById("list-view");
let gridView = document.getElementById("grid-view");

let getLayoutType = localStorage.getItem("layout-type") || "";

if (getLayoutType == "") {
      localStorage.setItem("layout-type", "list");
}

if (getLayoutType === "list") {
      setSelectedLayoutOption();
}
else if (getLayoutType === "grid") {
      setSelectedLayoutOption();
}

function setSelectedLayoutOption() {
      // document.querySelectorAll(".layout-change-options .option").forEach(option => {
      //       option.querySelector(".checked-icon").classList.remove("visible-checked-icon");
      // });
      let type = localStorage.getItem("layout-type");

      if (type == "list") {
            // listView.querySelector(".checked-icon").classList.add("visible-checked-icon");
            listView.classList.add("selected-nav-option");
            savedColorList.classList.remove("saved-color-grid-view");
            localStorage.setItem("layout-type", "list");
            gridView.classList.remove("selected-nav-option");
      }
      else if (type === "grid") {
            // gridView.querySelector(".checked-icon").classList.add("visible-checked-icon");
            listView.classList.remove("selected-nav-option");
            gridView.classList.add("selected-nav-option");
            savedColorList.classList.add("saved-color-grid-view");
            localStorage.setItem("layout-type", "grid");
      }
}

colorPicker.addEventListener("input", (event) => {
      addColorInput.value = colorPicker.value;
})

window.addEventListener("keyup", (event) => {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "g") {
            event.preventDefault();

            let currentLayout = localStorage.getItem("layout-type") || "list";

            if (currentLayout === "grid") {
                  localStorage.setItem("layout-type", "list");
            } else {
                  localStorage.setItem("layout-type", "grid");
            }

            setSelectedLayoutOption();
      }
});


let sidebarBtnArea = document.querySelector(".sidebar-buttons-area");
let sidebarOptions = document.querySelector(".menu-options-box .all-options"); // change .menu-scroll instead of .all-options
let menuCloseBtn = document.getElementById("menu-close-btn");

sidebarOptions.addEventListener("scroll", () => {
      sidebarBtnArea.style.transition = "background .3s ease, box-shadow .3s ease";
      if (sidebarOptions.scrollTop >= 20) {
            sidebarBtnArea.style.backgroundColor = "#000000";
            sidebarBtnArea.style.boxShadow = "0 0 40px rgba(0, 0, 0, 1)"
      }
      else {
            sidebarBtnArea.style.backgroundColor = "transparent";
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
            if (localStorage.getItem("screen-size") == "full") return throwMessage("Exit Fullscreen First")

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

let navLockBtn = document.getElementById("lock-navbar-btn");
let navLockIcon = document.getElementById("nav-lock-icon");

navLockBtn.addEventListener("click", () => {

      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") {
            return throwMessage("Exit Fullscreen First", "white");
      }

      if (menuIsLocked) {
            unlockNavbar();
      }
      else {
            lockNavbar();
      }
})

function lockNavbar() {
      localStorage.setItem("isSidebarLocked", "yes");

      navLockIcon.setAttribute("name", "lock-closed");
      navLockBtn.setAttribute("title", "Unlock sidebar");
      menuCloseBtn.style.visibility = "hidden";
      themeBtn.style.transform = "translateX(170px)";
      menuIsLocked = !menuIsLocked;
}

function unlockNavbar() {
      localStorage.setItem("isSidebarLocked", "no");

      navLockIcon.setAttribute("name", "lock-open-outline");
      navLockBtn.setAttribute("title", "Lock sidebar");
      menuCloseBtn.style.visibility = "visible";
      themeBtn.style.transform = "translateX(0px)";
      menuIsLocked = !menuIsLocked;
}

menuOptionsBox.addEventListener("click", (event) => {
      event.stopPropagation();
});

document.addEventListener("click", (event) => {
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
            if (menuIsLocked) {
                  throwMessage("Unlock Sidebar First");
            }
            else {
                  (localStorage.getItem("screen-size") == "full") ? removeFullScreen() : setFullScreen();
            }
      }
})

fullScreenBtn.addEventListener("click", () => {
      screenSize = localStorage.getItem("screen-size");

      // Full screen not allowd while sidebar is locked
      if (menuIsLocked) {
            return throwMessage("Unlock Sidebar First", "white");
      }
      if (resizerIsOn) {
            // return throwMessage("Turn off Resize First", "white");
            OffResizer();
      }

      if (screenSize === "normal") {
            setFullScreen();
            // showHideMenuOptions();
            hideMenuBar();
      }
      else if (screenSize === "full") {
            removeFullScreen();
            // showHideMenuOptions();
            hideMenuBar();
      }
});

function setFullScreen() {
      favColorListContainer.classList.add("full-screen");
      fullScreenIcon.setAttribute("name", "contract-outline");
      screenSizeText.innerText = "Exit full screen";
      localStorage.setItem("screen-size", "full");

      hideMenuBar();
}

function removeFullScreen() {
      favColorListContainer.classList.remove("full-screen");
      fullScreenIcon.setAttribute("name", "expand-outline");
      screenSizeText.innerText = "Full screen";
      localStorage.setItem("screen-size", "normal");
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
      popUpContainer.style.display = "flex";

      showHideMenuOptions(); // hide
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

savedColorList.addEventListener("mouseup", (event) => {
      savedColorList.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            return;
      });

      const box = event.target.closest(".saved-clr");

      if (event.target.closest(".delete-clr-btn")) return;
      if (seletionModOn && box) {
            box.classList.toggle("selected");

            const colorId = box.dataset.id; // har .saved-clr element pe ek unique data-id hona chahiye

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

function openColorEditor(box) {
      setTimeout(() => {
            choosedColorContainer.style.display = "flex";
      }, 100);

      let colorName = box.querySelector(".color-name").innerText;
      let bgColor = colorName;
      // document.querySelector('input[type="color"]').value = colorName;

      let colorNameInput = document.querySelector("#color-code-box");
      let displayColorBox = document.querySelector("#display-color-box");

      colorNameInput.value = colorName;
      displayColorBox.style.backgroundColor = bgColor;

      currentEditingBox = box;
}

closeClrBoxBtn.addEventListener("click", () => closeColorEditor());

function closeColorEditor() {
      choosedColorContainer.style.display = "none";
      disableEditing();
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
      const copyTextPopup = document.createElement("div");
      const icon = document.createElement("ion-icon");
      const textBox = document.createElement("span");

      copyTextPopup.classList.add("success-message-layout");
      icon.setAttribute("name", "checkmark-circle");
      textBox.textContent = text;

      copyTextPopup.appendChild(icon);
      copyTextPopup.appendChild(textBox);
      document.body.appendChild(copyTextPopup);

      // Slide down animation
      copyTextPopup.style.animation = "slideDown 0.3s ease forwards";

      setTimeout(() => {
            // Slide up animation
            copyTextPopup.style.animation = "slideUp 0.3s ease forwards";

            // Remove after animation ends
            copyTextPopup.addEventListener("animationend", () => {
                  copyTextPopup.remove();
            });
      }, 1500); // visible for 1.5s
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
let previewBox = document.getElementById("color-preview-box");

let orgColorCode = "";
editBtn.addEventListener("click", () => {
      enableDisableEditingMode("enable");
      showColorPreviewBox();
      previewBox.style.backgroundColor = "transparent";
      orgColorCode = colorNameInput.value;
});

colorNameInput.addEventListener("input", () => {
      let typedColor = colorNameInput.value;
      previewBox.style.backgroundColor = typedColor;
})

saveBtn.addEventListener("click", (event) => {
      colorSavingProcess();
});

colorNameInput.addEventListener("keydown", (event) => {
      if (event.key == "Enter") colorSavingProcess();
      else return;
})

function colorSavingProcess() {
      let newColor = colorNameInput.value.trim().toLowerCase();

      if (newColor === orgColorCode.toLowerCase()) {
            enableDisableEditingMode("disable");
            return;
      }

      if (newColor === "") {
            throwMessage("Please Fill Color First",)
            return;
      }

      if (!isColorValid(newColor)) {
            throwMessage("This is not a color", "white", "close-circle-outline");
            return;
      }

      let allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      // check if color already exists
      if (allColors.some(color => color.toLowerCase() === newColor)) {
            throwMessage("Color Already Saved", "#00ff00", "checkmark-circle-outline")
            return;
      }

      // Replace in storage
      let index = allColors.findIndex(color => color.toLowerCase() === orgColorCode.toLowerCase());
      if (index !== -1) {
            allColors[index] = newColor;
            localStorage.setItem("saveColor", JSON.stringify(allColors));
      }

      // Replace in DOM
      if (currentEditingBox) {
            let span = currentEditingBox.querySelector(".color-name");
            span.textContent = newColor;
            span.style.color = getContrastColor(newColor);
            currentEditingBox.style.backgroundColor = newColor;

            // 👇 Highlight animation
            currentEditingBox.classList.add("highlight-outline");
            setTimeout(() => {
                  currentEditingBox.classList.remove("highlight-outline");
            }, 1200);
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
            colorNameInput.removeAttribute("readonly");
            colorNameInput.focus();
      }
      else if (mode === "disable") {
            disableEditing();
      }
}

function showColorPreviewBox() {
      previewBox.style.display = "flex";
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
let errorMessage = document.querySelector(".error-message-div");

// update color counter
savedColorCounting.textContent = allColors.length;

addColorInput.addEventListener("input", () => {
      addColorInput.value = addColorInput.value.toLowerCase();
      isColorSaved(addColorInput.value);

      const quickPreviewMode = localStorage.getItem("quickPreviewMode") || "off";
      if (quickPreviewMode === "on") {
            highlightSavedColor(addColorInput.value);
      }
});

// Add color using Enter key
addColorInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
            const newColor = addColorInput.value.trim().toLowerCase();

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
                  }
                  return; // stop further execution
            }

            // Normal save process
            const result = isColorSaved(newColor);
            if (result === "not saved") {
                  colorListCreator(newColor);
            } else {
                  highlightSavedColor(newColor);
            }
            updateSelectionCount();
      }

      if (event.key == " ") {
            event.preventDefault();
      }
});

// Add color using Add button click
addColorBtn.addEventListener("click", async () => {
      const newColor = addColorInput.value.trim().toLowerCase();

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
            if (nameSpan?.textContent.toLowerCase() === colorValue.toLowerCase()) {

                  // Scroll into view
                  box.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                  });

                  let colorList = allColorsCounting;
                  setTimeout(() => {
                        colorList.scrollBy(0, -10);
                  }, 400);

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
            if (color.toLowerCase() === checkingColor.toLowerCase()) {
                  showErrorMessage("saved color");
                  return;
            }
            else {
                  hideErrorMessage();
            }
      }
      return "not saved";
}

function showErrorMessage(reason) {
      let errorIcon = errorMessage.querySelector("ion-icon");
      let errorText = errorMessage.querySelector("span");

      errorMessage.style.display = "flex";

      if (reason == "saved color") {
            errorText.textContent = "This color is already saved";
            errorIcon.setAttribute("name", "checkmark-circle-outline");
            errorMessage.style.color = "green";
      }
      else if (reason == "not color") {
            errorText.textContent = "This is not a color";
            errorIcon.setAttribute("name", "close-circle-outline");
            errorMessage.style.color = " #ff0000";
      }
}

function hideErrorMessage() {
      errorMessage.style.display = "none";
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
      if (isColorValid(color) == false) {
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
      let colorBox = document.createElement("div");
      colorBox.setAttribute("class", "saved-clr");
      colorBox.style.backgroundColor = color;
      colorBox.setAttribute("tabindex", "0");
      colorBox.setAttribute("data-id", `${color}`);

      let colorCode = getContrastColor(color);

      colorBox.innerHTML = `
      <span class="color-name" style="color:${colorCode};">${color}</span>
      <button class="delete-clr-btn"><ion-icon name="trash-outline"></ion-icon></button>
      `;

      savedColorList.prepend(colorBox);
      savedColorList.scrollTop = 0;
}

function saveColorInStorage(getColor) {
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
}

function deleteColorFromStorage(colorName) {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
      allColors = allColors.filter(color => color.toLowerCase() !== colorName.toLowerCase());
      localStorage.setItem("saveColor", JSON.stringify(allColors));
}

// Layout change controling
let layoutOptions = document.querySelectorAll(".layout-change-options .option");

layoutOptions.forEach((option) => {
      option.addEventListener("click", () => {

            layoutOptions.forEach((otn) => {
                  // otn.querySelector(".checked-icon").classList.remove("visible-checked-icon");
                  otn.classList.remove("selected-nav-option");
            });

            // option.querySelector(".checked-icon").classList.add("visible-checked-icon");
            option.classList.add("selected-nav-option");

            let layoutType = option.getAttribute("data-layout");

            savedColorList.classList.remove("saved-color-grid-view");

            if (layoutType === "list") {
                  savedColorList.classList.remove("saved-color-grid-view");
                  localStorage.setItem("layout-type", "list");
            }
            else if (layoutType === "grid") {
                  savedColorList.classList.add("saved-color-grid-view");
                  localStorage.setItem("layout-type", "grid");
            }
      });
});

// Deletion of color controling 
let popUpContainer = document.querySelector(".pop-up-container");
let popUpButtons = document.querySelectorAll(".pop-up-buttons .btn");

popUpButtons.forEach(btn => {
      btn.addEventListener("click", () => {
            let work = btn.getAttribute("data-work");

            if (work == "no-delete") {
                  popUpContainer.style.display = "none";
            }
            else if (work == "yes-delete") {
                  popUpContainer.style.display = "none";
                  localStorage.removeItem("saveColor");
                  savedColorList.innerHTML = "";
                  focusInput();
                  updateColorCounter();
            }


      });
});


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
      connectionLostContainer.style.display = "flex";
}

function connectionFound() {
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

function OnResizer() {
      const screenSize = localStorage.getItem("screen-size") || "";
      if (screenSize === "full") {
            return throwMessage("Exit Fullscreen First", "white");
      }
      resizeBtn.classList.add("selected-nav-option")
      favColorListContainer.classList.add("resizable");

      resizerIsOn = !resizerIsOn;
}

function OffResizer() {
      resizeBtn.classList.remove("selected-nav-option")
      favColorListContainer.classList.remove("resizable");

      resizerIsOn = !resizerIsOn;
}

let quickPreviewBtn = document.getElementById("quick-preview-mode-btn");
let quickPreviewIcon = document.getElementById("quick-preview-icon");

let isQuickPreviewModeON = localStorage.getItem("quickPreviewMode") || "off";
if (isQuickPreviewModeON === "on") {
      quickPreviewIcon.setAttribute("name", "eye-outline");
}
else {
      quickPreviewIcon.setAttribute("name", "eye-off-outline");
}

quickPreviewBtn.addEventListener("click", () => {
      setQuickPreviewMode();
});

function setQuickPreviewMode() {
      const currentMode = localStorage.getItem("quickPreviewMode") || "off";

      if (currentMode === "on") {
            quickPreviewIcon.setAttribute("name", "eye-off-outline");
            localStorage.setItem("quickPreviewMode", "off");
      } else {
            quickPreviewIcon.setAttribute("name", "eye-outline");
            localStorage.setItem("quickPreviewMode", "on");
      }
}

function throwMessage(text, color, icon = "alert-circle-outline") {

      let box = document.createElement("div");
      let textBox = document.createElement("p");
      let setIcon = document.createElement("ion-icon");

      box.classList.add("message-layout");
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
      const currentTheme = localStorage.getItem("theme") || "";

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "d") {
            event.preventDefault();

            if (currentTheme === "light") {
                  enableDarkMode();
            } else {
                  disableDarkMode();
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
                  inputElement.value = cleanText;
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

pasteBtn.addEventListener("click", async () => {
      const pastedValue = await pasteToInput(addColorInput);

      // Optional: Apply preview
      if (pastedValue) {
            isColorSaved(pastedValue);
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
      if(event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "r") {
            event.preventDefault();
            isTrashOpen ? closeTrashColorBox() : openTrashColorBox();
      }
})

trashBinBtn.addEventListener("click", () => {
      openTrashColorBox();
      hideMenuBar();
});

trashColorContainer.addEventListener("click", (event) => {
      if (event.target == closeTrashBoxBtn || (event.target == trashColorContainer && event.target != trashColorBox)) {
            closeTrashColorBox();
      }
})

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
      trashColorContainer.style.display = "none";
      isTrashOpen = !isTrashOpen;
}

function renderTrashColors() {
      // return;
      trashColorsList.innerHTML = "";
      const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
      
      updateTrashColorCounter();

      if (trashColors.length == 0) {
            trashColorsList.innerHTML = isTrashEmpty();
            return;
      }
      for (const color of trashColors) {
            trashColorBoxCreator(color);
      }
}

function isTrashEmpty() {
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
      color = color.toLowerCase();

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
      let color = colorBox.querySelector(".trash-color-name").textContent;

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
      color = color.toLowerCase();

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
      color = color.toLowerCase();

      let trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];

      trashColors = trashColors.filter(c => c != color);

      localStorage.setItem("trashColors", JSON.stringify(trashColors));
}

// Check if a color is available in saved colors
function isColorAvailableInStorage(color) {
      color = color.toLowerCase();

      let saveColor = JSON.parse(localStorage.getItem("saveColor")) || [];

      if (saveColor.includes(color)) return true;
      else return false;
}

// Check if a color is available in Trash bin
function isColorAvailableInTrash(color) {
      color = color.toLowerCase();

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
      shorcutContainer.style.display = shortcutBoxOpen ? "flex" : "none";
}

let sidebarSettingsOption = document.getElementById('settings');
let settingsContainer = document.getElementById('settings-container');
let settingsBox = document.getElementById('settings-box');
let settingsCloseBtn = document.getElementById('settings-close-btn');
let autoGridViewBtn = document.getElementById('auto-grid-view');
let autoGridViewBtnThumb = document.querySelector('.thumb');

let settingBoxOpen = false;

window.addEventListener("keyup", (event) => {
      if(event.shiftKey && event.altKey && event.key.toLocaleLowerCase() == "c") {
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

function setAutoGridView() {
      let isAutoModeOn = localStorage.getItem("autoGridView") || "disable";

      if (isAutoModeOn === "enable") {
            autoGridViewBtnThumb.classList.add("switch-on");
            autoGridViewBtn.style.backgroundColor = "#1070d1";
      }
      else {
            autoGridViewBtnThumb.classList.remove("switch-on");
            autoGridViewBtn.style.backgroundColor = "";
      }
}

setAutoGridView();


sidebarSettingsOption.addEventListener("click", () => {
      toggleSettingsBox();
})

settingsCloseBtn.addEventListener("click", toggleSettingsBox);

function toggleSettingsBox() {
      settingBoxOpen = !settingBoxOpen;
      settingsContainer.style.display = settingBoxOpen ? "flex" : "none";
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

window.addEventListener("mousemove", (event) => {
      return; // stop strictly for sometime
      if (window.innerWidth >= 786) {
            if (event.clientX <= 5) {
                  showMenuBar();
            }
      }
})

const observer = new ResizeObserver(entries => {
      if(localStorage.getItem("autoGridView") == "enable") {
            for (let entry of entries) {
                  if (entry.contentRect.width >= 768) {
                        localStorage.setItem("layout-type", "grid");
                  } else {
                        localStorage.setItem("layout-type", "list");
                  }
                  setSelectedLayoutOption();
            }
      }
});

observer.observe(favColorListContainer);
