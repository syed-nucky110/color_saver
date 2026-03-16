// ===============================================
// DOM ELEMENT SELECTORS
// ===============================================

// Main gradient wrapper and form elements
let gradientWrapper = document.querySelector('.gradient-color-wrapper')
let getGradientForm = document.querySelector('.get-gradient-color-form')

// Color input and control elements
let gradientColorInputArea = document.querySelector('.gradient-colors-input-area')
let addMoreColorBtn = document.getElementById('add-more-color')
let colorDirection = document.getElementById('color-direction')
let colorType = document.getElementById('color-type')
let previewGradientColorBox = document.querySelector('.preview-gradient-color-box')
let previewGradientOnFrameBtn = document.getElementById('preview-on-frame-btn')
let saveGradientBtn = document.getElementById('save-gradient-clr-btn')
let gradientColorsList = document.querySelector('.saved-gradients-list')

// Navigation and option elements
let gradientColorsOption = document.getElementById('gradient-clr-option')
let gradientLogo = document.querySelector('.gradient-color-logo h1')
let backToHome = document.getElementById('back-to-home-btn')

// Gradient dialog/modal control elements
let choosedGradientColorContainer = document.querySelector('.gradient-color-choosed-container')
let choosedGradientDialogBox = document.querySelector('.choosed-gradient-dialog-box')
let gradientDialogBoxCloseBtn = document.querySelector('#dialog-cross-btn')
let dialogColorFieldSection = document.querySelector('.dialog-color-field-section')
let gradientColorString = document.querySelector('.gradient-color-string')
let copyGradientColorStringBtn = document.getElementById('copy-gradient-color-string')
let gradientColorDeleteBtn = document.querySelector('button.delete-gradient-color-btn')
let dialogGradientPreviewBox = document.querySelector('.dialog-color-preview-section')

// Preview frame elements
let gradientPreviewFrame = document.querySelector('.gradient-preview-frame')
let gradientPreviewFrameCloseBtn = document.getElementById('gradient-preview-frame-close-btn')
let simplePreviewFrame = document.querySelector('.simple-preview-frame')
let simplePreviewFrameCloseBtn = document.getElementById('simple-preview-frame-close-btn')
let dialogPreviewFrameBtn = document.querySelector('.dialog-preview-on-frame-btn')

// ===============================================
// EVENT LISTENERS SETUP
// ===============================================

// Back to home button - closes gradient mode
backToHome.addEventListener('click', () => {
      closeGradientMode();
})

// Color direction input change handler
colorDirection.addEventListener('input', () => {
      if (!isHexColor(colorDirection.value)) {
            updatePreviewBox();
      }
      else {
            disableSaveGradientBtn();
      }
})

// Add event listener for the clear direction button
document.querySelector('.clear-direction-value-btn').addEventListener('click', () => {
      colorDirection.value = '';
      colorDirection.focus();
      updatePreviewBox();
})

// Color type change handler (linear, radial, etc.)
colorType.addEventListener('change', () => {
      updatePreviewBox();
})

dialogPreviewFrameBtn.addEventListener('click', (event) => {
      let colorBox = event.target.closest('.dialog-color-preview-section');
      let color = getComputedStyle(colorBox).background;
      opneSimplePreviewFrame(color);
})

let gradientHeader = document.querySelector('.gradient-color-header');
gradientWrapper.addEventListener('scroll', (event) => {
      if (gradientWrapper.scrollTop > 20) {
            gradientHeader.classList.add('small-gradient-color-header');
      }
      else {
            gradientHeader.classList.remove('small-gradient-color-header');
      }
})

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Creates HTML structure for a new gradient color input field
 * @returns {string} HTML string for the input field
 */
function getGradientInputField() {
      // Count existing fields to determine the next color number
      let count = document.querySelectorAll('.get-gradient-input-field').length;
      let newIndex = count + 1;
      let randomColor = getRandomHexColor();

      // Create HTML structure with color picker, text input, and stop percentage
      let structure = `
            <span class="input-title">Color ${newIndex}</span>
            <div class="gradient-input-field get-gradient-input-field hover-focus">
                  <input type="color" class="gradient-type-clr-input" value="${randomColor}">
                  <input id="color-${newIndex}" type="text" value="${randomColor}" placeholder="Type any color" required>
                  <button class="clear-input-value-btn">
                        <ion-icon name="close-circle-outline"></ion-icon>
                  </button>
                  <input id="color-${newIndex}a" type="text" class="color-stops-input" placeholder="e.g. 20%">
                  <button class="remove-input-btn" title="Remove Color">
                        <ion-icon name="close-outline"></ion-icon>
                  </button>
            </div>
      `
      return structure;
}

/**
 * Generates a random hexadecimal color
 * @returns {string} Random hex color in format #RRGGBB
 */
function getRandomHexColor() {
      const val = Math.floor(Math.random() * 0xffffff);
      return "#" + val.toString(16).padStart(6, "0").toUpperCase();
}

// Add more color button click handler
addMoreColorBtn.addEventListener('click', () => {
      addNewInput();
})

/**
 * Adds a new color input field to the gradient form
 * Scrolls to the new field and updates preview
 */
function addNewInput() {
      let structure = getGradientInputField();
      let field = document.createElement('div')
      field.classList.add('per-input-area')
      field.innerHTML = structure;
      gradientColorInputArea.append(field)

      // Smooth scroll to the newly added field
      field.scrollIntoView({
            block: "end",
            behavior: "smooth"
      })

      console.clear()
      setupColorSync()  // Setup event listeners for new field
      updatePreviewBox();  // Update gradient preview
}

// Handle remove button clicks for color input fields
gradientColorInputArea.addEventListener("click", (event) => {
      if (event.target.closest('.remove-input-btn')) {
            let field = event.target.closest('.per-input-area')
            field.remove();  // Remove the input field
            updatePreviewBox();  // Update preview after removal
      }

      else if (event.target.closest('.clear-input-value-btn')) {
            let field = event.target.closest('.per-input-area')
            let colorInput = field.querySelector('input[type="text"]');
            colorInput.value = "";
            colorInput.focus();
            updatePreviewBox();
      }
})

// Handle clear button click for direction input
document.querySelector('.gradient-dir-type-inputs').addEventListener('click', (event) => {
      if (event.target.closest('.clear-direction-value-btn')) {
            colorDirection.value = "";
            colorDirection.focus();
            updatePreviewBox();
      }
})

/**
 * Sets up synchronization between color picker and text input
 * Ensures both inputs stay in sync and validates color values
 */
function setupColorSync() {
      let allGradientInputs = document.querySelectorAll('.get-gradient-input-field')

      allGradientInputs.forEach(inputField => {
            // Only bind events if not already bound (prevents duplicate listeners)
            if (!inputField.dataset.bound) {
                  let colorInput = inputField.querySelector('input[type="text"]');
                  let colorPicker = inputField.querySelector('input[type="color"]');
                  // let colorStops = inputField.querySelector('.color-stops-input')

                  // Text input change handler
                  colorInput.addEventListener("input", (event) => {
                        colorInput.value = colorInput.value.toUpperCase();
                        // Validate hex color and sync with color picker
                        if (isHexColor(colorInput.value)) {
                              colorPicker.value = colorInput.value;
                              enableSaveGradientBtn();
                              updatePreviewBox();
                        }
                        else {
                              disableSaveGradientBtn();
                        }
                  })

                  // Prevent space key in color input
                  colorInput.addEventListener('keydown', (event) => {
                        if (event.key == " ") {
                              event.preventDefault();
                        }
                  })

                  // Color picker change handler - sync with text input
                  colorPicker.addEventListener('input', () => {
                        colorInput.value = colorPicker.value.toUpperCase();
                        updatePreviewBox();
                  })

                  // Mark as bound to prevent duplicate event listeners
                  inputField.dataset.bound = "true";
            }
      });
}

// Array to store gradient colors
let colors = [];

/**
 * Updates the gradient preview box with current color settings
 * Collects all color values and generates CSS gradient string
 */
function updatePreviewBox() {
      colors = [];  // Reset colors array
      let gradientType = colorType.value;  // linear-gradient, radial-gradient, etc.
      let gradientDirection = colorDirection.value;  // direction or position


      // Collect all valid colors from input fields
      gradientColorInputArea.querySelectorAll('.get-gradient-input-field').forEach(field => {
            const textInput = field.querySelector('input[type="text"]');
            const stopInput = field.querySelector('.color-stops-input')

            // Only add valid hex colors
            if (isHexColor(textInput.value)) {
                  let stopValue = stopInput.value;
                  // Include stop percentage if provided
                  if (stopValue) {
                        colors.push(`${textInput.value} ${stopValue}`)
                  }
                  else {
                        colors.push(textInput.value)
                  }
            }
      })

      // Setup event listeners for color stop inputs
      document.querySelectorAll('.color-stops-input').forEach(input => {
            if (!input.dataset.bound) {
                  input.addEventListener("input", () => {
                        updatePreviewBox();
                  })
                  input.dataset.bound = "true";
            }
      })

      // Generate and apply CSS gradient
      let gradientCSS = `${gradientType}(${gradientDirection}, ${colors.join(",")})`
      previewGradientColorBox.style.background = gradientCSS
      updateGradientFrame(gradientCSS)

      // Enable/disable save button based on gradient validity
      if (isValidGradient(gradientCSS)) {
            enableSaveGradientBtn();
      }
      else {
            disableSaveGradientBtn();
      }
}

// Initialize preview on page load
updatePreviewBox();

/**
 * Updates the fullscreen gradient preview frame background
 * @param {string} color - CSS gradient string
 */
function updateGradientFrame(color) {
      gradientPreviewFrame.style.background = color;
}

/**
 * Enables the save gradient button when gradient is valid
 */
function enableSaveGradientBtn() {
      saveGradientBtn.style.opacity = "1";
      saveGradientBtn.removeAttribute("disabled");
      saveGradientBtn.style.cursor = ""
}

/**
 * Disables the save gradient button when gradient is invalid
 */
function disableSaveGradientBtn() {
      saveGradientBtn.style.opacity = ".6";
      saveGradientBtn.setAttribute("disabled", "");
      saveGradientBtn.style.cursor = "no-drop"
}

/**
 * Validates if a color value is valid using tinycolor library
 * @param {string} value - Color value to validate
 * @returns {boolean} True if valid color
 */
function isHexColor(value) {
      const color = tinycolor(value.trim());
      return color.isValid();
}

// Initialize color synchronization
setupColorSync();

// ===============================================
// GRADIENT SCHEMA AND SAVING
// ===============================================

let Schema = null;

/**
 * Creates a schema object for saving gradient data
 * @returns {Object} Gradient schema with type, direction, colors, and CSS code
 */
function savedColorSchema() {
      return Schema = {
            type: colorType.value,           // Gradient type (linear, radial, etc.)
            direction: colorDirection.value, // Direction or position
            colors,                          // Array of colors with stops
            CSS_code: `${colorType.value}(${colorDirection.value}, ${colors.join(", ")})` // Complete CSS
      }
}

// ===============================================
// GRADIENT MODE TOGGLE
// ===============================================

// Open gradient mode when option is clicked
gradientColorsOption.addEventListener("click", () => {
      openGradientMode();
})

// Close gradient mode when logo is clicked
gradientLogo.addEventListener('click', () => {
      closeGradientMode();
})

/**
 * Opens the gradient mode interface with smooth transition
 * Hides main app and shows gradient tools
 */

// openGradientMode();  // Open gradient mode on page load for easy access during development
function openGradientMode() {
      // Close merge mode if active
      if (isMergeModeOn) {
            mergeModeOff();
            throwMessage("Merge Mode off");
            return;
      };

      gradientWrapper.style.display = "flex";

      // Smooth transition animation
      setTimeout(() => {
            AppWrapper.style.transform = "scale(0.8)";
            AppWrapper.style.opacity = "0";
            gradientWrapper.style.opacity = "1";
            document.querySelector('head title').textContent = "ShadeSphare - Gradients"
            gradientWrapper.style.transform = "scale(1)";
      }, 100);
}

/**
 * Closes the gradient mode and returns to main app
 * Restores main app interface with smooth transition
 */
function closeGradientMode() {
      // Close merge mode if active
      if (isMergeModeOn) {
            mergeModeOff();
            throwMessage("Merge Mode off");
            return;
      };

      // Restore main app with animation
      AppWrapper.style.opacity = ""
      gradientWrapper.style.opacity = "0"
      gradientWrapper.style.transform = "";
      document.querySelector('head title').textContent = "ShadeSphare"
      AppWrapper.style.transform = "";

      setTimeout(() => {
            gradientWrapper.style.display = ""
      }, 300);
}

// Track gradient mode state for keyboard shortcut
let isGradientMode = false;

// Keyboard shortcut: Alt + G to toggle gradient mode
document.addEventListener("keyup", (event) => {
      if (event.altKey && event.key.toLocaleLowerCase() == "g" && !event.shiftKey) {
            (isGradientMode) ? closeGradientMode() : openGradientMode();
      }
      isGradientMode = !isGradientMode;
})

/**
 * Validates if a gradient CSS string is supported by the browser
 * @param {string} gradientStr - CSS gradient string to validate
 * @returns {boolean} True if gradient is valid
 */
function isValidGradient(gradientStr) {
      return CSS.supports('background', gradientStr);
}

// ===============================================
// GRADIENT SAVING AND LOADING
// ===============================================

// Save gradient button click handler
saveGradientBtn.addEventListener("click", () => {
      let schema = savedColorSchema();
      console.log(schema);

      // Check if gradient is already saved to prevent duplicates
      if (isAlreadySavedGradient(schema)) {
            return throwMessage("Already Saved");
      }
      saveGradientProcess(schema);
})

/**
 * Saves a gradient to localStorage and adds it to the UI
 * @param {Object} colorSchema - Gradient schema object
 */
function saveGradientProcess(colorSchema) {
      let gradientAllColors = JSON.parse(localStorage.getItem('gradient-colors')) || [];
      gradientAllColors.push(colorSchema);
      gradientColorsList.prepend(gradientBoxCreator(colorSchema))
      localStorage.setItem('gradient-colors', JSON.stringify(gradientAllColors));

      gradientColorsList.scrollTop = 0;
}

/**
 * Renders all saved gradients from localStorage to the UI
 */
function renderGradientColors() {
      let allGradients = JSON.parse(localStorage.getItem('gradient-colors')) || [];
      allGradients.forEach(gradient => {
            gradientColorsList.prepend(gradientBoxCreator(gradient))
      });
}

// Load saved gradients on page load
renderGradientColors();

/**
 * Checks if a gradient is already saved to prevent duplicates
 * @param {Object} gradient - Gradient schema to check
 * @returns {boolean} True if gradient already exists
 */
function isAlreadySavedGradient(gradient) {
      let allGradients = JSON.parse(localStorage.getItem('gradient-colors')) || [];
      for (const color of allGradients) {
            if (color.CSS_code.toLowerCase() == gradient.CSS_code.toLowerCase()) return true;
      }
      return false;
}


/**
 * Creates a DOM element for displaying a saved gradient
 * @param {Object} color - Gradient schema object
 * @returns {HTMLElement} Gradient box element
 */
function gradientBoxCreator(color) {
      let gradientBox = document.createElement('div')
      gradientBox.classList.add('saved-gradient-color')
      gradientBox.setAttribute('data-color-code', color.CSS_code)
      gradientBox.setAttribute('data-gradient', JSON.stringify(color))
      gradientBox.style.background = color.CSS_code;

      // Add control buttons for preview and copy
      gradientBox.innerHTML = `
            <div class="saved-gradient-color-option-bar">
                  <div class="saved-gradient-color-option-bar-btn-area">
                        <button class="preview-gradient-on-frame-btn">
                              <ion-icon name="scan-outline"></ion-icon>
                        </button>
                        <button class="copy-option" title="Copy CSS">
                              <ion-icon name="copy-outline"></ion-icon>
                        </button>
                  </div>
            </div>
      `

      return gradientBox;
}

// Initialize gradient mode on page load
// openGradientMode();

// ===============================================
// GRADIENT LIST INTERACTION HANDLERS
// ===============================================

// Variable to track currently selected gradient for dialog operations
let currentChoosedGradient = null;

// Handle clicks on saved gradient list items
gradientColorsList.addEventListener('click', (event) => {
      // Copy gradient CSS when copy button is clicked
      if (event.target.closest('.saved-gradient-color .copy-option')) {
            let colorToCopy = event.target.closest('.saved-gradient-color');
            let textToCopy = colorToCopy.getAttribute('data-color-code');
            copyText(textToCopy);
      }
      // Open gradient dialog when gradient box is clicked (but not on buttons)
      else if (event.target.closest('.saved-gradient-color') && !event.target.closest('.saved-gradient-color-option-bar')) {
            let gradientBox = event.target.closest('.saved-gradient-color')
            let gradientData = JSON.parse(gradientBox.getAttribute('data-gradient'))
            currentChoosedGradient = gradientBox;
            openGradientDialogBox(gradientData);
      }
      // Open simple preview frame when preview button is clicked
      else if (event.target.closest('.preview-gradient-on-frame-btn')) {
            let gradientBox = event.target.closest('.saved-gradient-color')
            let gradientColor = gradientBox.getAttribute('data-color-code')
            opneSimplePreviewFrame(gradientColor);
      }
})

// Handle gradient deletion from dialog
gradientColorDeleteBtn.addEventListener('click', (event) => {
      deleteGradientProcess(currentChoosedGradient);
      closeGradientDialogBox();
})

/**
 * Deletes a gradient from localStorage and removes it from UI
 * @param {HTMLElement} gradientBox - Gradient box element to delete
 */
function deleteGradientProcess(gradientBox) {
      let gradientData = JSON.parse(gradientBox.getAttribute('data-gradient'));
      let allGradients = JSON.parse(localStorage.getItem('gradient-colors')) || [];

      // Filter out the gradient to delete
      let updatedGradients = allGradients.filter(gradient =>
            gradient.CSS_code.toLowerCase() !== gradientData.CSS_code.toLowerCase()
      )

      localStorage.setItem('gradient-colors', JSON.stringify(updatedGradients));
      removeFromDOM(gradientBox);  // Remove from UI
}

// ===============================================
// GRADIENT DIALOG BOX CONTROLS
// ===============================================

// Close dialog with close button
gradientDialogBoxCloseBtn.addEventListener('click', () => {
      closeGradientDialogBox();
})

// Close dialog when clicking outside the dialog box
choosedGradientColorContainer.addEventListener('click', (event) => {
      if (event.target == choosedGradientColorContainer && event.target != choosedGradientDialogBox) {
            closeGradientDialogBox();
      }
})

/**
 * Opens the gradient details dialog with color information
 * @param {Object} gradientData - Gradient schema object
 */
function openGradientDialogBox(gradientData) {
      choosedGradientColorContainer.style.display = "flex";

      // Extract only color values (without stops) for display
      let onlyColors = extractColorsOnly(gradientData.colors);

      // Set dialog background to the gradient
      dialogGradientPreviewBox.style.background = gradientData.CSS_code;

      // Clear and populate color fields
      dialogColorFieldSection.innerHTML = "";
      onlyColors.forEach(color => {
            dialogColorFieldSection.append(perGradientColorFieldCreator(color));
      });

      // Display CSS code
      gradientColorString.setAttribute("title", gradientData.CSS_code)
      gradientColorString.textContent = gradientData.CSS_code;
}

/**
 * Closes the gradient dialog with animation
 */
function closeGradientDialogBox() {
      choosedGradientDialogBox.style.animation = 'threeD-rotate-backword .3s ease'
      setTimeout(() => {
            choosedGradientColorContainer.style.display = "none";
            choosedGradientDialogBox.style.animation = '';
      }, 280);
}

// Handle copy button clicks in dialog color fields
dialogColorFieldSection.addEventListener('click', (event) => {
      if (event.target.closest('.per-color-copy-btn')) {
            let colorBox = event.target.closest('.dialog-color-field');
            let textToCopy = colorBox.querySelector('.color-name').textContent;
            copyText(textToCopy);
      }
})

/**
 * Creates a color field element for the dialog
 * @param {string} color - Hex color value
 * @returns {HTMLElement} Color field element
 */
function perGradientColorFieldCreator(color) {
      let perColorFeild = document.createElement('div')
      perColorFeild.classList.add('dialog-color-field')

      perColorFeild.innerHTML = `
            <span class="color-indicator" style="background-color:${color}"></span>
            <span class="color-name">${color}</span>
            <button class="per-color-copy-btn">
                  <ion-icon name="copy-outline"></ion-icon>
            </button>
      `
      return perColorFeild;
}

/**
 * Extracts only color values from gradient colors array (removes stop percentages)
 * @param {Array} colorsArray - Array of colors with optional stops
 * @returns {Array} Array of pure color values
 */
function extractColorsOnly(colorsArray) {
      return colorsArray.map(item => {
            return item.trim().split(" ")[0];  // Take only the color part, ignore stops
      });
}

// Copy gradient CSS string from dialog
copyGradientColorStringBtn.addEventListener('click', () => {
      copyText(gradientColorString.textContent);
})

// ===============================================
// PREVIEW FRAME CONTROLS
// ===============================================

// Open fullscreen preview when preview button is clicked
previewGradientOnFrameBtn.addEventListener('click', (event) => {

      gradientWrapper.scrollTop = 0;

      let colorBox = event.target.closest('.preview-gradient-color-box');
      let color = getComputedStyle(colorBox).background;
      openGradientPreviewFrame(color);
      getGradientForm.classList.add('sidebar-mode')  // Enable sidebar mode
})

// Close main preview frame
gradientPreviewFrameCloseBtn.addEventListener('click', () => {
      closeGradientPreviewFrame();
})

// Close simple preview frame
simplePreviewFrameCloseBtn.addEventListener('click', () => {
      closeSimplePreviewFrame()
})

simplePreviewFrame.addEventListener('dblclick', () => {
      closeSimplePreviewFrame();
})

// Toggle sidebar visibility when clicking on preview frame (but not close button)
gradientPreviewFrame.addEventListener('click', (event) => {
      // Don't toggle if clicking the close button
      if (event.target.closest('#gradient-preview-frame-close-btn')) {
            return;
      }

      let gradientNavOpen = gradientPreviewFrame.dataset.navOpen === 'true';

      // Toggle sidebar height to show/hide navigation
      if (gradientNavOpen) {
            getGradientForm.style.height = '';  // Show full sidebar
            gradientPreviewFrame.dataset.navOpen = 'false';
      } else {
            getGradientForm.style.height = '20px';  // Minimize sidebar
            gradientPreviewFrame.dataset.navOpen = 'true';
      }
})

/**
 * Opens the fullscreen gradient preview frame
 * @param {string} color - CSS gradient string to preview
 */
let previousTheme = null;
function openGradientPreviewFrame(color) {
      gradientWrapper.style.overflow = "hidden";  // Prevent scrolling
      gradientPreviewFrame.style.display = "flex";
      gradientPreviewFrame.style.background = color;
      gradientPreviewFrame.dataset.navOpen = 'false'; // Initialize nav state

      hideLogo();

      previousTheme = (localStorage.getItem("theme") === "light") ? "light" : "dark";
      enableDarkMode();

      // Smooth fade-in animation
      setTimeout(() => {
            gradientPreviewFrame.style.opacity = '1';
      }, 50);
}

/**
 * Closes the fullscreen gradient preview frame
 */
function closeGradientPreviewFrame() {
      gradientWrapper.style.overflow = "";  // Restore scrolling
      gradientPreviewFrame.style.opacity = '0';
      getGradientForm.style.height = ''; // Reset sidebar height
      getGradientForm.classList.remove('sidebar-mode'); // Remove sidebar mode
      gradientPreviewFrame.dataset.navOpen = 'false'; // Reset nav state

      showLogo();

      if (previousTheme === "light") {
            disableDarkMode();
      }

      // Hide element after animation completes
      setTimeout(() => {
            gradientPreviewFrame.style.display = "none";
      }, 300);
}

/**
 * Opens a simple preview frame for quick gradient viewing
 * @param {string} color - CSS gradient string to preview
 */
function opneSimplePreviewFrame(color) {
      simplePreviewFrame.style.display = "flex";
      simplePreviewFrame.style.background = color;

      hideLogo();

      // Smooth fade-in animation
      setTimeout(() => {
            simplePreviewFrame.style.opacity = "1";
      }, 50);
}

/**
 * Closes the simple preview frame
 */
function closeSimplePreviewFrame() {
      simplePreviewFrame.style.opacity = "0";

      showLogo();

      // Hide element after fade-out animation
      setTimeout(() => {
            simplePreviewFrame.style.display = "none";
      }, 300);
}