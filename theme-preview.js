/**
 * ShadeSphere Theme Preview JavaScript
 * Simple function-based approach for live color updating
 */

// Global variables
let currentColors = {
    primary: '#4285F4',
    secondary: '#34A853',
    accent: '#EA4335',
    background: '#ffffff',
    text: '#212121'
};

let textInputTimeout;

// Initialize theme preview
function initThemePreview() {
    setupEventListeners();
    setupSidebarToggle();
    updateCSSVariables();
    initializeInputValues();
    addExportButton();
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('color-picker')) {
            handleColorChange(e.target);
        }
    });
    
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('color-text')) {
            handleTextColorChange(e.target);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.target.classList.contains('color-text')) {
            clearTimeout(textInputTimeout);
            textInputTimeout = setTimeout(() => handleTextColorChange(e.target), 300);
        }
    });
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle color picker changes
function handleColorChange(colorPicker) {
    const colorType = getColorType(colorPicker.id);
    const newColor = colorPicker.value;
    const textInput = document.getElementById(`${colorType}ColorText`);
    
    currentColors[colorType] = newColor;
    if (textInput) textInput.value = newColor;
    updateCSSVariables();
    addColorChangeAnimation(colorPicker);
}

// Handle text input changes
function handleTextColorChange(textInput) {
    const colorType = getColorType(textInput.id.replace('Text', ''));
    const colorValue = textInput.value.trim();
    
    if (isValidColor(colorValue)) {
        const colorPicker = document.getElementById(`${colorType}Color`);
        currentColors[colorType] = colorValue;
        if (colorPicker && isHexColor(colorValue)) colorPicker.value = colorValue;
        updateCSSVariables();
        textInput.classList.remove('error');
    } else if (colorValue !== '') {
        textInput.classList.add('error');
    }
}

// Setup sidebar toggle
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (window.innerWidth <= 768) toggleSidebarOverlay();
        });
    }
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                removeSidebarOverlay();
            }
        }
    });
}

// Toggle sidebar overlay
function toggleSidebarOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            removeSidebarOverlay();
        });
    }
    overlay.offsetHeight;
    overlay.classList.add('active');
}

// Remove sidebar overlay
function removeSidebarOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// Update CSS variables
function updateCSSVariables() {
    const root = document.documentElement;
    Object.keys(currentColors).forEach(colorType => {
        root.style.setProperty(`--${colorType}`, currentColors[colorType]);
    });
}

// Initialize input values
function initializeInputValues() {
    Object.keys(currentColors).forEach(colorType => {
        const colorPicker = document.getElementById(`${colorType}Color`);
        const textInput = document.getElementById(`${colorType}ColorText`);
        if (colorPicker) colorPicker.value = currentColors[colorType];
        if (textInput) textInput.value = currentColors[colorType];
    });
}

// Utility functions
function getColorType(inputId) {
    return inputId.replace('Color', '').replace('Text', '');
}

function isValidColor(color) {
    const dummy = document.createElement('div');
    dummy.style.color = color;
    return dummy.style.color !== '';
}

function isHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color);
}

function addColorChangeAnimation(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => element.style.transform = 'scale(1)', 150);
}

function handleResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        removeSidebarOverlay();
    }
}

// Export/Import functions
function exportTheme() {
    const themeData = {
        name: 'Custom Theme',
        colors: currentColors,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shadesphere-theme.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importTheme(jsonData) {
    try {
        const themeData = JSON.parse(jsonData);
        if (themeData.colors) {
            currentColors = { ...themeData.colors };
            initializeInputValues();
            updateCSSVariables();
            return true;
        }
    } catch (error) {
        console.error('Invalid theme data:', error);
    }
    return false;
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'e': e.preventDefault(); exportTheme(); break;
            case 't': e.preventDefault(); document.getElementById('sidebarToggle').click(); break;
        }
    }
}

// Add export button
function addExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Theme';
    exportBtn.style.cssText = 'display: block; width: 100%; padding: 12px; margin: 20px 0; background: linear-gradient(135deg, #34A853, #4285F4); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;';
    exportBtn.addEventListener('click', exportTheme);
    exportBtn.addEventListener('mouseenter', () => {
        exportBtn.style.transform = 'translateY(-1px)';
        exportBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    exportBtn.addEventListener('mouseleave', () => {
        exportBtn.style.transform = 'translateY(0)';
        exportBtn.style.boxShadow = 'none';
    });
    document.querySelector('.color-controls').appendChild(exportBtn);
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .color-text.error {
        border-color: #dc3545 !important;
        background-color: #fff5f5;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', initThemePreview);