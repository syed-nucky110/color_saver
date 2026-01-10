/**
 * ShadeSphere AI Theme Generator JavaScript
 * Simple function-based approach for AI-powered theme generation
 */

// Global variables
let colorIndex = 4; // Start after the 4 default colors
let isGeneratingTheme = false;

// Initialize the theme generator
function initThemeGenerator() {
    setupEventListeners();
    setupSidebarToggle();
    initializeColorInputs();
}

// Setup all event listeners
function setupEventListeners() {
    // Add color button
    document.getElementById('addColorBtn').addEventListener('click', addNewColorInput);
    
    // Apply theme button
    document.getElementById('applyThemeBtn').addEventListener('click', applyAITheme);
    
    // Color input changes
    document.addEventListener('change', handleColorInputChange);
    document.addEventListener('input', handleColorTextChange);
    
    // Window resize
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Initialize existing color inputs
function initializeColorInputs() {
    const colorGroups = document.querySelectorAll('.color-input-group');
    colorGroups.forEach((group, index) => {
        setupColorInputGroup(group, index);
        // Show remove button for all but first 4 colors
        if (index >= 4) {
            const removeBtn = group.querySelector('.remove-color-btn');
            if (removeBtn) removeBtn.style.display = 'block';
        }
    });
}

// Setup individual color input group
function setupColorInputGroup(group, index) {
    const colorPicker = group.querySelector('.color-picker');
    const colorText = group.querySelector('.color-text');
    const removeBtn = group.querySelector('.remove-color-btn');
    
    // Sync color picker with text input
    colorPicker.addEventListener('change', () => {
        colorText.value = colorPicker.value;
        validateColorInput(colorText);
    });
    
    // Sync text input with color picker
    colorText.addEventListener('input', () => {
        if (isValidColor(colorText.value) && isHexColor(colorText.value)) {
            colorPicker.value = colorText.value;
        }
        validateColorInput(colorText);
    });
    
    // Remove color functionality
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeColorInput(group));
    }
}

// Add new color input
function addNewColorInput() {
    const container = document.getElementById('colorInputsContainer');
    const newGroup = document.createElement('div');
    newGroup.className = 'color-input-group';
    newGroup.setAttribute('data-color-index', colorIndex);
    
    const randomColor = generateRandomColor();
    
    newGroup.innerHTML = `
        <label>Color ${colorIndex + 1}</label>
        <div class="input-wrapper">
            <input type="color" value="${randomColor}" class="color-picker">
            <input type="text" value="${randomColor}" class="color-text" autocomplete="off">
            <button class="remove-color-btn" aria-label="Remove Color">×</button>
        </div>
    `;
    
    container.appendChild(newGroup);
    setupColorInputGroup(newGroup, colorIndex);
    
    // Add entrance animation
    newGroup.style.opacity = '0';
    newGroup.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        newGroup.style.transition = 'all 0.3s ease';
        newGroup.style.opacity = '1';
        newGroup.style.transform = 'translateY(0)';
    }, 10);
    
    colorIndex++;
}

// Remove color input
function removeColorInput(group) {
    // Don't allow removing if less than 4 colors
    const allGroups = document.querySelectorAll('.color-input-group');
    if (allGroups.length <= 4) {
        showStatusMessage('You need at least 4 colors for AI theme generation', 'error');
        return;
    }
    
    // Add exit animation
    group.style.transition = 'all 0.3s ease';
    group.style.opacity = '0';
    group.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        group.remove();
    }, 300);
}

// Generate random color
function generateRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Handle color input changes
function handleColorInputChange(e) {
    if (e.target.classList.contains('color-picker')) {
        const colorText = e.target.parentElement.querySelector('.color-text');
        colorText.value = e.target.value;
        validateColorInput(colorText);
    }
}

// Handle color text changes
function handleColorTextChange(e) {
    if (e.target.classList.contains('color-text')) {
        validateColorInput(e.target);
        
        if (isValidColor(e.target.value) && isHexColor(e.target.value)) {
            const colorPicker = e.target.parentElement.querySelector('.color-picker');
            colorPicker.value = e.target.value;
        }
    }
}

// Validate color input
function validateColorInput(input) {
    if (input.value.trim() === '') {
        input.classList.remove('error');
        return;
    }
    
    if (isValidColor(input.value)) {
        input.classList.remove('error');
    } else {
        input.classList.add('error');
    }
}

// Check if color is valid
function isValidColor(color) {
    const dummy = document.createElement('div');
    dummy.style.color = color;
    return dummy.style.color !== '';
}

// Check if color is hex format
function isHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color);
}

// Get all colors from inputs
function getAllColors() {
    const colorInputs = document.querySelectorAll('.color-text');
    const colors = [];
    
    colorInputs.forEach(input => {
        const color = input.value.trim();
        if (color && isValidColor(color)) {
            colors.push(color);
        }
    });
    
    return colors;
}

// Apply AI theme
async function applyAITheme() {
    if (isGeneratingTheme) return;
    
    const colors = getAllColors();
    
    // Validate minimum colors
    if (colors.length < 4) {
        showStatusMessage('Please provide at least 4 valid colors for AI theme generation', 'error');
        return;
    }
    
    // Validate all colors
    const invalidColors = colors.filter(color => !isValidColor(color));
    if (invalidColors.length > 0) {
        showStatusMessage('Please fix invalid color values before generating theme', 'error');
        return;
    }
    
    isGeneratingTheme = true;
    updateApplyButton(true);
    showStatusMessage('AI is analyzing your colors and generating the perfect theme...', 'info');
    
    try {
        // Call backend API
        const response = await fetch('/api/apply-theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                colors: colors,
                instruction: "Assign each color intelligently to the best suited section of a professional website layout (header, footer, background, text, buttons, links). Return mapping as clean JSON."
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const themeMapping = await response.json();
        
        // Apply the theme
        applyThemeMapping(themeMapping);
        showStatusMessage('✨ AI theme applied successfully! Your colors have been intelligently assigned.', 'success');
        
    } catch (error) {
        console.error('Theme generation error:', error);
        
        // Fallback to default theme mapping
        const fallbackTheme = generateFallbackTheme(colors);
        applyThemeMapping(fallbackTheme);
        showStatusMessage('Using fallback theme assignment. AI service temporarily unavailable.', 'error');
    }
    
    isGeneratingTheme = false;
    updateApplyButton(false);
}

// Generate fallback theme when API fails
function generateFallbackTheme(colors) {
    // Simple fallback logic - assign colors based on luminance and contrast
    const sortedColors = colors.map(color => ({
        color: color,
        luminance: getLuminance(color)
    })).sort((a, b) => a.luminance - b.luminance);
    
    return {
        header: sortedColors[Math.floor(sortedColors.length * 0.3)].color,
        footer: sortedColors[Math.floor(sortedColors.length * 0.7)].color,
        background: sortedColors[0].color, // Lightest
        text: sortedColors[sortedColors.length - 1].color, // Darkest
        button: colors[0], // First user color
        link: colors[1] || colors[0] // Second user color or fallback
    };
}

// Calculate color luminance for fallback
function getLuminance(color) {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Apply theme mapping to CSS variables
function applyThemeMapping(themeMapping) {
    const root = document.documentElement;
    
    // Apply AI-generated theme
    if (themeMapping.header) root.style.setProperty('--ai-header', themeMapping.header);
    if (themeMapping.footer) root.style.setProperty('--ai-footer', themeMapping.footer);
    if (themeMapping.background) root.style.setProperty('--ai-background', themeMapping.background);
    if (themeMapping.text) root.style.setProperty('--ai-text', themeMapping.text);
    if (themeMapping.button) root.style.setProperty('--ai-button', themeMapping.button);
    if (themeMapping.link) root.style.setProperty('--ai-link', themeMapping.link);
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

// Update apply button state
function updateApplyButton(isLoading) {
    const button = document.getElementById('applyThemeBtn');
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (isLoading) {
        button.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';
    } else {
        button.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    }
}

// Show status messages
function showStatusMessage(message, type) {
    const statusElement = document.getElementById('statusMessage');
    const statusText = statusElement.querySelector('.status-text');
    
    statusText.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';
    
    // Auto-hide success and info messages after 5 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Setup sidebar toggle functionality
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (window.innerWidth <= 768) {
                toggleSidebarOverlay();
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
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

// Toggle sidebar overlay for mobile
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
    
    // Trigger reflow for animation
    overlay.offsetHeight;
    overlay.classList.add('active');
}

// Remove sidebar overlay
function removeSidebarOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Handle window resize
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    
    // Close sidebar on desktop when resizing from mobile
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        removeSidebarOverlay();
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 't':
                e.preventDefault();
                document.getElementById('sidebarToggle').click();
                break;
            case 'Enter':
                if (e.target.classList.contains('color-text')) {
                    e.preventDefault();
                    document.getElementById('applyThemeBtn').click();
                }
                break;
            case '=':
            case '+':
                e.preventDefault();
                addNewColorInput();
                break;
        }
    }
    
    // ESC to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            removeSidebarOverlay();
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initThemeGenerator);

// Export theme functionality (for future enhancement)
function exportGeneratedTheme() {
    const root = document.documentElement;
    const currentTheme = {
        header: getComputedStyle(root).getPropertyValue('--ai-header').trim(),
        footer: getComputedStyle(root).getPropertyValue('--ai-footer').trim(),
        background: getComputedStyle(root).getPropertyValue('--ai-background').trim(),
        text: getComputedStyle(root).getPropertyValue('--ai-text').trim(),
        button: getComputedStyle(root).getPropertyValue('--ai-button').trim(),
        link: getComputedStyle(root).getPropertyValue('--ai-link').trim()
    };
    
    const themeData = {
        name: 'AI Generated Theme',
        mapping: currentTheme,
        colors: getAllColors(),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-theme-generated.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showStatusMessage('Theme exported successfully!', 'success');
}

// Add CSS styles for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .color-input-group {
        transition: all 0.3s ease;
    }
    
    .status-message {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);