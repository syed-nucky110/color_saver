let displayContainer = document.querySelector(".display-container");
let favColorListContainer = document.querySelector(".fav-color-list-container");
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

if(getLayoutType == "") {
      localStorage.setItem("layout-type", "list");
}

if(getLayoutType === "list") {
      savedColorList.classList.remove("saved-color-grid-view");
      localStorage.setItem("layout-type", "list");
      setVisibleIcon();
}
else if(getLayoutType === "grid") {
      savedColorList.classList.add("saved-color-grid-view");
      localStorage.setItem("layout-type", "grid");
      setVisibleIcon();
}

function setVisibleIcon() {
      document.querySelectorAll(".layout-change-options .option").forEach(option => {
            option.querySelector(".checked-icon").classList.remove("visible-checked-icon");
      });
      let type = localStorage.getItem("layout-type");

      if(type == "list") {
            listView.querySelector(".checked-icon").classList.add("visible-checked-icon");
      }
      else if(type === "grid") {
            gridView.querySelector(".checked-icon").classList.add("visible-checked-icon");
      }

}

let menuIsOpen = false;
menu.addEventListener("click", (event) => {
      showHideMenuOptions();
      event.stopPropagation();
});

function showHideMenuOptions() {
      allOptions.style.transition = "transform .2s ease";
      
      if (menuIsOpen == false) {
            menuOptionsBox.style.display = "flex";
            menuIcon.setAttribute("name", "close");
            setTimeout(() => {
                  allOptions.style.transform = "translateY(0)";
            }, 100);
            menuIsOpen = true;
      }
      else {
            allOptions.style.transform = "translateY(-100%)";
            menuIcon.setAttribute("name", "ellipsis-vertical");
            setTimeout(() => {
                  menuOptionsBox.style.display = "none";
            }, 100);
            menuIsOpen = false;
      }
}

menuOptionsBox.addEventListener("click", (event) => {
      event.stopPropagation();
});

document.addEventListener("click", (event) => {
      if (event.target == displayContainer || event.target != allOptions) {
            if (menuIsOpen == true) {
                  showHideMenuOptions(); // hide options
            }
      }
});

let fullScreenIcon = document.querySelector(".screen-size-icon");
let screenSizeText = document.querySelector(".screen-size-options .option span");
let deleteAllColor = document.querySelector(".delete-color-options .option ");

let screenSize = localStorage.getItem("screen-size") || "";

if(screenSize === "") {
      localStorage.setItem("screen-size", "normal");
      removeFullScreen();
}
else if(screenSize === "full") {
      setFullScreen();
}
else if(screenSize === "normal") {
      removeFullScreen();
}


fullScreenBtn.addEventListener("click", () => {
      screenSize = localStorage.getItem("screen-size");

      if (screenSize === "normal") {
            setFullScreen();
            showHideMenuOptions();
      }
      else if (screenSize === "full") {
            removeFullScreen();
            showHideMenuOptions();
      }
});

function setFullScreen() {
      favColorListContainer.classList.add("full-screen");
      fullScreenIcon.setAttribute("name", "contract-outline");
      screenSizeText.textContent = "Exit full screen";
      localStorage.setItem("screen-size", "full");
}

function removeFullScreen() {
      favColorListContainer.classList.remove("full-screen");
      fullScreenIcon.setAttribute("name", "expand-outline");
      screenSizeText.textContent = "Full screen";
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

tippy('.cross-btn', {
      content: 'close',
      theme: 'dark',
});

tippy('.theme-btn', {
      content: 'theme',
});

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

savedColorList.addEventListener("dblclick", (event) => {
      if(event.target.closest(".saved-clr")) {
            let box = event.target.closest(".saved-clr");
            openColorEditor(box);
      }
});

function openColorEditor(box) {
      setTimeout(() => {
            choosedColorContainer.style.display = "flex";
      }, 100);

      let colorName = box.querySelector(".color-name").innerText;
      let bgColor = colorName;

      let colorNameInput = document.querySelector("#color-code-box");
      let displayColorBox = document.querySelector("#display-color-box");

      colorNameInput.value = colorName;
      displayColorBox.style.backgroundColor = bgColor;
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
            .then(() => {})
            .catch(() => fallbackCopy(text));
      } else {
            // Fallback for Safari/iPhone/Old browsers
            fallbackCopy(text);
      }
}

function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
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

let orgColorCode = "";
editBtn.addEventListener("click", () => {
      enableDisableEditingMode("enable");
      orgColorCode = colorNameInput.value;      
});

saveBtn.addEventListener("click", () => {
      let currentColorInput = colorNameInput.value;
      if(currentColorInput == orgColorCode) {
            enableDisableEditingMode("disable");
            return;
      }
      alert(currentColorInput);
      enableDisableEditingMode("disable");
 
});

backBtn.addEventListener("click", () => {
      enableDisableEditingMode("disable");
      colorNameInput.value = orgColorCode;
})

function enableDisableEditingMode(mode) {
      
      // toggling buttons
      defaultButtons.classList.toggle("hide-default-btns");
      editingButtons.classList.toggle("hide-editing-btns");
      colorNameInput.classList.toggle("color-code-box-visibility");
      
      // change input mode
      if(mode === "enable") {
            colorNameInput.removeAttribute("readonly");
            colorNameInput.focus();
      }
      else if(mode === "disable") {
            disableEditing();
      }
}

function disableEditing() {
      defaultButtons.classList.remove("hide-default-btns");
      editingButtons.classList.add("hide-editing-btns");
      colorNameInput.classList.remove("color-code-box-visibility");
      
      colorNameInput.setAttribute("readonly","");
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
});

addColorInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
            const result = isColorSaved(addColorInput.value);
            if (result === "not saved") {
                  colorListCreator(addColorInput.value);
            }
      }
      if (event.key == " ") {
            event.preventDefault();
      }
});

addColorBtn.addEventListener("click", () => {
      const result = isColorSaved(addColorInput.value);
      if (result === "not saved") {
            colorListCreator(addColorInput.value);
      }
});

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

      if(reason == "saved color") {
            errorText.textContent = "This color is already saved";
            errorIcon.setAttribute("name", "checkmark-circle-outline");
            errorMessage.style.color = "green";
      }
      else if(reason == "not color") {
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
      if(!isNaN(color)) {
            if(!color.includes("#")) {
                  return false;
            }
      }
      return tinycolor(color).isValid();
}

function colorListCreator(color) {
      if(isColorValid(color) == false) {
            showErrorMessage("not color");
            return;
      }
      createColorBox(color);
      saveColorInStorage(color);
      focusInput();
}

function createColorBox(color) {
      let colorBox = document.createElement("div");
      colorBox.setAttribute("class", "saved-clr");
      colorBox.style.backgroundColor = color;
      colorBox.setAttribute("tabindex", "0");

      let colorCode = getContrastColor(color);
      
      colorBox.innerHTML = `
      <span class="color-name" style="color:${colorCode};">${color}</span>
      <button class="delete-clr-btn"><ion-icon name="trash-outline"></ion-icon></button>
      `;

      savedColorList.prepend(colorBox);
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
}

renderColors();


function deleteSpecificColor(index) {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      allColors.splice(index, 1);

      localStorage.setItem("saveColor", JSON.parse(allColors));
}

function updateColorCounter() {
      allColors = JSON.parse(localStorage.getItem("saveColor")) || [];

      if(allColors.length <= 0) {
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


savedColorList.addEventListener("click", (event) => {
      if (event.target.closest(".delete-clr-btn")) {
            const colorBox = event.target.closest(".saved-clr");
            const colorName = colorBox.querySelector(".color-name").textContent;

            // Remove from localStorage
            allColors = JSON.parse(localStorage.getItem("saveColor")) || [];
            allColors = allColors.filter(color => color.toLowerCase() !== colorName.toLowerCase());
            localStorage.setItem("saveColor", JSON.stringify(allColors));

            // Remove from DOM
            colorBox.style.transition = "all .2s";
            colorBox.style.opacity = 0;
            colorBox.style.transform = "scale(0.8)";
            setTimeout(() => {
                  colorBox.remove();
            }, 210);

            // Update counter
            // savedColorCounting.textContent = allColors.length;
            updateColorCounter();
      }
});


// Layout change controling
let layoutOptions = document.querySelectorAll(".layout-change-options .option");

layoutOptions.forEach((option) => {
      option.addEventListener("click", () => {

            // sab icons se class hatao
            layoutOptions.forEach((otn) => {
                  otn.querySelector(".checked-icon").classList.remove("visible-checked-icon");
            });

            // sirf clicked wale icon me class add karo
            option.querySelector(".checked-icon").classList.add("visible-checked-icon");

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

window.addEventListener("offline", connectionLost);
window.addEventListener("online", connectionFound);

window.addEventListener("DOMContentLoaded", () => {
      if (!navigator.onLine) {
            connectionLost();
      } else {
            connectionFound();
      }
});

function connectionLost() {
      connectionLostContainer.style.display = "flex";
}

function connectionFound() {
      connectionLostContainer.style.display = "none";
}